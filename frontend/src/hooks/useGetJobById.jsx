import { setSingleJob } from '@/redux/jobSlice';
import { JOB_API_ENDPOINT } from '@/utilis/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetJobById = (jobId) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_ENDPOINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                }
            } catch (error) {
                console.error("Failed to fetch job:", error);
            }
        };

        // Fetch job data when jobId changes
        if (jobId) {
            fetchSingleJob();
        }
    }, [jobId, dispatch]);
};

export default useGetJobById;
