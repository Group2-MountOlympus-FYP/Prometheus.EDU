from typing import List, Dict, Any
from langchain.schema import Document
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .Course import Course, CourseStatus

class CourseDataExtractor:
    """Handles extraction of course data from the database for vector storage"""

    def __init__(self, db_uri: str):
        """Initialize with database connection string"""
        self.db_uri = db_uri
        self.engine = create_engine(db_uri)
        self.Session = sessionmaker(bind=self.engine)

    def extract_course_documents(self) -> List[Document]:
        """
        Extract course data from database and convert to Document objects
        for vector storage
        """
        session = self.Session()
        try:
            # Get all active courses
            courses = session.query(Course).filter(
                Course.status != CourseStatus.DELETED
            ).all()

            documents = []
            for course in courses:
                # Safely handle None values with get_value helper function
                category_value = self.get_value(course.category)
                level_value = self.get_value(course.level)

                # Create a document for each course with metadata
                content = f"""
                Course Name: {course.course_name}
                Description: {course.description}
                Institution: {course.institution}
                Level: {level_value}
                Category: {category_value}
                Rating: {course.rating}
                """

                # Add metadata for filtering and retrieval
                metadata = {
                    "course_id": course.id,
                    "course_name": course.course_name,
                    "level": level_value,
                    "category": category_value,
                    "institution": course.institution,
                    "type": "course",
                }

                documents.append(Document(
                    page_content=content,
                    metadata=metadata
                ))

            return documents
        finally:
            session.close()

    def get_value(self, enum_object):
        """Safely get the value of an enum object, handling None case"""
        if enum_object is None:
            return "Not specified"
        return enum_object.value

    def course_to_dict(self, course: Course) -> Dict[str, Any]:
        """Convert a course object to a dictionary for API response"""
        return {
            "id": course.id,
            "course_name": course.course_name,
            "description": course.description,
            "institution": course.institution,
            "level": self.get_value(course.level),
            "category": self.get_value(course.category),
            "rating": course.rating,
        }

