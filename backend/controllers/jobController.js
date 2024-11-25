import {Job} from "../models/JobModel.js"


export const postJob = async (req, res)=>{
    try {
        const {title, description, requirements, salary, location, jobType, experience , position, companyId}= req.body;
        // console.log("raw requirements", requirements);
        
     
        const jobRequirements = Array.isArray(requirements) 
        ? requirements 
        : requirements.split(',').map(req => req.trim());

        // console.log("processed requirements", jobRequirements)


        const userId = req.id;

        if(!title || !description  || !requirements  || !salary||!location || !jobType || !experience || !position ||!companyId){

            
            return res.status (400).json({
                message:"Something is missing",
                success:false 
            })
            
        }

       

        // console.log("here")
        const job = await Job.create({
            
            title,
            description,
            requirements:jobRequirements,
            salary:Number(salary),
            location,
            jobType,
            experiencelevel:experience,
            position,
            company:companyId,
            created_by:userId

        }) ;
        // console.log("here")
        return res.status(201).json({
            message:"New job created successfully",
            job,
            success:true
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Server error",
            error: error.message,
            success: false
        });
        
    }

   
}

export const getAllJobs = async(req, res) =>{
    try{
        const keyword = req.query.keyword || "";
        const query = {
            $or:[
                {title:{$regex:keyword , $options:"i"}},
                {description:{$regex:keyword , $options:"i"}},
            ]
        }
        const jobs= await Job.find(query).populate({
            path:"company"
        }).sort({createdAt:-1})
        if (!jobs){
            return res.status(404).json({
                message:"Job not found",
                success:false 
            })
        }
        return res.status (200).json({
            jobs,
            success:true 
        })
    }catch(error){
        console.log(error)
    }
}

export const getJobById = async(req, res)=>{
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"applications"
        });
        if(!job){
            return res.status(404).json({
                messsage:"jobs not found",
                success:false 
            })
        }
        return res.status(200).json({
            job, 
            sucess:true
        })
        
    } catch (error) {
        console.log(error)
        
    }
}



export const getAdminJobs = async (req, res)=>{
    try {
        const adminId = req.id;
        const jobs = await Job.find({created_by:adminId}).populate({
            path:"company",
            createdAt:-1
        })
        if(!jobs){
            return res.status(404).json({
                messsage:"jobs not found",
                success:false 
            })
        }
        return res.status(200).json({
            jobs, 
            success:true
        })
        
    } catch (error) {
        console.log(error)
    }

}




export const updateJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position } = req.body;

        const jobRequirements = requirements
        ? Array.isArray(requirements)
            ? requirements
            : requirements.split(',').map(req => req.trim())
        : []; 

        const updateData = {
            title,
            description,
            requirements: jobRequirements,
            salary,
            location,
            jobType,
            experiencelevel: experience,
            position,
        };

        const job = await Job.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Job updated successfully",
            job,
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            error: error.message,
            success: false
        });
    }
};


