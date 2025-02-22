import datetime
import os
import time
from bs4 import BeautifulSoup
from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain.schema import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import RetrievalQA
from langchain.embeddings.base import Embeddings
from typing import List
import requests

# Create embeddings with Ollama and vector store
class OllamaEmbeddings(Embeddings):
    """
    Custom Embeddings class to interact with Ollama's API.
    """

    def __init__(self, model: str = "embedding-model-name", api_url: str = "http://localhost:11434"):
        """
        Initialize with the model name and Ollama API URL.
        """
        self.model = model
        self.api_url = api_url

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """
        Embed multiple documents by sending them to Ollama's API.
        """
        embeddings = []
        for text in texts:
            embedding = self.embed_query(text)
            embeddings.append(embedding)
        return embeddings

    def embed_query(self, text: str) -> List[float]:
        """
        Embed a single query/document.
        """
        payload = {
            "model": self.model,
            "input": text
        }
        response = requests.post(f"{self.api_url}/v1/embeddings", json=payload)
        if response.status_code != 200:
            raise ValueError(f"Error fetching embedding from Ollama: {response.text}")
        data = response.json()
        return data["data"][0]["embedding"]

    @property
    def embedding_dimension(self) -> int:
        """
        Return the dimension of the embeddings.
        """
        return 768


class TA_Client:
    embeddings = None
    vector_store = None
    qa_chain = None
    llm = None

    @staticmethod
    def load_files(directory: str):
        documents = []

        for root, _, files in os.walk(directory):
            for filename in files:
                if not filename.endswith(('.html', '.htm', '.md', 'pdf')):
                    print(f"Unexpected file format: {filename}")
                    print("File format should be '.html', '.htm', '.md', or '.pdf'")

                filepath = os.path.join(root, filename)
                try:
                    if filename.endswith(('.html', '.htm')):
                        with open(filepath, 'r', encoding='utf-8') as file:
                            soup = BeautifulSoup(file, 'html.parser')
                            text = soup.get_text(separator='\n')
                            documents.append(text)
                    elif filename.endswith('.md'):
                        with open(filepath, 'r', encoding='utf-8') as file:
                            text = file.read()
                            documents.append(text)
                    elif filename.endswith('.pdf'):
                        reader = PdfReader(filepath)
                        text = ""
                        for page in reader.pages:
                            text += page.extract_text() or ""
                except Exception as e:
                    print(f"Error processing file {filepath}: {str(e)}")
                    continue

        return documents


    @staticmethod
    def create_vector_store_batched(documents, embeddings, batch_size=100):
        """Batch process documents to create vector store"""
        text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
        vector_store = None

        try:
            for i in range(0, len(documents), batch_size):
                batch = documents[i:i + batch_size]
                split_docs = text_splitter.split_documents(
                    [Document(page_content=doc) for doc in batch]
                )

                if vector_store is None:
                    vector_store = FAISS.from_documents(split_docs, embeddings)
                else:
                    vector_store.add_documents(split_docs)

                print(f'Processed batch {i//batch_size + 1}/{len(documents)//batch_size + 1}')

            return vector_store
        except Exception as e:
            print(f"Error in create_vector_store_batched: {str(e)}")
            return None



    def __init__(self, api_key: str, directory: str, model: str = "gpt-4o"):
        self.api_key = api_key
        self.documents = self.load_files(directory)
        self.model = model
        self.initialize_system()


    def initialize_system(self):
        if TA_Client.embeddings is None:
            embeddings = OllamaEmbeddings(model="bge-m3")
            print("Embeddings initialized.")


        if os.path.exists('vector_store.faiss'):
            TA_Client.vector_store = FAISS.load_local('vector_store.faiss',
                                            embeddings=embeddings,
                                            allow_dangerous_deserialization=True)
            print('Vector store loaded.')
        else:
            print('Vector store not found. Creating new vector store...')

            # Create a FAISS vector store from the documents and their embeddings
            TA_Client.vector_store = self.create_vector_store_batched(self.documents, TA_Client.embeddings)
            print('Vector store created.')

            if TA_Client.vector_store is not None:
                TA_Client.vector_store.save_local('vector_store.faiss')
                print('Vector store saved.')
            else:
                raise Exception("Vector store creation failed. Please check the input documents and embeddings. Peylix is Watching You.")


        # Establish RAG pipeline
        prompt_template = """
        Instructions:
        You are an AI teaching assistant specialized in providing guidance and assistance to junior students.
        Based on the retrieved course-related materials, respond to the User Query.
        Note that your response should be heuristic. You should be directly give the answer, but encourage the student to discover the answer by themselves.

        Retrieved Documents:
        {context}

        User Query:
        {question}
        """

        prompt = ChatPromptTemplate.from_template(prompt_template)

        TA_Client.qa_chain = RetrievalQA.from_chain_type(
            llm=TA_Client.llm,
            chain_type="stuff",
            retriever=TA_Client.vector_store.as_retriever(),
            chain_type_kwargs={"prompt": prompt}
        )

        # prompt = ChatPromptTemplate.from_template(prompt_template)

        # def format_docs(docs):
            # return "\n\n".join(doc.page_content for doc in docs)

        # # Create a stuff chain with the custom prompt
        # combine_documents_chain = create_stuff_documents_chain(
        #     llm=llm,
        #     prompt=prompt,
        # )

        # qa_chain = (
        #     {
        #         "context": vector_store.as_retriever() | format_docs,
        #         "question": RunnablePassthrough(),
        #     }
        #     | prompt
        #     | llm
        #     # | StrOutputParser()
        # )

    def generate(self, query: str):
        answer = TA_Client.qa_chain.invoke(query)
        return answer

    def generate_without_rag(self, query: str):
        answer = TA_Client.llm.invoke(query)
        return answer

    def retrieve_documents_only(self, query: str):
        retrieved_docs = TA_Client.vector_store.as_retriever().invoke(query)
        return retrieved_docs


# if __name__ == "__main__":
#     print("RAG Module Activated.\n")
#     print("Type 'exit' or 'quit' to terminate the program.\n")
#
#
#     while True:
#         query = input("Enter your code-related query: ")
#         if query.lower() in ['exit', 'quit']:
#             print("Goodbye!")
#             break
#
#         try:
#             start_time = time.time()
#
#             ta_client = TA_Client(api_key='',
#                                   directory='docs',
#                                   model='gpt-4o')
#
#             answer = ta_client.generate(query)
#             retrieved_docs = ta_client.retrieve_documents_only(query)
#
#             end_time = time.time()
#
#             total_time = end_time - start_time
#
#             print("\nGenerated Code:\n")
#             print(answer['result'])
#             print("\n" + "=" * 50 + "\n")
#
#             print(f"total time: {total_time}")
#
#             current_time = datetime.datetime.now().strftime('%m%d%H%M%S')
#             with open(f'generated_code_{current_time}.txt',
#                       'w', encoding='utf-8') as file:
#                 file.write(f"User Query: {query}\n")
#
#                 file.write("\nRetrieved Documents:\n")
#
#                 for idx, doc in enumerate(retrieved_docs, 1):
#                     file.write(f"\nDocument {idx}:\n")
#                     file.write(doc.page_content)
#                     file.write("\n" + "-" * 40 + "\n")
#
#                 file.write("\nGenerated Code:\n")
#                 file.write(answer['result'])
#                 file.write("\n" + "=" * 50 + "\n")
#         except Exception as e:
#             print(f"An error occurred: {e}")
#             print("\n" + "=" * 50 + "\n")

