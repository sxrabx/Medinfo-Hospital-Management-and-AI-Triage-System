import os
from typing import List, Tuple
import chromadb

class VectorDB:
    def __init__(self):
        """Initialize ChromaDB for semantic document search."""
        chroma_path = "./data/chroma_db"
        
        # Use PersistentClient for ChromaDB 1.x
        self.client = chromadb.PersistentClient(path=chroma_path)
        
        # Create or get the medical documents collection
        self.collection = self.client.get_or_create_collection(
            name="medical_documents",
            metadata={"hnsw:space": "cosine"}
        )
        self.documents_loaded = False

    def load_documents(self, docs_path: str):
        """Load documents from the medical_docs folder into ChromaDB."""
        if not os.path.exists(docs_path):
            print(f"Documents path {docs_path} does not exist.")
            return

        documents = []
        metadatas = []
        ids = []
        
        doc_id = 0
        for filename in os.listdir(docs_path):
            if filename.endswith(".txt"):
                filepath = os.path.join(docs_path, filename)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                    documents.append(content)
                    metadatas.append({
                        "source": filename,
                        "type": "medical_document"
                    })
                    ids.append(f"doc_{doc_id}")
                    doc_id += 1

        if documents:
            try:
                # Add documents to ChromaDB collection
                self.collection.add(
                    documents=documents,
                    metadatas=metadatas,
                    ids=ids
                )
                self.documents_loaded = True
                print(f"Successfully loaded {len(documents)} documents into ChromaDB.")
            except Exception as e:
                print(f"Error adding documents to ChromaDB: {e}")
        else:
            print("No documents found to load.")

    def search_docs(self, query: str, top_k: int = 3) -> List[Tuple[str, float]]:
        """Search for relevant documents using ChromaDB semantic search."""
        if not self.documents_loaded:
            print("Warning: No documents loaded in ChromaDB")
            return [(f"No documents available. Please ensure medical_docs are loaded.", 1.0)]
        
        try:
            # Query ChromaDB for similar documents
            results = self.collection.query(
                query_texts=[query],
                n_results=top_k
            )
            
            # Format results as (document_content, distance_score) tuples
            if results and 'documents' in results and results['documents']:
                docs = results['documents'][0] if len(results['documents']) > 0 else []
                distances = results.get('distances', [[]])[0] if 'distances' in results else [1.0] * len(docs)
                
                if docs:
                    # Convert distances to similarity scores (lower distance = higher similarity)
                    formatted_results = [
                        (doc, 1.0 - min(1.0, dist))  # Normalize distance to 0-1 range
                        for doc, dist in zip(docs, distances)
                    ]
                    return formatted_results
            
            return [(f"No relevant documents found for: {query}", 1.0)]
        
        except Exception as e:
            print(f"Error searching documents in ChromaDB: {e}")
            return [(f"Error searching documents: {str(e)}", 1.0)]

    def delete_all_documents(self):
        """Delete all documents from the ChromaDB collection."""
        try:
            self.client.delete_collection(name="medical_documents")
            self.collection = self.client.get_or_create_collection(
                name="medical_documents",
                metadata={"hnsw:space": "cosine"}
            )
            self.documents_loaded = False
            print("All documents deleted from ChromaDB.")
        except Exception as e:
            print(f"Error deleting documents: {e}")