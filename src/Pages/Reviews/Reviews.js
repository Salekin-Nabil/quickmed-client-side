import React, { useEffect, useState } from 'react';
import Review from './Review';

const Reviews = () => {
    const [reviews,setReviews] = useState({});

    useEffect(()=>{
        fetch("http://localhost:7000/reviews")
        .then(res=>res.json())
        .then(data=>setReviews(data));
    }, []);

    const data = Array.from(reviews);
    
    return (
        <div id='services'>
            <h1 className='text-center uppercase font-black xs:text-4xl lg:text-5xl'>Testimonials</h1>
            <div className="divider"></div>
            <div className='md:grid md:grid-cols-3 md:gap-5 md:my-[150px]'>
                {
                    data.map(review => <Review key={review._id} review={review}></Review>)
                }
            </div>
        </div>
    );
};

export default Reviews;