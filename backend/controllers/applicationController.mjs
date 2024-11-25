import { Application } from "../models/ApplicationModel.js";
import { Job } from "../models/JobModel.js";
import { embedText } from "../utils/embedding.js";
import { saveEmbeddingsToPinecone } from "../utils/pineconeUtils.js";
import * as tf from "@tensorflow/tfjs"

export const analyzeAppliedJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;
    const files = req.files;

    // Ensure jobId and file exist
    if (!jobId) {
      return res.status(400).json({ message: "Job id is required", success: false });
    }
    if (!files || files.length === 0) {
      return res.status(400).json({
        message: "CV files are required",
        success: false,
      });
    }

    const { parseCVSkills } = await import('../utils/resumeParser.cjs');

    // Fetch job details
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    const jobRequirements = job.requirements;

    const jobEmbedding = await embedText(jobRequirements.join(" "));

    const cvEmbeddings = await Promise.all(
      files.map(async (file, index) => {
        const cvSkills = await parseCVSkills(file.buffer); // Extracted skills from CV
        const cvEmbedding = await embedText(cvSkills.join(" ")); // Embed CV skills
        return {
          id: `cv-${userId}-${jobId}-${index + 1}`,
          skills: cvSkills,
          embedding: cvEmbedding,
        };
      })
    );

    await saveEmbeddingsToPinecone(
      [
        { id: `job-${jobId}`, values: jobEmbedding, metadata: { type: "job" } },
        ...cvEmbeddings.map((cv) => ({
          id: cv.id,
          values: cv.embedding,
          metadata: { type: "cv" },
        })),
      ],
      "job-applications" // Namespace for job applications
    );

 // Cosine similarity calculation
 const calculateCosineSimilarity = (vecA, vecB) => {
  const dotProduct = tf.dot(vecA, vecB).dataSync()[0];
  const magnitudeA = tf.norm(vecA).dataSync()[0];
  const magnitudeB = tf.norm(vecB).dataSync()[0];
  return dotProduct / (magnitudeA * magnitudeB);
};

// Compare CVs with the job and calculate similarity scores
const results = cvEmbeddings.map((cv) => ({
  id: cv.id,
  skills: cv.skills,
  similarity: calculateCosineSimilarity(cv.embedding, jobEmbedding),
}));

// Sort CVs by similarity score (highest first)
results.sort((a, b) => b.similarity - a.similarity);

// Return top 2 matches
const topMatches = results.slice(0, 2);

// Create applications based on match percentage
topMatches.forEach(async (match) => {
  const skillsMatchPercentage = (match.similarity + 1) * 50; // Convert similarity to percentage (range -1 to 1 -> 0 to 100)
  const status = skillsMatchPercentage >= 80 ? "accepted" : "rejected";

  const newApplication = await Application.create({
    job: jobId,
    applicant: userId,
    status,
  });

  job.applications.push(newApplication._id);
  await job.save();
});

return res.status(201).json({
  message: "Job application processed. Top matching CVs have been considered.",
  success: true,
  data: topMatches, // Return top matches
});
} catch (error) {
console.error("Error in analyzeAppliedJob:", error.message);
return res.status(500).json({
  message: "An error occurred while processing your application.",
  success: false,
});
}
};

export const applyJob = async (req, res) => {
  try {
      const userId = req.id; 
      const jobId = req.params.id;
      
      if (!userId) {
          return res.status(401).json({ 
              message: "User not authenticated",
              success: false 
          });
      }

      if (!jobId) {
          return res.status(400).json({
              message: "Job id is required.",
              success: false
          });
      }
      
      // Check if the user has already applied for the job
      const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
      if (existingApplication) {
          return res.status(400).json({
              message: "You have already applied for this job",
              success: false
          });
      }

      // Check if the job exists
      const job = await Job.findById(jobId);
      if (!job) {
          return res.status(404).json({
              message: "Job not found",
              success: false
          });
      }
      
      // Create a new application with the applicant ID and job ID
      const newApplication = await Application.create({
          job: jobId,
          applicant: userId,
      });

      // Add the application ID to the job's applications array
      job.applications.push(newApplication._id);
      await job.save();

      return res.status(201).json({
          message: "Job applied successfully.",
          success: true
      });
  } catch (error) {
      console.log(error);
      res.status(500).json({
          message: "An error occurred while applying for the job.",
          success: false
      });
  }
};



export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        option: { sort: { createdAt: -1 } },
        populate: {
          path: "company",
          option: { sort: { createdAt: -1 } },
        },
      });
    if (!application) {
      return res.status(404).json({
        message: "No application",
        success: false,
      });
    }

    return res.status(200).json({
      application,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
      },
    });
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }
    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
    if (!status) {
      return res.status(404).json({
        message: "status is required",
        success: false,
      });
    }
    const application = await Application.findOne({ _id: applicationId });

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
        success: false,
      });
    }

    application.status = status.toLowerCase();
    await application.save();

    return res.status(200).json({
      message: "Status updated succesfully ",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
