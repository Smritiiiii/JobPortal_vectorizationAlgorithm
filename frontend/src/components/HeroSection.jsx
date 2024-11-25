import { Search } from 'lucide-react';
import React,{useState} from 'react';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
      dispatch(setSearchedQuery(query));
      navigate("/browse");
  }
  return (
    <div className='flex flex-col items-center pt-20 pb-10'>
      <h4 className='rounded-full bg-gray-100 text-[#F83002] font-medium  mb-4 py-3 px-5'>
        No.1 Job Hunt Website
      </h4>
      <h1 className='text-3xl font-bold text-center '>
        Search, Apply & <br />
        Get Your <span className='text-[#6A38C2]'>Dream Jobs</span>
      </h1>
      <p className='pb-2'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore laudantium assumenda, ad id facere vero?</p>
      <div className='flex w-[40%] shadow-lg border border-gray-200 pl-3  rounded-full items-center gap-4 mx-auto'>
        <input
        type ="text"
        placeholder='Find jobs here'
        onChange={(e) => setQuery(e.target.value)}
        className='outline-none border-none w-full bg-gray-100'
        />
         <Button onClick={searchJobHandler} className="rounded-r-full bg-[#6A38C2]">
               <Search className='h-5 w-5' />
           </Button>
         
        
      </div>
      
    </div>
  );
};

export default HeroSection;
