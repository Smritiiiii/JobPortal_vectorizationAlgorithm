import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import axios from 'axios';
import { JOB_API_ENDPOINT } from '@/utilis/constant';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import useGetJobById from '@/hooks/useGetJobById';

const JobSetup = () => {
    const params = useParams();
    useGetJobById(params.id);  
    const { singleJob } = useSelector(store => store.job); 

    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        location: "",
        salary: "",
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
       
        // const formData = new FormData();
        // formData.append("title", input.title);
        // formData.append("description", input.description);
        // formData.append("requirements", input.requirements);
        // formData.append("location", input.location);
        // formData.append("salary", input.salary);

        try {
            setLoading(true);
            const res = await axios.put(`${JOB_API_ENDPOINT}/update/${params.id}`, input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (singleJob && singleJob._id === params.id) {  
            setInput({
                title: singleJob.title || "",
                description: singleJob.description || "",
                requirements: singleJob.requirements.join(', ') || "",
                location: singleJob.location || "",
                salary: singleJob.salary || "",
            });
        }
    }, [singleJob, params.id]);
    

    return (
        <div>
            <Navbar />
            <div className='max-w-xl mx-auto my-10 pt-5'>
                <form onSubmit={submitHandler}>
                    <div className='flex items-center gap-5 p-8'>
                        <Button onClick={() => navigate("/admin/jobs")} variant="outline" className="flex items-center gap-2 text-gray-500 font-semibold">
                            <ArrowLeft />
                            <span>Back</span>
                        </Button>
                        <h1 className='font-bold text-xl'>Job Setup</h1>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <Label>Job Title</Label>
                            <Input
                                type="text"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div className='col-span-2'>
                            <Label>Description</Label>
                            <Input
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div className='col-span-2'>
                            <Label>Requirements</Label>
                            <Input
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label>Salary</Label>
                            <Input
                                type="number"
                                name="salary"
                                value={input.salary}
                                onChange={changeEventHandler}
                            />
                        </div>
                    </div>
                    { 
                        loading ? (
                            <Button className="w-full my-4">
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full my-4">Update</Button>
                        )
                    } 
                </form>
            </div>
        </div>
    );
};

export default JobSetup;
