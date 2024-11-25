import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/jobSlice";

const category = [
  "Frontend Developer",
  "Backend Developer",
  "Data Science",
  "Graphic Designer",
  "Fullstack Developer",
];

const CategoryCarousel = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchJobHandler = (query) => {
      dispatch(setSearchedQuery(query));
      navigate("/browse");
  }
    return (
      <div className="flex justify-center mt-10">
        <Carousel className=''>
          <CarouselContent className='ml-4'>
            {category.map((cat, index) => (
              <CarouselItem className="md:basis-1/2 lg-basis-1/3">
              <Button onClick={()=>searchJobHandler(cat)} variant="outline" className="rounded-full">{cat}</Button>
          </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    );
  };
export default CategoryCarousel;
