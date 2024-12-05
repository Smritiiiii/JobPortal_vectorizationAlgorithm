import * as tf from "@tensorflow/tfjs";
import * as use from "@tensorflow-models/universal-sentence-encoder";

export const embedText = async (text) => {
  try {
    // Load  Universal Sentence Encoder model
    const model = await use.load();

    // Generate embeddings for the input text
    const embeddings = await model.embed([text]);

    return embeddings.arraySync()[0]; // Convert  to array
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
};


