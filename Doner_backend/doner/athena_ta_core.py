import datetime
import os
import time
from bs4 import BeautifulSoup
from pypdf import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain.schema import Document
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI

from .athena_prompts import AthenaPrompts


class Athena:
    embeddings = None
    vector_store = None
    llm = None

    # Chains for different functionalities
    qa_chain = None
    report_chain = None
    assignment_review_chain = None

    @staticmethod
    def load_files(directory: str):
        documents = []

        for root, _, files in os.walk(directory):
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
        self._initialize_system()


    def _initialize_system(self):
        if self.api_key == '':
            print("API Key Not Set. Athena Intelligence Not Available.\n Peylix is watching you 👁️.")
            return

        if Athena.embeddings is None:
            Athena.embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004", google_api_key=self.api_key)

        if os.path.exists('vector_store.faiss'):
            Athena.vector_store = FAISS.load_local('vector_store.faiss',
                                                   embeddings=Athena.embeddings,
                                                   allow_dangerous_deserialization=True)
        else:
            print('Vector store not found. Creating new vector store...')
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

        # Initialize specialized chains
        self.initialize_chains()


    def initialize_chains(self):
        """Initialize all specialized chains"""
        retriever = Athena.vector_store.as_retriever()

        # Standard QA chain
        Athena.qa_chain = AthenaPrompts.create_qa_chain(Athena.llm, retriever)

        # Report generation chain
        Athena.report_chain = AthenaPrompts.create_report_chain(Athena.llm, retriever)

        # Assignment review chain (with special handling)
        Athena.assignment_review_chain = AthenaPrompts.create_assignment_review_chain(Athena.llm, retriever)


    def generate(self, query: str):
        """Generate a response using the general QA chain"""
        answer = Athena.qa_chain.invoke(query)
        return answer


    def generate_report(self, query: str) -> str:
        """Generate a report using the report chain"""
        answer = Athena.report_chain.invoke(query)
        return answer


    def generate_without_rag(self, query: str):
        """Generate a response without using RAG retrieval"""
        formatted_prompt = AthenaPrompts.format_no_rag_prompt(query)
        answer = Athena.llm.invoke(formatted_prompt)
        return answer


    def retrieve_documents_only(self, query: str):
        """Only retrieve documents without generating a response"""
        retrieved_docs = Athena.vector_store.as_retriever().invoke(query)
        return retrieved_docs


    def review_assignment(self, task_requirements: str, submitted_content: str):
        """Review an assignment using the assignment review chain

        Note: This requires special handling because the assignment review template
        has an additional 'submission' parameter.
        """
        # this is to make it compatible with LangChain's standard QA chain.
        combined_query = f"Assignment Requirements: {task_requirements}\n\nStudent Submission: {submitted_content}"

        # The combined_query will be passed as the 'question' parameter
        # The actual submission will be extracted within the template itself
        answer = Athena.assignment_review_chain.invoke(combined_query)
        return answer


    def generate_in_context(self, query: str, context: str):
        """Generate answer based on the post context and user query"""
        combined_query = f"User Question: {query}\n\nRelevant Context: {context}"
        answer = Athena.context_chain.invoke(combined_query)

        return answer


athena_client = Athena(api_key=os.getenv('GOOGLE_API_KEY', ''),
                        directory='study_materials',
                        model='gemini-2.0-flash')


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

