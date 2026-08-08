# app/main.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from app.chroma_client import index_tasks, search_tasks, collection
from app.rag import generate_summary

app = FastAPI()


# --- Request/Response Models (like DTOs in Spring Boot) ---

class IndexRequest(BaseModel):
    """Sent by workspace-service when a task is created/updated."""
    task_id: int
    title: str
    description: str = ""


class SearchRequest(BaseModel):
    """Sent by workspace-service when a user searches."""
    query: str
    n_results: int = 5


class SearchResponse(BaseModel):
    """Returned to workspace-service with raw results + LLM summary."""
    task_ids: list[int]
    summary: str


# --- Endpoints ---

@app.post("/index")
def index(request: IndexRequest):
    """
    Index a task in ChromaDB. Called by workspace-service on task create/update.

    Equivalent to: POST <http://ai-service:8083/index>
    Body: { "task_id": 1, "title": "Implement login", "description": "JWT-based auth" }
    """
    index_tasks(request.task_id, request.title, request.description)
    return {"status": "indexed", "task_id": request.task_id}


@app.get("/search")
def search(query: str, n_results: int = 5):
    """
    Search for tasks semantically similar to the query, with LLM summary.

    Equivalent to: GET <http://ai-service:8083/search?query=login&n_results=5>

    Flow:
    1. ChromaDB finds similar tasks (vector search)
    2. LangChain + LLM generates a natural language summary
    3. Returns both: matching task IDs + summary text
    """
    results = search_tasks(query, n_results)

    # Extract task IDs from results
    task_ids = []
    if results["ids"][0]:
        task_ids = [int(id) for id in results["ids"][0]]

    # Generate LLM summary (the RAG part)
    summary = generate_summary(query, results)

    return SearchResponse(task_ids=task_ids, summary=summary)


@app.delete("/index/{task_id}")
def delete_index(task_id: int):
    """
    Remove a task from the ChromaDB index. Called when a task is deleted.
    """
    try:
        collection.delete(ids=[str(task_id)])
        return {"status": "deleted", "task_id": task_id}
    except Exception:
        raise HTTPException(status_code=404, detail="Task not found in index")


@app.get("/health")
def health():
    """Health check for Docker/deployment."""
    return {"status": "healthy", "indexed_tasks": collection.count()}