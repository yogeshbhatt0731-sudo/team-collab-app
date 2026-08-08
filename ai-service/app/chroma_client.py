import chromadb

client = chromadb.PersistentClient(path="./chroma_data")

collection = client.get_or_create_collection(name="tasks")

def index_tasks(task_id:int,title:str,description:str = ""):
    """
    Store a task's text in ChromaDB as a vector embedding.

    ChromaDB handles:
    1. Converting the text to an embedding (vector of numbers)
    2. Storing the embedding + metadata
    3. Making it searchable

    The 'documents' field is what gets embedded (converted to a vector).
    The 'metadatas' field is stored alongside but NOT embedded — used for filtering/display.
    The 'ids' field is a unique identifier — upserting with the same ID updates the existing entry.
    """

    document = f"{title}. {description}" if description else title

    collection.upsert(
        ids=[str(task_id)],          # unique ID — string required by ChromaDB
        documents=[document],         # text that gets embedded
        metadatas=[{                  # extra data stored alongside (not embedded)
            "task_id": task_id,
            "title": title
        }]
    )

def search_tasks(query: str, n_results: int = 5):
    """
    Find tasks semantically similar to the query.

    ChromaDB handles:
    1. Converting the query text to an embedding
    2. Comparing it against all stored task embeddings
    3. Returning the closest matches ranked by similarity

    Returns a dict with 'ids', 'documents', 'metadatas', and 'distances'.
    'distances' = how far apart the vectors are (lower = more similar).
    """
    results = collection.query(
        query_texts=[query],       # the search query — gets embedded automatically
        n_results=n_results        # how many results to return
    )
    return results

