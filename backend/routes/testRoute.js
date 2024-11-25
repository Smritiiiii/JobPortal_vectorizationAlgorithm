import express from "express";
import index from "../utils/pineconeUtils.js";

const router = express.Router();

router.get("/test-pinecone", async (req, res) => {
  try {
    // Describe the index to check its status
    const indexDescription = await index.describeIndexStats();

    // Respond with the index information
    res.status(200).json({
      message: "Pinecone is successfully connected!",
      indexDescription,
    });
  } catch (error) {
    console.error("Error testing Pinecone integration:", error);
    res.status(500).json({ error: "Failed to connect to Pinecone" });
  }
});

export default router;
