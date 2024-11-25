import React, { useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_ENDPOINT } from '@/utilis/constant';
import axios from 'axios';
import { Badge } from '../ui/badge';
import { useParams } from 'react-router-dom';

const shortlistingStatus = ["Accepted", "Rejected", "Analyze"];

// const ApplicantsTable = () => {
//     const { applicants } = useSelector(store => store.application);
//     const params = useParams();
//     const jobId  = params.id;

//     // State to track each applicant's status
//     const [applicantStatuses, setApplicantStatuses] = useState(
//         applicants?.applications?.reduce((acc, applicant) => {
//             acc[applicant._id] = applicant.status || null;
//             return acc;
//         }, {})
//     );

//     const statusHandler = async (status, id) => {
//         try {
//             axios.defaults.withCredentials = true;
//             const res = await axios.post(`${APPLICATION_API_ENDPOINT}/status/${id}/update`, { status });
//             if (res.data.success) {
//                 toast.success(res.data.message);

//                 // Update local status state to reflect the new status
//                 setApplicantStatuses(prevStatuses => ({
//                     ...prevStatuses,
//                     [id]: status,
//                 }));
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || 'An error occurred.');
//         }
//     };

//     const analyzeHandler = async (item) => {
//         try {
//             if (!item.applicant.profile?.resume) {
//                 toast.error("Resume is missing for this applicant.");
//                 return;
//             }

//             const resumeUrl = item.applicant.profile.resume;
//             const resumeResponse = await fetch(resumeUrl);
//             const resumeBlob = await resumeResponse.blob();
//             const resumeFile = new File([resumeBlob], item.applicant.profile.resumeOriginalName, {
//                 type: resumeBlob.type,
//             });

//             const formData = new FormData();
//             formData.append("file", resumeFile);
//             formData.append("jobId", jobId);

//             axios.defaults.withCredentials = true;
//             const res = await axios.post(`${APPLICATION_API_ENDPOINT}/analyzeapply/${jobId}`, formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 }
//             });

//             if (res.data.success) {
//                 const analysisResult = res.data.result; 
//                 toast.success(res.data.message);
//                 setApplicantStatuses(prevStatuses => ({
//                     ...prevStatuses,
//                     [item._id]: analysisResult,
//                 }));
//             } else {
//                 toast.error("Analysis failed. Please try again.");
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || "An error occurred while analyzing the application.");
//         }
//     };

//     return (
//         <div>
//             <Table>
//                 <TableCaption>A list of your recent applied users</TableCaption>
//                 <TableHeader>
//                     <TableRow>
//                         <TableHead>FullName</TableHead>
//                         <TableHead>Email</TableHead>
//                         <TableHead>Contact</TableHead>
//                         <TableHead>Resume</TableHead>
//                         <TableHead>Date</TableHead>
//                         <TableHead className="text-right">Action</TableHead>
//                     </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                     {applicants?.applications?.map((item) => (
//                         <TableRow key={item._id}>
//                             <TableCell>{item?.applicant?.fullname}</TableCell>
//                             <TableCell>{item?.applicant?.email}</TableCell>
//                             <TableCell>{item?.applicant?.phoneNumber}</TableCell>
//                             <TableCell>
//                                 {item.applicant?.profile?.resume ? (
//                                     <a
//                                         className="text-blue-600 cursor-pointer"
//                                         href={item?.applicant?.profile?.resume}
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                     >
//                                         {item?.applicant?.profile?.resumeOriginalName}
//                                     </a>
//                                 ) : (
//                                     <span>NA</span>
//                                 )}
//                             </TableCell>
//                             <TableCell>{item?.applicant.createdAt.split("T")[0]}</TableCell>
//                             <TableCell className="float-right cursor-pointer">
//                                 {applicantStatuses[item._id] ? (
//                                     <Badge
//                                         color={
//                                             applicantStatuses[item._id] === "Accepted"
//                                                 ? "green"
//                                                 : "red"
//                                         }
//                                     >
//                                         {applicantStatuses[item._id]}
//                                     </Badge>
//                                 ) : (
//                                     <Popover>
//                                         <PopoverTrigger>
//                                             <MoreHorizontal />
//                                         </PopoverTrigger>
//                                         <PopoverContent className="w-32">
//                                             {shortlistingStatus.map((status, index) => (
//                                                 <div
//                                                     onClick={() => {
//                                                         status === "Analyze"
//                                                             ? analyzeHandler(item)
//                                                             : statusHandler(status, item._id);
//                                                     }}
//                                                     key={index}
//                                                     className="flex w-fit items-center my-2 cursor-pointer"
//                                                 >
//                                                     <span>{status}</span>
//                                                 </div>
//                                             ))}
//                                         </PopoverContent>
//                                     </Popover>
//                                 )}
//                             </TableCell>
//                         </TableRow>
//                     ))}
//                 </TableBody>
//             </Table>
//         </div>
//     );
// };

// export default ApplicantsTable;
const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);
    const params = useParams();
    const jobId = params.id;

    const currentUser = useSelector(state => state.user); // Assuming user info is stored in Redux state
    const isAdmin = currentUser?.role === "recrutier";

    // Filter applicants to exclude the admin
    const filteredApplicants = applicants?.applications?.filter(item => item?.applicant?.role !== 'recrutier');

    // State to track each applicant's status
    const [applicantStatuses, setApplicantStatuses] = useState(
        filteredApplicants?.reduce((acc, applicant) => {
            acc[applicant._id] = applicant.status || null;
            return acc;
        }, {})
    );

    const statusHandler = async (status, id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_ENDPOINT}/status/${id}/update`, { status });
            if (res.data.success) {
                toast.success(res.data.message);

                // Update local status state to reflect the new status
                setApplicantStatuses(prevStatuses => ({
                    ...prevStatuses,
                    [id]: status,
                }));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred.');
        }
    };

    const analyzeHandler = async (item) => {
        try {
            if (!item.applicant.profile?.resume) {
                toast.error("Resume is missing for this applicant.");
                return;
            }

            const resumeUrl = item.applicant.profile.resume;
            const resumeResponse = await fetch(resumeUrl);
            const resumeBlob = await resumeResponse.blob();
            const resumeFile = new File([resumeBlob], item.applicant.profile.resumeOriginalName, {
                type: resumeBlob.type,
            });

            const formData = new FormData();
            formData.append("file", resumeFile);
            formData.append("jobId", jobId);

            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_ENDPOINT}/analyzeapply/${jobId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (res.data.success) {
                const analysisResult = res.data.result;
                toast.success(res.data.message);
                setApplicantStatuses(prevStatuses => ({
                    ...prevStatuses,
                    [item._id]: analysisResult,
                }));
            } else {
                toast.error("Analysis failed. Please try again.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred while analyzing the application.");
        }
    };

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent applied users</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredApplicants?.map((item) => (
                        <TableRow key={item._id}>
                            <TableCell>{item?.applicant?.fullname}</TableCell>
                            <TableCell>{item?.applicant?.email}</TableCell>
                            <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                            <TableCell>
                                {item.applicant?.profile?.resume ? (
                                    <a
                                        className="text-blue-600 cursor-pointer"
                                        href={item?.applicant?.profile?.resume}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {item?.applicant?.profile?.resumeOriginalName}
                                    </a>
                                ) : (
                                    <span>NA</span>
                                )}
                            </TableCell>
                            <TableCell>{item?.applicant.createdAt.split("T")[0]}</TableCell>
                            <TableCell className="float-right cursor-pointer">
                                {applicantStatuses[item._id] ? (
                                    <Badge
                                        color={
                                            applicantStatuses[item._id] === "Accepted"
                                                ? "green"
                                                : "red"
                                        }
                                    >
                                        {applicantStatuses[item._id]}
                                    </Badge>
                                ) : (
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32">
                                            {shortlistingStatus.map((status, index) => (
                                                <div
                                                    onClick={() => {
                                                        status === "Analyze"
                                                            ? analyzeHandler(item)
                                                            : statusHandler(status, item._id);
                                                    }}
                                                    key={index}
                                                    className="flex w-fit items-center my-2 cursor-pointer"
                                                >
                                                    <span>{status}</span>
                                                </div>
                                            ))}
                                        </PopoverContent>
                                    </Popover>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default ApplicantsTable;
