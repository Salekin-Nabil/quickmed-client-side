import React from 'react';
import Rating from 'react-rating';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Review = ({review}) => {
    const {userName, userEmail, ratings, reviews, userPhoto} = review;
    return (
        <div className="card lg:max-w-lg bg-base-100 shadow-xl">
            <div className="card-body">
            <Rating className='mt-[2vw]'
                        initialRating={reviews}
                        emptySymbol={<FontAwesomeIcon className='mr-[15px] text-xl' style={{color: 'gray'}} icon={faStar} />}
                        
                        fullSymbol={<FontAwesomeIcon className='mr-[15px] text-xl text-yellow-400 hover:text-yellow-800' style={{color: ''}} icon={faStar} />}
                    
                        readonly
                    ></Rating>
                <p>{ratings}</p>
                <div className="flex items-center">
                    <div className="avatar">
                        <div className="w-16 rounded-full ring ring-[#76d276] ring-offset-base-100 mr-5">
                            <img src={userPhoto} alt=""/>
                        </div>
                    </div>
                    <div>
                        <h4 className='text-xl'>{userName}</h4>
                        <p>{userEmail}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Review;