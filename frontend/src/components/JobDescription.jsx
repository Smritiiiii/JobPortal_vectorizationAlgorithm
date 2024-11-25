import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { JOB_API_ENDPOINT, APPLICATION_API_ENDPOINT } from '@/utilis/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const JobDescription = () => {
    
    
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const isInitiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isInitiallyApplied);
    

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    

    const applyJobHandler = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            const res = await axios.get(`${APPLICATION_API_ENDPOINT}/apply/${jobId}`, { withCredentials: true });
           
            
            if (res.data.success) {
                setIsApplied(true);
                const updatedSingleJob = { ...singleJob, applications: [...singleJob.applications, { applicant: user?._id }] };
                
                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        // console.log("triggered by jobId", jobId);
        
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_ENDPOINT}/get/${jobId}`, { withCredentials: true });
                // console.log(res);
                
                if (res.data.sucess) {
                    // console.log(res.data.job);
                    
                    dispatch(setSingleJob(res.data.job));
                    
                    
                    setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id));
                    
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchSingleJob();
    }, [jobId, dispatch, singleJob, user?._id]);

    return (
        <div className='max-w-6xl mx-auto p-8 bg-white shadow-md rounded-lg'>
            <div className='flex items-center justify-between mb-6'>
                <div>
                    <h1 className='font-bold text-xl text-gray-800'>{singleJob?.title}</h1>
                    <div className='flex items-center gap-3 mt-3'>
                        <Badge className={'text-blue-700 font-medium'} variant="ghost">{singleJob?.position} Positions</Badge>
                        <Badge className={'text-[#F83002] font-medium'} variant="ghost">{singleJob?.jobType} Type</Badge>
                        <Badge className={'text-[#7209b7] font-medium'} variant="ghost">{singleJob?.salary}K</Badge>
                    </div>
                </div>
                <Button
                    onClick={isApplied ? null : applyJobHandler}
                    disabled={isApplied}
                    className={`rounded-lg ${isApplied  ? 'bg-gray-600 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'} text-white`}>
                    {isApplied ? 'Already Applied'  : 'Apply Now'}
                </Button>
            </div>
            <h2 className='text-lg font-semibold border-b-2 border-gray-200 pb-2 mb-4'>Job Details</h2>
            <div className='text-sm text-gray-700 space-y-4'>
                <p><span className='font-semibold'>Role:</span> {singleJob?.title}</p>
                <p><span className='font-semibold'>Location:</span> {singleJob?.location}</p>
                <p><span className='font-semibold'>Description:</span> {singleJob?.description}</p>
                <p><span className='font-semibold'>Experience:</span> {singleJob?.experiencelevel}yr</p>
                <p><span className='font-semibold'>Salary:</span> {singleJob?.salary}k</p>
                <p className='font-semibold'>Requirements:</p>
                <ul className='pl-6 list-disc'>
                    {singleJob?.requirements?.map((requirement, index) => (
                        <li key={index} className='text-gray-700 text-base'>{requirement}</li>
                    ))}
                </ul>
                <p><span className='font-semibold'>Posted Date:</span> {new Date(singleJob?.createdAt).toLocaleDateString()}</p>
            </div>
        </div>
    );
};
export default JobDescription;

