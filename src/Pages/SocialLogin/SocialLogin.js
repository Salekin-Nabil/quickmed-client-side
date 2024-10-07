import React from 'react';
import { useSignInWithFacebook, useSignInWithGithub, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import auth from '../../firebase.init';
import Loading from '../Loading/Loading';
import google from '../../assets/images/google.png';
// import github from '../../images/social icons/github.png';
// import useToken from '../../hooks/useToken';

const SocialLogin = () => {
    const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
    // const [signInWithGithub, user1, loading1, error1] = useSignInWithGithub(auth);
    // const [signInWithFacebook, user2, loading2, error2] = useSignInWithFacebook(auth);
    // const [token, setToken] = useToken(user || user1 || user2);
    const navigate = useNavigate();
    const location = useLocation();

    let from = location.state?.from?.pathname || "/";
    
    let errorElement;

    if(loading){
        return <Loading></Loading>
    }

    if (error) {
        errorElement = <p className='text-white bg-red-700  my-4 text-lg'>Error: {error?.message}</p>
    }

    if (user) {
        navigate(from, { replace: true });
    }
    // if(loading || loading1 || loading2){
    //     return <Loading></Loading>
    // }

    // if (error || error1 || error2) {
    //     errorElement = <p className='text-white bg-red-700  my-4 text-lg'>Error: {error?.message} {error1?.message} {error2?.message} </p>
    // }

    // if (user || user1 || user2) {
    //     navigate(from, { replace: true });
    // }
    // if (token) {
    //     navigate(from, { replace: true });
    // }
    return (
        <div>
                        {errorElement}
                        <button
                            onClick={() => signInWithGoogle()} 
                            className="px-7 py-3 text-[#20242c] hover:bg-gray-200 font-medium text-sm leading-snug uppercase rounded shadow-lg hover:shadow-xl hover:shadow-[gray] focus:shadow-2xl focus:outline-none focus:ring-0 active:shadow-2xl active:shadow-[gray] transition duration-150 ease-in-out w-full flex justify-center items-center mb-3 bg-white shadow-[gray]"
                            data-mdb-ripple="true"
                            data-mdb-ripple-color="light"
                        >
                            <img className='w-[20px] mr-2' src={google} alt='' />Continue with Google
                        </button>
                        {/* <button
                            onClick={() => signInWithGithub()}
                            className="px-7 py-3 text-[#20242c] hover:bg-gray-400 font-medium text-sm leading-snug uppercase rounded shadow-lg hover:shadow-xl hover:shadow-[gray] focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-2xl active:shadow-[gray] transition duration-150 ease-in-out w-full flex justify-center items-center mb-3 bg-gray-300 shadow-[gray]"
                            data-mdb-ripple="true"
                            data-mdb-ripple-color="light"
                        >
                            <img className='w-[28px] mr-1' src={github} alt='' />Continue with Github
                        </button> */}
                        {/* <button
                            className="px-7 py-3 text-white hover:bg-[#348ed3] font-medium text-sm leading-snug uppercase rounded shadow-lg hover:shadow-xl hover:shadow-[gray] focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-2xl active:shadow-[gray] transition duration-150 ease-in-out w-full flex justify-center items-center mb-3 bg-[#55acee] shadow-[gray]"
                            data-mdb-ripple="true"
                            data-mdb-ripple-color="light"
                        >
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            className="w-3.5 h-3.5 mr-2"
                            >
                            <path
                                fill="currentColor"
                                d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
                            /></svg>Continue with Twitter
                        </button>
                        <button
                            onClick={() => signInWithFacebook()}
                            className="px-7 py-3 text-white hover:bg-[#1b3369] font-medium text-sm leading-snug uppercase rounded shadow-lg hover:shadow-xl hover:shadow-[gray] focus:shadow-2xl focus:outline-none focus:ring-0 active:shadow-2xl active:shadow-[gray] transition duration-150 ease-in-out w-full flex justify-center items-center  bg-[#3b5998] shadow-[gray]"
                            data-mdb-ripple="true"
                            data-mdb-ripple-color="light"
                        >
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 320 512"
                            className="w-3.5 h-3.5 mr-2"
                            >
                           
                            <path
                                fill="currentColor"
                                d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
                            /></svg>Continue with Facebook
                        </button> */}
        </div>
    );
};

export default SocialLogin;