import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import quickmed from '../../../assets/icons/logos/quickmed.png';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import auth from '../../../firebase.init';
import Loading from '../../Loading/Loading';

const Navbar = () => {

    const [load, setLoad] = useState(false)
    const [user, loading, error] = useAuthState(auth);
    const location = useLocation();
    const logout = () => {
        signOut(auth);
        localStorage.removeItem("accessToken");
      };

    if(load) {
        return <Loading></Loading>
    }
    
    const logout_loader = () => {
        let barWidth = 0;
        setLoad(true);
        setTimeout(() => {
            let intervalID = setInterval(() => {
              if (barWidth === 100) {
                clearInterval(intervalID);
                setLoad(false);
                logout();
              } else {
                barWidth++;
              }
            }); //this sets the speed of the animation
          }, 300);
    }

    const menuItems = <React.Fragment>
        <li><Link className='hover:text-slate-500' to="/">Home</Link></li>
        <li><Link className='hover:text-slate-500' to="/appointment">Appointment</Link></li>
        {
            user && <li><Link className='hover:text-slate-500' to="/dashboard">Dashboard</Link></li>
        }
        <li><Link className='hover:text-slate-500' to="/reviews">Reviews</Link></li>
        <li><Link className='hover:text-slate-500' to="/about">About</Link></li>
        <li><Link className='hover:bg-slate-500 text-transparent bg-clip-text bg-gradient-to-br from-accent to-secondary border-0 shadow shadow-black' to="/apply_as_a_doctor">Apply as A Doctor</Link></li>
        <li>{user ? <div className='flex p-0'> <Link to="/login" className='btn btn-ghost font-bold text-[#cf7b7b] hover:text-white' onClick={logout_loader}>Log Out</Link> <img className='rounded-full w-[40px] h-[40px] ring ring-[#76d276]' src={user.photoURL || "https://graph.facebook.com/1840598326336872/picture"}></img> </div> : <Link to="/login" className='bg-gradient-to-br from-accent to-secondary text-white hover:text-slate-300'>Login</Link>}</li>
    </React.Fragment>

    return (
        <div className="navbar bg-base-100 flex justify-between ">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </label>
                    <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 font-bold ">
                        {menuItems}
                    </ul>
                </div>
                <Link to="/"><img src={quickmed} alt="QuickMed" className="btn btn-ghost lg:w-1/4 lg:h-1/4 normal-case text-xl"></img></Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal p-0 font-bold">
                    {menuItems}
                </ul>
            </div>
            {(location.pathname === "/dashboard" || location.pathname === "/dashboard/my_reviews" || location.pathname === "/dashboard/doctor_appointment" || location.pathname === "/dashboard/users" || location.pathname === "/dashboard/all_bookings" || location.pathname === "/dashboard/doctors_applications" || location.pathname === "/dashboard/payment/:id" || location.pathname === "/dashboard/my_history") && <div className='navbar-end lg:hidden'>
                <label tabIndex={1} htmlFor='dashboard-sidebar' className="btn btn-ghost lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                </label>
            </div>}
            
        </div>
    );
};

export default Navbar;