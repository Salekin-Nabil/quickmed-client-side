import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../Pages/Shared/Footer/Footer';
import Navbar from '../Pages/Shared/Navbar/Navbar';
import ScrollTop from '../Pages/Shared/Navbar/ScrollTop';
import Whatsapp from '../Pages/Shared/Navbar/Whatsapp';

const Main = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
            <div className='flex justify-between'>
                <ScrollTop></ScrollTop>
                <Whatsapp></Whatsapp>
            </div>
        </div>
    );
};

export default Main;