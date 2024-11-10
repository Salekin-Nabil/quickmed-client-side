import React from 'react';
import { useAuthState, useSendEmailVerification } from 'react-firebase-hooks/auth';
import { Navigate, useLocation } from 'react-router-dom';
import auth from '../../firebase.init';
import Loading from '../Loading/Loading';
import useDoctor from '../../hooks/useDoctor';
import { signOut } from 'firebase/auth';

const RequireDoctor = ({ children }) => {
    const [user, loading] = useAuthState(auth);
    const [isDoctor, isDoctorLoading] = useDoctor(user);
    const location = useLocation();

    if (loading || isDoctorLoading) {
        return <Loading></Loading>;
    }

    if (!user || !isDoctor) {
        signOut(auth);
        localStorage.removeItem("accessToken");
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default RequireDoctor;