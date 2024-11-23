import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import Helmet from 'react-helmet';
import { useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import Loading from '../../Loading/Loading';
import CheckoutForm from './CheckoutForm';
import logo from '../../../assets/icons/logos/quickmed_diagnostic.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const stripePromise = loadStripe('pk_test_51L4A74Hfd0Dg1f5ftju9pevdLs2UDTt8fG3yke03kDb7IMokWd8gl2hJCwd4W6f9Z0PuxdncyjxeWvVTApIbs6Ks00rbnCSs70');

const Payment = () => {
    const {id} = useParams();

    const url = `https://quickmed-server-side.onrender.com/bookings/${id}`;

    const { data: booking, isLoading } = useQuery(['booking', id], () => fetch(url, {
        method: 'GET',
        headers: {
            'authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    }).then(res => res.json()));

    if (isLoading) {
        return <Loading></Loading>
    }
    return (
        <div className='mb-24'>
            <Helmet>
                <title>QuickMed-Payment</title>
            </Helmet>
            <div className='flex justify-between mb-8 font-bold shadow-lg shadow-[gray] hover:shadow-xl hover:shadow-[gray] mx-[1vw] py-[1vw] rounded-lg'>
             <h1 className='ml-8 text-transparent bg-clip-text bg-gradient-to-br from-accent to-secondary text-5xl '>Payment <span className='text-[#20242c]'>Section</span></h1>
             <div className='mr-8'><li><Link className='font-black text-3xl py-3 px-5 bg-[#fd3434a1] rounded-full' to="/dashboard"><FontAwesomeIcon className='text-white' icon={faArrowLeft} beatFade></FontAwesomeIcon></Link></li></div></div>
            <div className='flex items-center justify-center'>
                <div className='hidden md:block'>
                    <img src={logo} alt=''/>
                </div>
            <div className='mt-12 bg-[#20242c] p-2 rounded-lg h-[470px]'>
            <div class="flex justify-center mb-16">
                <div class="block p-6 rounded-lg shadow-lg shadow-white hover:shadow-xl hover:shadow-white bg-white max-w-lg w-full text-left">
                    <h5 class="text-transparent bg-clip-text bg-gradient-to-br from-accent to-secondary font-bold text-2xl leading-tight mb-2">Hello, {booking.username}!</h5>
                    <p class="text-[#20242c] text-xl mb-4">
                        You have booked an appointment for <span className='text-transparent bg-clip-text bg-gradient-to-br from-accent to-secondary font-semibold'>{booking.service} at {booking.slot}</span>
                    </p>
                    <p class="text-[#20242c] text-xl mb-4">
                        Please pay <span className='text-transparent bg-clip-text bg-gradient-to-br from-accent to-secondary font-semibold'>$50.00</span>
                    </p>
                </div>
            </div>
            <div class="flex justify-center mt-[-10px]">
                <div class="block p-6 pb-2 rounded-lg shadow-lg shadow-white hover:shadow-xl hover:shadow-white bg-white max-w-lg w-full text-left">
                    <Elements stripe={stripePromise}>
                        <CheckoutForm booking={booking} />
                    </Elements>
                </div>
            </div>
            </div>
            <div className='hidden md:block'>
                    <img src={logo} alt=''/>
            </div>
            </div>
        </div>
    );
};

export default Payment;