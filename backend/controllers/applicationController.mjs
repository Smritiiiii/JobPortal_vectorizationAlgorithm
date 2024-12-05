import { Application } from "../models/ApplicationModel.js";
import { Job } from "../models/JobModel.js";
import { User } from "../models/UserModel.js";
import { embedText } from "../utils/embedding.js";
import { saveEmbeddingsToPinecone } from "../utils/pineconeUtils.js";
import * as tf from "@tensorflow/tfjs";

export const analyzeAppliedJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const files = req.files;

    if (!jobId) {
      return res.status(400).json({ 
        message: "Job id is required", 
        success: false });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({
        message: "CV files are required",
        success: false,
      });
    }

    const { parseCVSkills } = await import("../utils/resumeParser.cjs");

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false });
    }

    const jobRequirements = job.requirements;
    const jobEmbedding = await embedText(jobRequirements.join(" "));

    const applications = await Application.find({ job: jobId }).populate('applicant');
    if (applications.length === 0) {
      return res.status(404).json({
        message: "No applications found for this job.",
        success: false
      });
    }

    const cvEmbeddings = await Promise.all(
      applications.map(async (application) => {
        const cvSkills = await parseCVSkills(application.applicant.profile.resume); 
        const cvEmbedding = await embedText(cvSkills.join(" "));
        return {
          userId: application.applicant._id,
          skills: cvSkills,
          embedding: cvEmbedding,
        };
      })
    );


    // Cosine similarity calculation
    const calculateCosineSimilarity = (vecA, vecB) => {
      const dotProduct = tf.dot(vecA, vecB).dataSync()[0];
      const magnitudeA = tf.norm(vecA).dataSync()[0];
      const magnitudeB = tf.norm(vecB).dataSync()[0];
      return dotProduct / (magnitudeA * magnitudeB);
    };

    // Store CV embeddings to Pinecone
    // await saveEmbeddingsToPinecone(
    //   [
    //     { id: `job-${jobId}`, values: jobEmbedding, metadata: { type: "job" } },
    //     ...cvEmbeddings.map((cv) => ({
    //       id: cv.id,
    //       values: cv.embedding,
    //       metadata: { type: "cv", userId: cv.userId },
    //     })),
    //   ],
    //   "job-applications"
    // );

    // Calculate similarity for each CV against the job's requirements
    const results = cvEmbeddings.map((cv) => ({
      userId: cv.userId,
      skills: cv.skills,
      similarity: calculateCosineSimilarity(cv.embedding, jobEmbedding),
    }));


    // Sort the CVs by similarity, from most similar to least
    results.sort((a, b) => b.similarity - a.similarity);

    // Get the top match
    const topMatch = results[0,1];

    console.log("Top match details:", topMatch);
   
    const topApplicant = await User.findById(topMatch.userId).select('fullname email phoneNumber profile');

    if (!topApplicant) {
      return res.status(404).json({
        message: "Applicant not found for the top match",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Top matching CV found",
      success: true,
      data: {

        applicant: {
          fullname: topApplicant.fullname,
          email: topApplicant.email,
          phoneNumber: topApplicant.phoneNumber,
          resume: topApplicant.profile?.resume,
          resumeOriginalName: topApplicant.profile?.resumeOriginalName, // Assuming profile contains original resume name
        },
        similarity: topMatch.similarity, // Similarity score
      },
    });
   
    

  } catch (error) {
    console.error("Error in analyzeAppliedJob:", error.message);
    return res.status(500).json({
      message: "An error occurred while processing your request.",
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

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          message: "User not found.",
          success: false,
        });
      }
  
      // Check if the user is an admin
      if (user.role === "admin") {
        return res.status(403).json({
          message: "Admins are not allowed to apply for jobs.",
          success: false,
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
