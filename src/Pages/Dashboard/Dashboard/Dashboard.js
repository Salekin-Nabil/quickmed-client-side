import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link, Outlet } from 'react-router-dom';
import auth from '../../../firebase.init';
import useAdmin from '../../../hooks/useAdmin';

const Dashboard = () => {
    const [user] = useAuthState(auth);
    const [isAdmin] = useAdmin(user);
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
                <ul className="menu p-4 overflow-y-auto w-48 bg-base-100 text-base-content">
                    {/* <!-- Sidebar content here --> */}
                    <li><Link className='font-bold' to="/dashboard">My Bookings</Link></li>
                    <li><Link className='font-bold' to="/dashboard/my_reviews">Add a Review</Link></li>
                    {/* <li><Link className='font-bold' to="/dashboard/my_history">My History</Link></li> */}
                    {/* <li><Link to="/dashboard/users">All Users</Link></li> */}
                    { isAdmin && <>
                        <li><Link className='font-bold' to="/dashboard/users">Manage Users</Link></li>
                        <li><Link className='font-bold' to="/dashboard/all_bookings">All Bookings</Link></li>
                        {/* <li><Link className='font-bold' to="/dashboard/manage_bookings">Manage Bookings</Link></li> */}
                    </>}
                </ul>

            </div>
        </div>
    );
};

export default Dashboard;