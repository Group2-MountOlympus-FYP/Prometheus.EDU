import os
import time
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, field

from bs4 import BeautifulSoup
from pypdf import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain.schema import Document
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI

from .athena_prompts import AthenaPrompts


def resolve_path(path: str) -> str:
    if os.path.isabs(path):
        return path

    # Obtain current working directory
    cwd = os.path.dirname(__file__)
    path = path.lstrip('/')
    # Form the absolute path
    abs_path = os.path.join(cwd, path)

    return abs_path


@dataclass
class AthenaConfig:
    """Configuration for the system"""
    api_key: str
    directory: str
    model: str = "gemini-2.0-flash"
    embedding_model: str = "models/text-embedding-004"
    temperature: float = 0.6
    chunk_size: int = 1000
    chunk_overlap: int = 100
    vector_store_path: str = 'vector_store.faiss'
    batch_size: int = 100

    resolve_directory: str = field(init=False, default="")

    def __post_init__(self):
        self.resolve_directory = resolve_path(self.directory)


class DocumentLoader:
    """Handling documents loading"""

    @staticmethod
    def load_files(directory: str) -> List[str]:
        documents = []
        supported_extensions = ('.html', '.htm', '.md', '.txt', '.pdf')

        for root, _, files in os.walk(directory):
            for filename in files:
                if filename.endswith('.DS_Store') or not filename.endswith(supported_extensions):
                    continue

                filepath = os.path.join(root, filename)

                try:
                    document_text = DocumentLoader._load_file(filepath, filename)
                    if document_text:
                        documents.append(document_text)
                except Exception as e:
                    raise Exception(f"Error processing file {filepath}: {str(e)}")

        return documents

    @staticmethod
    def _load_file(filepath: str, filename: str) -> Optional[str]:
        if filename.endswith(('.html', '.htm')):
            with open(filepath, 'r', encoding='utf-8') as file:
                soup = BeautifulSoup(file, 'html.parser')
                text = soup.get_text(separator='\n')
                return text
        elif filename.endswith(('.md', '.txt')):
            with open(filepath, 'r', encoding='utf-8') as file:
                text = file.read()
                return text
        elif filename.endswith('.pdf'):
            reader = PdfReader(filepath)
            text = ""
            for page in reader.pages:
                text += page.extract_text() or ""
            return text

        return None


class VectorStoreManager:
    """Manages vector store creation and retrieval"""

    def __init__(self, embeddings):
        self.embeddings = embeddings

    def create_vector_store(self, documents: List[str], config: AthenaConfig) -> FAISS:
        """Create a vector store from documents with batched processing"""
        text_splitter = CharacterTextSplitter(
            chunk_size=config.chunk_size, 
            chunk_overlap=config.chunk_overlap
        )
        vector_store = None

        try:
            for i in range(0, len(documents), config.batch_size):
                batch = documents[i:i + config.batch_size]
                split_docs = text_splitter.split_documents(
                    [Document(page_content=doc) for doc in batch]
                )

                if vector_store is None:
                    vector_store = FAISS.from_documents(split_docs, self.embeddings)
                else:
                    vector_store.add_documents(split_docs)

                print(f'Processed batch {i//config.batch_size + 1}/{len(documents)//config.batch_size + 1}')

            return vector_store
        except Exception as e:
            raise ValueError(f"Vector store creation failed: {str(e)}")

    def load_or_create_vector_store(self, documents: List[str], config: AthenaConfig) -> FAISS:
        """Load existing vector store or create a new one"""

        vector_store_path = config.vector_store_path
        if not os.path.isabs(vector_store_path):
            vector_store_path = os.path.join(os.path.dirname(__file__), vector_store_path)

        if os.path.exists(config.vector_store_path):
            return FAISS.load_local(
                config.vector_store_path,
                embeddings=self.embeddings,
                allow_dangerous_deserialization=True
            )
        else:
            print("Vector store not found. Creating new vector store...")
            vector_store = self.create_vector_store(documents, config)

            if vector_store is not None:
                vector_store.save_local(config.vector_store_path)
                print(f"Vector store saved to {config.vector_store_path}")
            else:
                raise ValueError("Vector store creation returned None")
 
            return vector_store


class ChainManager:
    """Manages the creation and access of LangChain chains"""

    def __init__(self, llm, retriever):
        self.llm = llm
        self.retriever = retriever
        self.chains = {}
        self._initialize_chains()

    def _initialize_chains(self):
        """Initialize all specialized chains"""
        self.chains["qa"] = AthenaPrompts.create_qa_chain(self.llm, self.retriever)
        self.chains["report"] = AthenaPrompts.create_report_chain(self.llm, self.retriever)
        self.chains["assignment_review"] = AthenaPrompts.create_assignment_review_chain(self.llm, self.retriever)
        self.chains["in_context_qa"] = AthenaPrompts.create_in_context_qa_chain(self.llm, self.retriever)

    def get_chain(self, chain_type: str):
        """Get a specific chain by type"""
        if chain_type not in self.chains:
            raise ValueError(f"Unknown chain type: {chain_type}")
        return self.chains[chain_type]


class Athena:
    """Main Athena assistant class"""

    def __init__(self, config: Optional[AthenaConfig] = None, **kwargs):
        """Initialize Athena with configuration"""
        # Handle both direct kwargs and config object
        if config is None:
            config = AthenaConfig(**kwargs)
        self.config = config

        # Validate configuration
        self._validate_config()

        # Initialize components
        self._initialize_system()


    def _validate_config(self):
        """Validate the configuration"""
        if not self.config.api_key:
            raise ValueError("API Key is required. Athena Intelligence not available. Peylix is watching you 👁️.")

        if not os.path.exists(self.config.resolve_directory):
            raise ValueError(f"Directory not found: {self.config.resolve_directory}")

        if self.config.model != "gemini-2.0-flash":
            raise ValueError(f"Only gemini-2.0-flash model is currently supported")


    def _initialize_system(self):
        """Initialize system components"""
        # Load documents
        self.documents = DocumentLoader.load_files(self.config.resolve_directory)

        # Initialize embeddings
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model=self.config.embedding_model, 
            google_api_key=self.config.api_key
        )

        # Initialize vector store
        vector_store_manager = VectorStoreManager(self.embeddings)
        self.vector_store = vector_store_manager.load_or_create_vector_store(
            self.documents, 
            self.config
        )

        # Initialize LLM
        self.llm = ChatGoogleGenerativeAI(
            model=self.config.model, 
            temperature=self.config.temperature, 
            google_api_key=self.config.api_key
        )

        # Initialize chain manager
        self.retriever = self.vector_store.as_retriever()
        self.chain_manager = ChainManager(self.llm, self.retriever)

    def generate(self, query: str) -> Dict[str, Any]:
        """Generate a response using the general QA chain"""
        return self.chain_manager.get_chain("qa").invoke(query)

    def generate_report(self, query: str) -> Dict[str, Any]:
        """Generate a report using the report chain"""
        return self.chain_manager.get_chain("report").invoke(query)

    def generate_without_rag(self, query: str) -> str:
        """Generate a response without using RAG retrieval"""
        formatted_prompt = AthenaPrompts.format_no_rag_prompt(query)
        return self.llm.invoke(formatted_prompt)

    def retrieve_documents_only(self, query: str) -> List[Document]:
        """Only retrieve documents without generating a response"""
        return self.retriever.invoke(query)

    def review_assignment(self, task_requirements: str, submitted_content: str) -> Dict[str, Any]:
        """Review an assignment using the assignment review chain"""
        combined_query = f"Assignment Requirements: {task_requirements}\n\nStudent Submission: {submitted_content}"
        return self.chain_manager.get_chain("assignment_review").invoke(combined_query)

    def generate_in_context(self, query: str, context: str) -> Dict[str, Any]:
        """Generate answer based on the post context and user query"""
        combined_query = f"User Question: {query}\n\nRelevant Context: {context}"
        return self.chain_manager.get_chain("in_context_qa").invoke(combined_query)


# Initialize with environment variable
def create_athena_client():
    api_key = os.getenv('GOOGLE_API_KEY', '')

    try:
        athena_client = Athena(
            api_key=api_key,
            directory='study_materials',
            model='gemini-2.0-flash'
        )
        return athena_client
    except Exception as e:
        raise Exception(f"Failed to initialize Athena client: {str(e)}")

# Create the client instance
athena_client = create_athena_client()


if __name__ == "__main__":
    api_key = os.getenv('GOOGLE_API_KEY', '')

    print("RAG Module Activated")
    print("Type 'exit' or 'quit' to terminate the program")

    if api_key:
        print("API Key is set")
    else:
        print("API Key is not set")
        exit(1)

    try:
        athena = Athena(api_key=api_key, directory='study_materials', model='gemini-2.0-flash')
    except Exception as e:
        print(f"Error initializing Athena: {e}")
        exit(1)

    while True:
        query = input("Enter your query: ")
        if query.lower() in ['exit', 'quit']:
            print("Goodbye!")
            break

        try:
            start_time = time.time()

            answer = athena.generate(query)
            retrieved_docs = athena.retrieve_documents_only(query)

            end_time = time.time()
            total_time = end_time - start_time

            print("\nGenerated Answer:\n")
            print(answer['result'])
            print("\n" + "=" * 50 + "\n")

            print(f"Total time: {total_time:.2f} seconds")

        except Exception as e:
            print(f"An error occurred: {e}")
            print("\n" + "=" * 50 + "\n")
