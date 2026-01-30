import React from 'react';

import Cards from './Cards';
import { Link } from 'react-router-dom';
import { use } from 'react';
import axios from 'axios';
import { useEffect,useState } from 'react'; 

function Course() {
  const [book,setbook]=React.useState([]);
  useEffect(() => {
    const getBook = async () => {
      try {
        const response = await axios.get('http://localhost:4001/book');
        console.log(response.data);
        setbook(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    }
      getBook();
    
  }, []);     

  return (
    <>
      <div className="max-w-screen-2xl container mx-auto md:px-20 px-4 ">
        <div className="mt-28 items-center justify-center text-center">
          <h1 className="text-2xl md:text-4xl">
            We're delighted to have you{" "}
            <span className="text-pink-500">Here!!!</span>
          </h1>
          <p className="mt-10 ">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corporis 
            consequatur porro assumenda hic debitis eum sint quisquam voluptate 
            ducimus amet quis asperiores harum magnam necessitatibus laudantium,
            unde perspiciatis voluptas. Delectus!
            Fugit consequatur iusto, perspiciatis nihil tempore quo nisi sed molestias
          </p>
          <Link to="/">
            <button className="mt-10 bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-700 duration-300">Back</button>
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4">
          {
            book.map((item)=>(
              <Cards key={item.id} item={item} />
            ))
          }
        </div>
      </div>
    </>
  );
}

export default Course;
