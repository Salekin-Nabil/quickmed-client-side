import React from 'react';
import { useAuthState, useSendEmailVerification } from 'react-firebase-hooks/auth';
import { Navigate, useLocation } from 'react-router-dom';
import auth from '../../firebase.init';
import Loading from '../Loading/Loading';
import toast, { Toaster } from 'react-hot-toast';

const RequireAuth = ({ children }) => {
    const [user, loading] = useAuthState(auth);
    const location = useLocation();
    const [sendEmailVerification, sending, error] = useSendEmailVerification(auth);

    if (loading) {
        return <Loading></Loading>;
    }

    if (!user ) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const notify = () => toast('Email Sent For Verification.');

    if (user.providerData[0]?.providerId ==='password' && !user.emailVerified) {
        return <div className='text-center my-[10vw]'>
            <h3 className='text-blue-900 text-3xl my-5 font-extrabold'>Your Email Is Not Verified!!</h3>
            <h5 className='text-gray-900 text-3xl my-5 font-extrabold'> Please Verify Your Email Address</h5>
            <button
            className='bg-[#567fd2] hover:bg-[#302d72] text-white font-extrabold my-5 rounded-3xl py-3 px-7'
                onClick={async () => {
                    await sendEmailVerification();
                    notify();
                }}
            >
                Send Verification Email Again
            </button>
            <Toaster />
        </div>
    }

    return children;
};

export default RequireAuth;