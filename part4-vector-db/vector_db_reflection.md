## Vector DB Use Case

A traditional keyword-based database search would be entirely insufficient for the law firm's requirement. Keyword search operates on exact or partial string matching — it finds documents containing the literal words the user typed. If a lawyer queries "termination clauses" but the contract uses the phrase "conditions for contract dissolution" or "grounds for agreement rescission," a keyword system returns nothing useful. Legal language is notoriously varied: the same concept appears under dozens of different phrasings depending on jurisdiction, drafter style, or contract generation era.

Vector databases solve this through **semantic search**. The core idea is to convert both the contract text and the user's natural language query into dense numerical vectors — called embeddings — using a language model (such as `all-MiniLM-L6-v2` or a larger legal-domain model). These embeddings capture *meaning*, not just words. "What are the termination clauses?" and "Under what conditions can this agreement be ended?" produce embeddings that are geometrically close in vector space, even though they share no words.

The practical system would work as follows. Each 500-page contract is chunked into overlapping passages (e.g., 300-word segments with 50-word overlap). Each chunk is embedded and stored in a vector database such as Pinecone, Weaviate, or pgvector. When a lawyer poses a query in plain English, the query is embedded using the same model, and the database performs an **Approximate Nearest Neighbor (ANN)** search to retrieve the most semantically similar chunks — in milliseconds, even across a library of thousands of contracts.

Beyond retrieval, a Retrieval-Augmented Generation (RAG) pipeline can pass the top retrieved chunks to a large language model, which then synthesizes a precise answer with citations. This combination — vector search for recall, LLM for synthesis — would give lawyers accurate, clause-level answers from plain English questions, something no keyword index could achieve at any meaningful scale.

---
