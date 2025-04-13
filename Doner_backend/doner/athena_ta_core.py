import datetime
import os
import time
from dotenv import load_dotenv
from bs4 import BeautifulSoup
from pypdf import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain.schema import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import RetrievalQA
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI


load_dotenv()

class Athena:
    embeddings = None
    vector_store = None
    qa_chain = None
    llm = None

    @staticmethod
    def load_files(directory: str):
        documents = []

        for root, _, files in os.walk(directory):
            # print("Reading from folder:", root)
            for filename in files:
                if not filename.endswith(('.html', '.htm', '.md', '.pdf', 'DS_Store')):
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
                        documents.append(text)
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



    def __init__(self, api_key: str, directory: str, model: str):
        self.api_key = api_key
        self.documents = self.load_files(directory)
        self.model = model
        self.initialize_system()


    def initialize_system(self):
        if self.api_key == '':
            print("API Key Not Set. Athena Intelligence Not Available.\n Peylix is watching you 👁️.")
            return

        if Athena.embeddings is None:
            Athena.embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004", google_api_key=self.api_key)
            # print("Embeddings initialized.")


        if os.path.exists('vector_store.faiss'):
            Athena.vector_store = FAISS.load_local('vector_store.faiss',
                                                   embeddings=Athena.embeddings,
                                                   allow_dangerous_deserialization=True)
            # print('Vector store loaded.')
        else:
            print('Vector store not found. Creating new vector store...')

            # Create a FAISS vector store from the documents and their embeddings
            Athena.vector_store = self.create_vector_store_batched(self.documents, Athena.embeddings)
            print('Vector store created.')

            if Athena.vector_store is not None:
                Athena.vector_store.save_local('vector_store.faiss')
                print('Vector store saved.')
            else:
                raise Exception("Vector store creation failed. Please check the input documents and embeddings.")


        if self.model == "gemini-2.0-flash":
            Athena.llm = ChatGoogleGenerativeAI(model=self.model, temperature=0.6, google_api_key=self.api_key)
        else:
            raise Exception("LLM Provider Not Supported. Peylix is Watching You.")

        # Establish RAG pipeline
        prompt_template = """
        Instructions:
        You are an AI teaching assistant specialized in providing guidance and assistance to junior students.
        Based on the retrieved course-related materials, respond to the User Query.
        Note that your response should be heuristic. When the student is asking a complex question, you should
        not directly give the answer, but encourage the student to discover the answer by themselves.

        Retrieved Documents:
        {context}

        User Query:
        {question}
        """

        prompt = ChatPromptTemplate.from_template(prompt_template)

        Athena.qa_chain = RetrievalQA.from_chain_type(
            llm=Athena.llm,
            chain_type="stuff",
            retriever=Athena.vector_store.as_retriever(),
            chain_type_kwargs={"prompt": prompt}
        )


    def generate_report(self, query: str) -> str:
        """
        Generate a step-by-step report (in plain text) based on the user query.
        Internally uses the same RAG pipeline, but we prepend instructions
        so that the final answer is more like a detailed, step-by-step guide.
        """
        # You can tailor these instructions as needed
        system_instructions = (
            '''
            You are an AI Teaching Assistant. The user wants a PDF report that 
            explains step-by-step how to approach the problem or question. 
            Please provide a thorough, numbered list of steps or instructions,
            followed by a concise summary at the end.
            '''
        )

        # Combine your system instructions with the user query
        augmented_query = f"{system_instructions}\n\nUser Query: {query}"

        # Use the same RAG pipeline, but with the augmented query
        answer = Athena.qa_chain.invoke(augmented_query)
        return answer




    def generate(self, query: str):
        answer = Athena.qa_chain.invoke(query)
        return answer


    def generate_without_rag(self, query: str):
        answer = Athena.llm.invoke(query)
        return answer


    def retrieve_documents_only(self, query: str):
        retrieved_docs = Athena.vector_store.as_retriever().invoke(query)
        return retrieved_docs


    def review_assignment(self, task_requirements: str, submitted_content: str):
        system_instructions = (
            '''
            You are asked to review the assignment submitted by a student. The
            requirements of the assignment and student's answer is provided bellow.
            Please provide your feedback for the student.
            '''
        )

        augmented_query = f"{system_instructions}\n\nAssignment Requirements:\n{task_requirements}\n\nStudent's Answer:\n{submitted_content}\n"

        answer = Athena.qa_chain.invoke(augmented_query)
        return answer



if __name__ == "__main__":
    api_key = os.getenv('GOOGLE_API_KEY', '')

    print("RAG Module Activated.\n")
    print("Type 'exit' or 'quit' to terminate the program.\n")
    
    print(f"Your API Key is {api_key}.\n")

    while True:
        query = input("Enter your query: ")
        if query.lower() in ['exit', 'quit']:
            print("Goodbye!")
            break

        try:
            start_time = time.time()

            athena_client = Athena(api_key=os.getenv('GOOGLE_API_KEY', ''),
                                   directory='study_materials',
                                   model='gemini-2.0-flash')

            answer = athena_client.generate(query)
            retrieved_docs = athena_client.retrieve_documents_only(query)

            end_time = time.time()

            total_time = end_time - start_time

            print("\nGenerated Answer:\n")
            print(answer['result'])
            print("\n" + "=" * 50 + "\n")

            print(f"total time: {total_time}")

            current_time = datetime.datetime.now().strftime('%m%d%H%M%S')
            with open(f'generated_answer{current_time}.txt',
                      'w', encoding='utf-8') as file:
                file.write(f"User Query: {query}\n")

                file.write("\nRetrieved Documents:\n")

                for idx, doc in enumerate(retrieved_docs, 1):
                    file.write(f"\nDocument {idx}:\n")
                    file.write(doc.page_content)
                    file.write("\n" + "-" * 40 + "\n")

                file.write("\nGenerated Answer:\n")
                file.write(answer['result'])
                file.write("\n" + "=" * 50 + "\n")
        except Exception as e:
            print(f"An error occurred: {e}")
            print("\n" + "=" * 50 + "\n")


athena_client = Athena(api_key=os.getenv('GOOGLE_API_KEY', ''),
                       directory='./doner/study_materials',
                       model='gemini-2.0-flash')

