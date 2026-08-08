# app/rag.py

from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from dotenv import load_dotenv
import os

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0.3,
    api_key=GROQ_API_KEY
)

SYSTEM_PROMPT = """You are a project management assistant.
When given a user's query and relevant tasks, provide a brief helpful summary.
Mention task titles, their status if available, and how they relate to the query.
If no relevant tasks were found, say so clearly. Keep it under 100 words."""


def generate_summary(query: str, search_results: dict) -> str:
    if not search_results["ids"][0]:
        return "No tasks found matching your query."

    tasks_context = ""
    for i, (doc, metadata) in enumerate(
        zip(search_results["documents"][0], search_results["metadatas"][0])
    ):
        tasks_context += f"{i+1}. [Task #{metadata['task_id']}] {doc}\n"

    messages = [
        SystemMessage(SYSTEM_PROMPT),
        HumanMessage(f"Query: {query}\n\nRelevant tasks:\n{tasks_context}")
    ]

    ai_message = llm.invoke(input=messages)
    return ai_message.content