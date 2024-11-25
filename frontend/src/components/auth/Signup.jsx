// import React , {useState} from "react";
// import Navbar from "../shared/Navbar";
// import { Label } from "../ui/label";
// import axios from "axios";
// import { Input } from "../ui/input";
// import { RadioGroup} from "../ui/radio-group";
// import { Button } from "../ui/button";
// import { Link, useNavigate } from "react-router-dom";
// import { USER_API_ENDPOINT } from "@/utilis/constant";
// import { toast } from "sonner";
// import { Loader2 } from "lucide-react";
// import { setLoading } from '@/redux/authSlice'


// const Signup = () => {
//     const [input, setInput]= useState({
//         fullname:"",
//         email:"",
//         phoneNumber:"",
//         role:"",
//         file:""
//     });

//     const navigate = useNavigate();

//     const changeEventHandler = (e) =>{
//         setInput({...input , [e.target.name]:e.target.value});

//     }

//     const changeFileHandler = (e) =>{
//         setInput({...input, file:e.target.files?.[0]});
//     }

//     const submitHandler = async (e)=>{
//         e.preventDefault();
//         const formData = new FormData();
//         formData.append("fullname", input.fullname)
//         formData.append("email", input.email)
//         formData.append("password", input.password)
//         formData.append("role", input.role)
//         formData.append("phoneNumber", input.phoneNumber)
//         if(input.file){
//             formData.append("file", input.file)
//         }
//         try {
//             const res = await axios.post(`${USER_API_ENDPOINT}/register`,formData,{
//                 headers:{
//                     "Content-Type":"multipart/form-data"
//                 },
//                 withCredentials:true,
//             } )
//             if(res.data.success){
//                 navigate("/login")

//                 toast.success(res.data.message);
//             }
//         } catch (error) {
//             console.log("error:" ,error)
//             toast.error(error.response.data.message);
            
//         }
//       } finally{
//         dispatch(setLoading(false));
//     }
//     }

//   return (
//     <div>
//       <Navbar />
//       <div className="flex- items-center justify-center max-w-7xl mx-auto pt-20 ">
//         <form
//           onSubmit={submitHandler}
//           className="1-1/2 border border-gray-200 rounded-md p-4 m-10"
//         >
//           <h1 className="fond-bold text-xl mb-5">Sign up </h1>
//           <div className="my-2">
//             <Label>Full Name</Label>
//             <Input type="text" 
//             value={input.fullname}
//             name="fullname"
//             onChange={changeEventHandler}
//             placeholder="Enter your name"></Input>
//           </div>

//           <div className="my-2">
//             <Label>Email</Label>
//             <Input type="email"
//             value={input.email}
//             name="email"
//             onChange={changeEventHandler}
//              placeholder="Enter your email"></Input>
//           </div>
//           <div className="my-2">
//             <Label>Phone Number</Label>
//             <Input type="number"
//             value={input.phoneNumber}
//             name="phoneNumber"
//             onChange={changeEventHandler}
//              placeholder="Enter your number"></Input>
//           </div>
//           <div className="my-2">
//             <Label>Password</Label>
//             <Input type="password" 
//             value={input.password}
//             name="password"
//             onChange={changeEventHandler}
//             placeholder="Enter your password"></Input>
//           </div>

//           <div className="flex items-center justify-between">
//             <RadioGroup className="flex items-center gap-4 my-5">
//               <div className="flex items-center space-x-2">
//                 <Input
//                  type="radio"
//                  name="role"
//                  value="applicant"
//                  checked={input.role ==='applicant'}
//                  onChange={changeEventHandler}
//                  className="cursor-pointer"
                
//                 />
//                 <Label htmlFor="r1">Applicant</Label>
//               </div>
//               <div className="flex items-center space-x-2">
//               <Input
//                  type="radio"
//                  name="role"
//                  value="recruiter"
//                  checked={input.role ==='recruiter'}
//                  onChange={changeEventHandler}
//                  className="cursor-pointer"
                
//                 />
//                 <Label htmlFor="r2">Recruiter</Label>
//               </div>
             
              
//             </RadioGroup>
//             <div className="flex- items-center gap-2">
//                 <label>Profile</label>
//                 <Input
//                 accept= "image/*"
//                 type="file"
//                 onChange={changeFileHandler}
//                 className="cursor-pointer"
//                 />
                

//             </div>
//           </div>

//           {
//                         loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Signup</Button>
//                     }
//           <span className="text-sm">Already have an account? <Link to ="/login" className="text-blue-600">Login</Link></span>
//         </form>
//       </div>
//     </div>
//   );

// };

// export default Signup;


import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import axios from "axios";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { USER_API_ENDPOINT } from "@/utilis/constant";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: "",
  });

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("password", input.password);
    formData.append("role", input.role);
    formData.append("phoneNumber", input.phoneNumber);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      const res = await axios.post(`${USER_API_ENDPOINT}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
      console.error("Error:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto pt-20">
        <form onSubmit={submitHandler} className="w-1/2 border border-gray-200 rounded-md p-4 m-10">
          <h1 className="font-bold text-xl mb-5">Sign up</h1>

          <div className="my-2">
            <Label>Full Name</Label>
            <Input
              type="text"
              value={input.fullname}
              name="fullname"
              onChange={changeEventHandler}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="my-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="my-2">
            <Label>Phone Number</Label>
            <Input
              type="number"
              value={input.phoneNumber}
              name="phoneNumber"
              onChange={changeEventHandler}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="my-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <RadioGroup className="flex items-center gap-4 my-5">
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="applicant"
                  checked={input.role === "applicant"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <Label htmlFor="applicant">Applicant</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="recrutier"
                  checked={input.role === "recrutier"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <Label htmlFor="recrutier">Recruiter</Label>
              </div>
            </RadioGroup>

            <div className="flex items-center gap-2">
              <label htmlFor="file">Profile</label>
              <Input
                accept="image/*"
                type="file"
                onChange={changeFileHandler}
                className="cursor-pointer"
              />
            </div>
          </div>

          {loading ? (
            <Button className="w-full my-4">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4">Signup</Button>
          )}

          <span className="text-sm">
            Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Signup;
