import React from 'react';
import Helmet from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { faUserCircle, faWandMagicSparkles, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MyProfile = () => {
    const navigate = useNavigate();
    return (
        <div>
            <Helmet>
                <title>QuickMed-My Profile</title>
            </Helmet>
             <h1 className='text-transparent bg-clip-text bg-gradient-to-br from-accent to-secondary text-5xl mb-40 font-bold shadow-lg shadow-[gray] hover:shadow-xl hover:shadow-[gray] mx-[1vw] py-[1vw] rounded-lg'>My <span className='text-[#20242c]'>Profile</span></h1>
             <div className='md:flex md:justify-center xs:flex-col'>
             <button onClick={()=>navigate('/dashboard/my_profile/create_profile')} className='text-3xl font-bold rounded-md bg-[red] hover:bg-gradient-to-br hover:from-accent to-secondary text-white lg:py-20 lg:px-20 md:px-10 lg:mr-10 border-0 shadow shadow-[black]'>Create Profile <FontAwesomeIcon className='text-white' icon={faUserCircle} spin></FontAwesomeIcon></button>
             <button onClick={()=>navigate('/dashboard/my_profile/update_profile')} className='text-3xl font-bold rounded-md bg-[Orange] hover:bg-gradient-to-br hover:from-accent to-secondary text-white lg:py-20 lg:px-20 md:px-24 lg:mx-10 border-0 shadow shadow-[black]'>Update Profile <FontAwesomeIcon className='text-white' icon={faWandMagicSparkles} shake></FontAwesomeIcon></button>
             <button onClick={()=>navigate('/dashboard/my_profile/view_profile')} className='text-3xl font-bold rounded-md bg-[green] hover:bg-gradient-to-br hover:from-accent to-secondary text-white lg:py-20 lg:px-20 md:px-24 lg:ml-10 border-0 shadow shadow-[black]'>View Profile <FontAwesomeIcon className='text-white' icon={faEye} beatFade></FontAwesomeIcon></button>
             </div>
        </div>
    );
};

export default MyProfile;