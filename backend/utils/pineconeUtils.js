import { Pinecone } from '@pinecone-database/pinecone';


const pc = new Pinecone({
  apiKey: 'pcsk_5JqDTd_5T7Pnj12b5BDdcPvoTsyCw3TJsUvykZKehdkCeVa15NGnhsBpdUCCfiW5cEsaZf',
 
});


const index = pc.index('job-portal-index'); 


export const saveEmbeddingsToPinecone = async (embeddings, namespace = null) => {
  try {
    // Ensure embeddings is a properly formatted array
    if (!Array.isArray(embeddings) || embeddings.length === 0) {
      throw new Error("Embeddings must be a non-empty array.");
    }

    // Validate and format embeddings
    const formattedEmbeddings = embeddings.map((embedding) => {
      if (!embedding.id || !Array.isArray(embedding.values)) {
        throw new Error(`Invalid embedding format: ${JSON.stringify(embedding)}`);
      }
      return {
        id: embedding.id,        // Unique identifier
        values: embedding.values, // Embedding vector (array of numbers)
        metadata: embedding.metadata || {}, // Optional metadata
      };
    });

    // Check if namespace is provided
    const indexWithNamespace = namespace ? index.namespace(namespace) : index;

    // Call Pinecone's upsert method
    const upsertResponse = await indexWithNamespace.upsert(formattedEmbeddings);

    // console.log("Upsert response:", upsertResponse);
    return upsertResponse;
  } catch (error) {
    console.error("Error saving embeddings to Pinecone:", error.message);
    throw error;
  }
};
