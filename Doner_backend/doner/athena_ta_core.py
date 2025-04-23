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
from .course_data_extractor import CourseDataExtractor


def resolve_path(path: str) -> str:
    """Resolve path to an absolute one"""
    # return if it is just an absolute one
    if os.path.isabs(path):
        return path
    
    # obtain the absolute directory that this program is in
    cwd = os.path.dirname(os.path.abspath(__file__))
    
    # remove the beginning "/" or "\\"
    if path.startswith('/') or path.startswith('\\'):
        path = path[1:]
    
    abs_path = os.path.normpath(os.path.join(cwd, path))
    
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
    content_vector_store_path: str = 'vector_store_content.faiss'
    course_vector_store_path: str = 'vector_store_courses.faiss'
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
    """Manages multiple vector stores creation and retrieval"""

    def __init__(self, embeddings):
        self.embeddings = embeddings

    def create_vector_store(self, documents: List[Document], config: AthenaConfig, batch_size: int = None) -> FAISS:
        """Create a vector store from documents with batched processing"""
        text_splitter = CharacterTextSplitter(
            chunk_size=config.chunk_size, 
            chunk_overlap=config.chunk_overlap
        )
        vector_store = None

        # Use config batch size if none specified
        if batch_size is None:
            batch_size = config.batch_size

        try:
            # Process documents in batches
            for i in range(0, len(documents), batch_size):
                batch = documents[i:i + batch_size]
                # Handle different document types - string vs Document objects
                split_docs = batch
                if isinstance(documents[0], str):
                    split_docs = text_splitter.split_documents(
                        [Document(page_content=doc) for doc in batch]
                    )

                if vector_store is None:
                    vector_store = FAISS.from_documents(split_docs, self.embeddings)
                else:
                    vector_store.add_documents(split_docs)

                print(f'Processed batch {i//batch_size + 1}/{len(documents)//batch_size + 1}')

            return vector_store
        except Exception as e:
            raise ValueError(f"Vector store creation failed: {str(e)}")

    def load_or_create_vector_store(self, 
                                    documents: List[Any], 
                                    config: AthenaConfig, 
                                    vector_store_path: str) -> FAISS:
        """Load existing vector store or create a new one at the specified path"""

        if not os.path.isabs(vector_store_path):
            vector_store_path = os.path.join(os.path.dirname(__file__), vector_store_path)

        vector_store_dir = os.path.dirname(vector_store_path)

        os.makedirs(vector_store_dir, exist_ok=True)

        if os.path.exists(vector_store_path):
            try:
                return FAISS.load_local(
                    vector_store_path,
                    embeddings=self.embeddings,
                    allow_dangerous_deserialization=True
                )
            except Exception as e:
                print(f"Error loading vector store: {e}. Creating new vector store...")
        else:
            print(f"Vector store not found at {vector_store_path}. Creating new vector store...")

        vector_store = self.create_vector_store(documents, config)

        if vector_store is not None:
            vector_store.save_local(vector_store_path)
            print(f"Vector store saved to {vector_store_path}")
        else:
            raise ValueError("Vector store creation returned None")

        return vector_store

class ChainManager:
    """Manages the creation and access of LangChain chains"""

    def __init__(self, llm, retriever, is_recommend):
        self.llm = llm
        self.retriever = retriever
        self.chains = {}
        if is_recommend is False:
            self._initialize_chains()
        else:
            self._initialize_recommend_chains()

    def _initialize_chains(self):
        """Initialize all specialized chains"""
        self.chains["qa"] = AthenaPrompts.create_qa_chain(self.llm, self.retriever)
        self.chains["report"] = AthenaPrompts.create_report_chain(self.llm, self.retriever)
        self.chains["assignment_review"] = AthenaPrompts.create_assignment_review_chain(self.llm, self.retriever)
        self.chains["in_context_qa"] = AthenaPrompts.create_in_context_qa_chain(self.llm, self.retriever)

    def _initialize_recommend_chains(self):
        """You know... Just initialize the chains for recommendation"""
        self.chains["recommend"] = AthenaPrompts.create_recommender_chain(self.llm, self.retriever)

    def get_chain(self, chain_type: str):
        """Get a specific chain by type"""
        if chain_type not in self.chains:
            raise ValueError(f"Unknown chain type: {chain_type}")
        return self.chains[chain_type]

class Athena:
    """Main Athena assistant class with multiple specialized components"""

    def __init__(self, config: Optional[AthenaConfig] = None, db_uri: str = None, **kwargs):
        """Initialize Athena with configuration"""
        # Handle both direct kwargs and config object
        if config is None:
            config = AthenaConfig(**kwargs)
        self.config = config
        self.db_uri = db_uri

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
        """Initialize system components and multiple vector stores"""
        # Initialize embeddings
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model=self.config.embedding_model, 
            google_api_key=self.config.api_key
        )

        # Initialize vector store manager
        vector_store_manager = VectorStoreManager(self.embeddings)

        # 1. Load educational content documents for AthenaTutor and AthenaReviewer
        self.content_documents = DocumentLoader.load_files(self.config.resolve_directory)
        self.content_vector_store = vector_store_manager.load_or_create_vector_store(
            self.content_documents, 
            self.config,
            self.config.content_vector_store_path
        )
        self.content_retriever = self.content_vector_store.as_retriever()

        # 2. Load course data from database for AthenaRecommender
        if self.db_uri:
            course_extractor = CourseDataExtractor(self.db_uri)
            self.course_documents = course_extractor.extract_course_documents()
            self.course_vector_store = vector_store_manager.load_or_create_vector_store(
                self.course_documents,
                self.config,
                self.config.course_vector_store_path
            )
            self.course_retriever = self.course_vector_store.as_retriever()
        else:
            print("Warning: Database URI not provided. AthenaRecommender will not be available.")
            self.course_vector_store = None
            self.course_retriever = None

        # Initialize LLM
        self.llm = ChatGoogleGenerativeAI(
            model=self.config.model, 
            temperature=self.config.temperature, 
            google_api_key=self.config.api_key
        )

        # Initialize chain managers for different functionalities
        self._initialize_chains()

    def _initialize_chains(self):
        """Initialize specialized chain managers for different functionalities"""
        # Chain manager for content-based operations (tutor and reviewer)
        self.content_chain_manager = ChainManager(llm=self.llm, retriever=self.content_retriever, is_recommend=True)

        # Initialize recommender if course data is available
        if self.course_retriever:
            self.course_chain_manager = ChainManager(llm=self.llm, retriever=self.course_retriever, is_recommend=True)


    def generate(self, query: str) -> Dict[str, Any]:
        """Generate a response using the general QA chain (AthenaTutor)"""
        return self.content_chain_manager.get_chain("qa").invoke(query)

    def generate_report(self, query: str) -> Dict[str, Any]:
        """Generate a report using the report chain (AthenaTutor)"""
        return self.content_chain_manager.get_chain("report").invoke(query)

    def generate_without_rag(self, query: str) -> str:
        """Generate a response without using RAG retrieval"""
        formatted_prompt = AthenaPrompts.format_no_rag_prompt(query)
        return self.llm.invoke(formatted_prompt)

    def retrieve_documents_only(self, query: str) -> List[Document]:
        """Only retrieve educational content documents without generating a response"""
        return self.content_retriever.invoke(query)

    def review_assignment(self, task_requirements: str, submitted_content: str) -> Dict[str, Any]:
        """Review an assignment using the assignment review chain (AthenaReviewer)"""
        combined_query = f"Assignment Requirements: {task_requirements}\n\nStudent Submission: {submitted_content}"
        return self.content_chain_manager.get_chain("assignment_review").invoke(combined_query)

    def generate_in_context(self, query: str, context: str) -> Dict[str, Any]:
        """Generate answer based on the post context and user query (AthenaTutor)"""
        combined_query = f"User Question: {query}\n\nRelevant Context: {context}"
        return self.content_chain_manager.get_chain("in_context_qa").invoke(combined_query)

    # New AthenaRecommender methods
    def recommend_courses(self, user_info: str) -> Dict[str, Any]:
        """
        Recommend courses based on user profile information

        Args:
            user_info: String describing user's background, interests, and goals

        Returns:
            Dictionary with recommendation results including course IDs
        """
        if not self.course_retriever:
            return {"error": "Course recommender is not available"}

        formatted_query = f"User Profile for Course Recommendations: {user_info}"
        return self.course_chain_manager.get_chain("recommend").invoke(formatted_query)

    def search_courses(self, query: str, k: int = 5) -> Dict[str, Any]:
        """
        Search for courses based on a user query, returning only course IDs
        directly from vector similarity search

        Args:
            query: Search query string
            k: Number of results to return (default: 5)

        Returns:
            Dictionary with course IDs and similarity scores
        """
        if not self.course_vector_store:
            return {"error": "Course search is not available"}

        # Perform direct vector similarity search
        results = self.course_vector_store.similarity_search_with_score(query, k=k)

        # Extract course IDs and scores
        courses = []
        for doc, score in results:
            # Only include results that have course_id in metadata
            if 'course_id' in doc.metadata:
                courses.append({
                    "course_id": doc.metadata['course_id'],
                    "course_name": doc.metadata.get('course_name', 'Unknown'),
                    "similarity_score": float(score),  # Convert to float for JSON serialization
                    "metadata": {
                        k: v for k, v in doc.metadata.items() 
                        if k not in ['course_id', 'course_name']
                    }
                })

        return {
            "query": query,
            "courses": courses
        }

    def search_course_ids(self, query: str, k: int = 5) -> List[int]:
        """
        Search for courses based on a user query and only return the course IDs.

        Args:
            query: Search query string
            k: Number of results to return (default: 5)

        Returns:
            Dictionary with course IDs and similarity scores
        """
        if not self.course_vector_store:
            return {"error": "Course search is not available"}

        results = self.course_vector_store.similarity_search_with_score(query, k=k)

        course_ids = []

        for doc, score in results:
            if 'course_id' in doc.metadata:
                course_ids.append(doc.metadata['course_id']),

        return course_ids


def create_athena_client():
    api_key = os.getenv('GOOGLE_API_KEY', '')
    db_uri = os.getenv('SQLALCHEMY_DATABASE_URI', '')

    if not api_key:
        raise ValueError("API Key is required. Set the GOOGLE_API_KEY environment variable.")

    if not db_uri:
        print("Warning: DATABASE_URI environment variable not set. AthenaRecommender will be disabled.")

    try:
        athena_client = Athena(
            api_key=api_key,
            directory='study_materials',
            model='gemini-2.0-flash',
            db_uri=db_uri
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

