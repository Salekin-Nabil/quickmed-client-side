import React, { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Helmet from "react-helmet";
import { useForm } from "react-hook-form";
import ReactStars from "react-rating-stars-component";
import auth from "../../../firebase.init";
import logo from "../../../assets/icons/logos/quickmed_diagnostic.jpg";
import toast, { Toaster } from "react-hot-toast";
import "../../Shared/gradient.css";

const MyReviews = () => {
  const [user] = useAuthState(auth);
  const { displayName, email } = user;
  const reviewRef = useRef("");
  const [review, setReview] = useState(0);

  const ratingChanged = (newRating) => {
    setReview(newRating);
  };

  const { register, handleSubmit } = useForm();
  const onSubmit = () => {
    const data = {
      userName: user.displayName,
      userEmail: user.email,
      userPhoto: user.photoURL,
      ratings: reviewRef.current.value,
      reviews: review,
    };
    console.log(data);

    const url = `https://quick-med.fly.dev/reviews/${email}`;
    fetch(url, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        toast.success("Thanks for your valuable review.");
      });
  };
  return (
    <div>
      <Helmet>
        <title>QuickMed-Add a Review</title>
      </Helmet>
      <h1 className="text-transparent bg-clip-text bg-gradient-to-br from-accent to-secondary text-5xl mb-8 font-bold shadow-lg shadow-[gray] hover:shadow-xl hover:shadow-[gray] mx-[1vw] py-[1vw] rounded-lg">
        My <span className="text-[#20242c]">Review</span>
      </h1>
      <div className="flex items-center">
        <div className="hidden md:block">
          <img src={logo} alt="" />
        </div>
        <div className="block p-6 rounded-xl shadow-lg shadow-[gray] hover:shadow-xl hover:shadow-[gray] bg-white w-full md:mx-10 mb-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <p className="text-2xl text-center font-black mb-4 text-transparent bg-clip-text bg-gradient-to-br from-accent to-secondary uppercase">
              Add a Review
            </p>
            <div className="form-group mb-6 w-full mr-2">
              <input
                type="text"
                className="block
                                    w-full
                                    px-3
                                    py-1.5
                                    text-base
                                    font-normal
                                    text-gray-700
                                    bg-white bg-clip-padding
                                    border-4 border-solid border-[#194519]
                                    shadow-lg shadow-[gray] hover:shadow-xl hover:shadow-[gray]
                                    rounded-xl
                                    transition
                                    ease-in-out
                                    m-0
                                    focus:text-gray-700 focus:bg-white focus:border-[#194519] focus:outline-none"
                value={displayName}
                readOnly
                required
              />
            </div>
            <div className="form-group mb-6 w-full">
              <input
                type="email"
                className="block
                                    w-full
                                    px-3
                                    py-1.5
                                    text-base
                                    font-normal
                                    text-gray-700
                                    bg-white bg-clip-padding
                                    border-4 border-solid border-[#194519]
                                    shadow-lg shadow-[gray] hover:shadow-xl hover:shadow-[gray]
                                    rounded-xl
                                    transition
                                    ease-in-out
                                    m-0
                                    focus:text-gray-700 focus:bg-white focus:border-[#194519] focus:outline-none"
                value={email}
                readOnly
                required
              />
            </div>
            <div className="flex justify-center mb-4">
              <ReactStars
                count={5}
                onChange={ratingChanged}
                size={24}
                isHalf={true}
                emptyIcon={<i className="far fa-star"></i>}
                halfIcon={<i className="fa fa-star-half-alt"></i>}
                fullIcon={<i className="fa fa-star"></i>}
                activeColor="#ffd700"
              />
            </div>
            <div className="form-group mb-6 w-full mr-2">
              <textarea
                className="form-control block
                                    w-full
                                    px-3
                                    py-1.5
                                    text-base
                                    font-normal
                                    text-gray-700
                                    bg-white bg-clip-padding
                                    border-4 border-solid border-[#194519]
                                    shadow-lg shadow-[gray] hover:shadow-xl hover:shadow-[gray]
                                    rounded-xl
                                    transition
                                    ease-in-out
                                    m-0
                                    focus:text-gray-700 focus:bg-white focus:border-[#194519] focus:outline-none"
                ref={reviewRef}
                placeholder="Review Description"
                required
                rows={5}
              />
            </div>

            <div className="form-group form-check text-center mb-6">
              <input
                type="checkbox"
                className="form-check-input appearance-none h-4 w-4 border border-[#194519] rounded-sm bg-white checked:bg-[#194519] checked:border-[#194519] focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain mr-2 cursor-pointer"
              />
              <label
                className="form-check-label inline-block text-[#20242c]"
                htmlFor="exampleCheck87"
              >
                Send me a copy of this message
              </label>
            </div>
            <button
              type="submit"
              className="
                                w-full
                                px-6
                                py-2.5
                                gradient_background
                                text-white
                                font-medium
                                text-xs
                                leading-tight
                                uppercase
                                rounded-xl
                                hover:bg-[#3a8e50]
                                focus:bg-[#1d4e25] 
                                active:bg-[#153a18] focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg
                                shadow-lg shadow-[gray] hover:shadow-xl hover:shadow-[gray]
                                transition
                                duration-150
                                ease-in-out"
            >
              Submit Review
            </button>
          </form>
        </div>
        <div className="hidden md:block">
          <img src={logo} alt="" />
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default MyReviews;
