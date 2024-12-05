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

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);
    const params = useParams();
    const jobId = params.id;

    // Filter applicants to exclude the admin
    const filteredApplicants = applicants?.applications?.filter(item => item?.applicant?.role !== 'recrutier');

    // State to track each applicant's status
    const [applicantStatuses, setApplicantStatuses] = useState(
        filteredApplicants?.reduce((acc, applicant) => {
            acc[applicant._id] = applicant.status || null;
            return acc;
        }, {})
    );

    // State to track analyzed applicants (top matches)
    const [analyzedApplicants, setAnalyzedApplicants] = useState(null);

    // Loading state
    const [loading, setLoading] = useState(false);

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

    // Bulk Analyze Function
    const analyzeAllHandler = async () => {
        setLoading(true); // Set loading state to true when starting the analysis

        try {
            // Check if there are any applicants with resumes
            const resumes = filteredApplicants
                .filter((item) => item.applicant?.profile?.resume)
                .map((item) => ({
                    url: item.applicant.profile.resume,
                    originalName: item.applicant.profile.resumeOriginalName,
                }));

            if (resumes.length === 0) {
                toast.error("No resumes available to analyze.");
                setLoading(false); // Reset loading state
                return;
            }

            const formData = new FormData();
            formData.append("jobId", jobId);

            // Fetch each CV file from its URL and append it to the FormData
            for (const resume of resumes) {
                const response = await fetch(resume.url);
                if (!response.ok) {
                    throw new Error(`Failed to fetch resume: ${resume.originalName}`);
                }
                const blob = await response.blob();
                const file = new File([blob], resume.originalName, {
                    type: blob.type,
                });
                formData.append("file", file); // Append each file to the FormData
            }

            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_ENDPOINT}/analyzeapply/${jobId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.data.success) {
                toast.success(res.data.message);
                setAnalyzedApplicants(res.data.data); // Set top matches
            } else {
                toast.error("Analysis failed. Please try again.");
            }
        } catch (error) {
            console.error("Error in analyzeAllHandler:", error);
            toast.error(error.message || "An error occurred while analyzing the applications.");
        } finally {
            setLoading(false); // Reset loading state when done
        }
    };

    // Back button to reset analyzed list
    const resetAnalyzedList = () => {
        setAnalyzedApplicants(null);
    };

    // Determine which applicants to display (analyzed or original list)
    const applicantsToDisplay = analyzedApplicants || filteredApplicants;

//     return (
//         <div>
//             <div className="flex justify-between items-center mb-4">
//                 <h1 className="text-2xl font-semibold">Applicants</h1>
//                 {analyzedApplicants ? (
//                     <button
//                         className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
//                         onClick={resetAnalyzedList}
//                     >
//                         Back
//                     </button>
//                 ) : (
//                     <button
//                         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//                         onClick={analyzeAllHandler}
//                         disabled={loading} // Disable button when loading
//                     >
//                         {loading ? 'Analyzing...' : 'Analyze All'}
//                     </button>
//                 )}
//             </div>

//             <Table>
//                 <TableCaption>
//                     {analyzedApplicants
//                         ? "Top Matching CV"
//                         : "A list of your recent applied users"}
//                 </TableCaption>
//                 <TableHeader>
//                     <TableRow>
//                         <TableHead>FullName</TableHead>
//                         <TableHead>Email</TableHead>
//                         <TableHead>Contact</TableHead>
//                         <TableHead>Resume</TableHead>
//                         <TableHead className="text-right">Action</TableHead>
//                     </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                     {applicantsToDisplay && Array.isArray(applicantsToDisplay) && applicantsToDisplay.length > 0 ? (
                       
//                         Array.isArray(applicantsToDisplay) ? (
//                             applicantsToDisplay.map((item) => (
//                                 <TableRow key={item._id}>
//                                     <TableCell>{item?.applicant?.fullname}</TableCell>
//                                     <TableCell>{item?.applicant?.email}</TableCell>
//                                     <TableCell>{item?.applicant?.phoneNumber}</TableCell>
//                                     <TableCell>
//                                         {item.applicant?.profile?.resume ? (
//                                             <a
//                                                 className="text-blue-600 cursor-pointer"
//                                                 href={item?.applicant?.profile?.resume}
//                                                 target="_blank"
//                                                 rel="noopener noreferrer"
//                                             >
//                                                 {item?.applicant?.profile?.resumeOriginalName}
//                                             </a>
//                                         ) : (
//                                             <span>NA</span>
//                                         )}
//                                     </TableCell>
//                                     <TableCell className="float-right cursor-pointer">
//                                     {applicantStatuses[item._id] === "Accepted" || applicantStatuses[item._id] === "Rejected" ? (
//                                             <Badge
//                                                 color={applicantStatuses[item._id] === "Accepted" ? "green" : "red"}
//                                             >
//                                                 {applicantStatuses[item._id]}
//                                             </Badge>
//                                         ) : (
//                                             <Popover>
//                                                 <PopoverTrigger>
//                                                     <MoreHorizontal />
//                                                 </PopoverTrigger>
//                                                 <PopoverContent className="w-32">
//                                                     {shortlistingStatus.map((status, index) => (
//                                                         <div
//                                                             onClick={() => {
//                                                                 status === "Analyze"
//                                                                     ? analyzeAllHandler()
//                                                                     : statusHandler(status, item._id);
//                                                             }}
//                                                             key={index}
//                                                             className="flex w-fit items-center my-2 cursor-pointer"
//                                                         >
//                                                             <span>{status}</span>
//                                                         </div>
//                                                     ))}
//                                                 </PopoverContent>
//                                             </Popover>
//                                         )}
//                                     </TableCell>
//                                 </TableRow>
//                             ))
//                         ) : (
//                             // Handle case where analyzedApplicant is a single applicant object
//                             <TableRow key={applicantsToDisplay._id}>
//                                 <TableCell>{applicantsToDisplay?.applicant?.fullname}</TableCell>
//                                 <TableCell>{applicantsToDisplay?.applicant?.email}</TableCell>
//                                 <TableCell>{applicantsToDisplay?.applicant?.phoneNumber}</TableCell>
//                                 <TableCell>
//                                     {analyzedApplicants.applicant?.resume ? (
//                                         <a
//                                             className="text-blue-600 cursor-pointer"
//                                             href={analyzedApplicants.applicant?.resume}
//                                             target="_blank"
//                                             rel="noopener noreferrer"
//                                         >
//                                             {analyzedApplicants?.applicant?.resumeOriginalName}
//                                         </a>
//                                     ) : (
//                                         <span>NO data</span>
//                                     )}
//                                 </TableCell>
//                                 <TableCell className="float-right cursor-pointer">
//                                     {applicantStatuses[applicantsToDisplay._id] ? (
//                                         <Badge
//                                             color={applicantStatuses[applicantsToDisplay._id] === "Accepted" ? "green" : "red"}
//                                         >
//                                             {applicantStatuses[applicantsToDisplay._id]}
//                                         </Badge>
//                                     ) : (
//                                         <Popover>
//                                             <PopoverTrigger>
//                                                 <MoreHorizontal />
//                                             </PopoverTrigger>
//                                             <PopoverContent className="w-32">
//                                                 {shortlistingStatus.map((status, index) => (
//                                                     <div
//                                                         onClick={() => {
//                                                             status === "Analyze"
//                                                                 ? analyzeAllHandler()
//                                                                 : statusHandler(status, applicantsToDisplay._id);
//                                                         }}
//                                                         key={index}
//                                                         className="flex w-fit items-center my-2 cursor-pointer"
//                                                     >
//                                                         <span>{status}</span>
//                                                     </div>
//                                                 ))}
//                                             </PopoverContent>
//                                         </Popover>
//                                     )}
//                                 </TableCell>
//                             </TableRow>
//                         )
//                     ) : (
//                         <TableRow>
//                             <TableCell colSpan="6" className="text-center">No applicants to display.</TableCell>
//                         </TableRow>
//                     )}
//                 </TableBody>
//             </Table>
//         </div>
//     );
// };

return (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Applicants</h1>
            {analyzedApplicants ? (
                <button
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    onClick={resetAnalyzedList} // Reset analyzedApplicants
                >
                    Back
                </button>
            ) : (
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={analyzeAllHandler} // Analyze all applicants
                    disabled={loading} // Disable button while loading
                >
                    {loading ? 'Analyzing...' : 'Analyze All'}
                </button>
            )}
        </div>

        <Table>
            <TableCaption>
                {analyzedApplicants
                    ? "Top Matching CV"
                    : "A list of your recent applied users"}
            </TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>FullName</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Resume</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {analyzedApplicants && analyzedApplicants.applicant ? (
                    // Display the analyzed applicant safely
                    <TableRow key={analyzedApplicants.applicant.email}>
                        <TableCell>{analyzedApplicants.applicant?.fullname || "N/A"}</TableCell>
                        <TableCell>{analyzedApplicants.applicant?.email || "N/A"}</TableCell>
                        <TableCell>{analyzedApplicants.applicant?.phoneNumber || "N/A"}</TableCell>
                        <TableCell>
                            {analyzedApplicants.applicant?.resume ? (
                                <a
                                    className="text-blue-600 cursor-pointer"
                                    href={analyzedApplicants.applicant?.resume}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {analyzedApplicants.applicant?.resumeOriginalName || "Resume"}
                                </a>
                            ) : (
                                <span>NA</span>
                            )}
                        </TableCell>
                        <TableCell className="float-right">
                            <Badge color="green">Analyzed</Badge>
                        </TableCell>
                    </TableRow>
                ) : (
                    // Display the list of all applicants when no analyzed data
                    (applicantsToDisplay && applicantsToDisplay.length > 0 ? (
                        applicantsToDisplay.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>{item?.applicant?.fullname || "N/A"}</TableCell>
                                <TableCell>{item?.applicant?.email || "N/A"}</TableCell>
                                <TableCell>{item?.applicant?.phoneNumber || "N/A"}</TableCell>
                                <TableCell>
                                    {item.applicant?.profile?.resume ? (
                                        <a
                                            className="text-blue-600 cursor-pointer"
                                            href={item?.applicant?.profile?.resume}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {item?.applicant?.profile?.resumeOriginalName || "Resume"}
                                        </a>
                                    ) : (
                                        <span>NA</span>
                                    )}
                                </TableCell>
                                <TableCell className="float-right cursor-pointer">
                                    {applicantStatuses[item._id] === "Accepted" || applicantStatuses[item._id] === "Rejected" ? (
                                        <Badge
                                            color={
                                                applicantStatuses[item._id] === "Accepted" ? "green" : "red"
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
                                                                ? analyzeAllHandler()
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
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan="6" className="text-center">
                                No applicants to display.
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    </div>
);
}
export default ApplicantsTable;