import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_ENDPOINT } from '@/utilis/constant'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice'

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState('');
    const dispatch = useDispatch();
    const registerNewCompany = async () => {
        try {
            const res = await axios.post(`${COMPANY_API_ENDPOINT}/register`, {companyName}, {
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            });
            console.log("Company Name ", companyName)
            if(res?.data?.success){
                // console.log(res.data)
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message);
                const companyId = res?.data?.company?._id;
                navigate(`/admin/companies/${companyId}`);
            }
        } catch (error) {
            console.log("Error response:", error.response);
        }
    }
    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto mt-10 pt-5'>
                <div className='my-10'>
                    <h1 className='font-bold text-2xl'>Your Company Name</h1>
                    <p className='text-gray-500'> You can change this name later.</p>
                </div>

                <Label>Company Name</Label>
                <Input
                    type="text"
                    className="my-2"
                    placeholder="Enter you company name "
                    onChange={(e) => setCompanyName(e.target.value)}
                />
                <div className='flex items-center gap-2 my-10'>
                    <Button variant="outline" onClick={() => navigate("/admin/companies")}>Cancel</Button>
                    <Button onClick={registerNewCompany}>Continue</Button>
                    
                </div>
            </div>
        </div>
    )
}

export default CompanyCreate