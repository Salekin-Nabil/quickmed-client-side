import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link, Outlet } from 'react-router-dom';
import auth from '../../../firebase.init';
import useAdmin from '../../../hooks/useAdmin';
import useDoctor from '../../../hooks/useDoctor';
import { faUser, faWandMagicSparkles, faEye, faBookmark, faStarHalfStroke, faPeopleRoof, faSwatchbook, faStethoscope, faHospitalUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Dashboard = () => {
    const [user] = useAuthState(auth);
    const [isAdmin] = useAdmin(user);
    const [isDoctor] = useDoctor(user);
    return (
        <div className="drawer drawer-mobile">
            <input id="dashboard-sidebar" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                <h2 className='text-4xl font-black text-center uppercase'>Dashboard</h2>
                <div className="divider"></div>
                <Outlet></Outlet>
            </div>
            <div className="drawer-side">
                <label htmlFor="dashboard-sidebar" className="drawer-overlay"></label>
                <ul className="menu p-4 overflow-y-auto w-[14rem] bg-base-100 text-base-content">
                    {/* <!-- Sidebar content here --> */}
                    <li><Link className='font-bold' to="/dashboard"><FontAwesomeIcon className='text-black' icon={faBookmark} beatFade></FontAwesomeIcon> My Bookings</Link></li>
                    <li><Link className='font-bold' to="/dashboard/my_profile"><FontAwesomeIcon className='text-black' icon={faUser} beatFade></FontAwesomeIcon> My Profile</Link></li>
                    <li><Link className='font-bold' to="/dashboard/my_reviews"><FontAwesomeIcon className='text-black' icon={faStarHalfStroke} beatFade></FontAwesomeIcon> Add a Review</Link></li>
                    
                    {/* <li><Link className='font-bold' to="/dashboard/my_history">My History</Link></li> */}
                    {/* <li><Link to="/dashboard/users">All Users</Link></li> */}
                    { isDoctor && <>
                        <li><Link className='font-bold' to="/dashboard/doctor_appointment"><FontAwesomeIcon className='text-black' icon={faHospitalUser} beatFade></FontAwesomeIcon>  Patient's Appointment</Link></li>
                    </>}
                    { isAdmin && <>
                        <li><Link className='font-bold' to="/dashboard/users"><FontAwesomeIcon className='text-black' icon={faPeopleRoof} beatFade></FontAwesomeIcon> Manage Users</Link></li>
                        <li><Link className='font-bold' to="/dashboard/all_bookings"><FontAwesomeIcon className='text-black' icon={faSwatchbook} beatFade></FontAwesomeIcon> All Bookings</Link></li>
                        <li><Link className='font-bold' to="/dashboard/doctors_applications"><FontAwesomeIcon className='text-black' icon={faStethoscope} beatFade></FontAwesomeIcon> Review Doctor's Applications</Link></li>
                        {/* <li><Link className='font-bold' to="/dashboard/manage_bookings">Manage Bookings</Link></li> */}
                    </>}
                </ul>

            </div>
        </div>
    );
};

export default Dashboard;