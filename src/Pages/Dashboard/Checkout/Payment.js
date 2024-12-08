import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import Helmet from 'react-helmet';
import { useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import Loading from '../../Loading/Loading';
import { useState, useEffect } from 'react';
import CheckoutForm from './CheckoutForm';
import logo from '../../../assets/icons/logos/quickmed_diagnostic.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Web3 from 'web3';
import paymentEscrowABI from '../SmartContracts/ABI/paymentEscrowABI';
import paymentEscrowAddress from '../SmartContracts/ContractAddress/paymentEscrowAddress';
import toast, { Toaster } from 'react-hot-toast';

const stripePromise = loadStripe('pk_test_51L4A74Hfd0Dg1f5ftju9pevdLs2UDTt8fG3yke03kDb7IMokWd8gl2hJCwd4W6f9Z0PuxdncyjxeWvVTApIbs6Ks00rbnCSs70');

const Payment = () => {
    const {id} = useParams();
    const [web3, setWeb3] = useState(null);
    const [paymentEscrow, setPaymentEscrow] = useState(null);


    useEffect(() => {
        if (typeof window.ethereum !== 'undefined') {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
    
          window.ethereum.request({ method: 'eth_requestAccounts' });
    
          const contractInstance = new web3Instance.eth.Contract(paymentEscrowABI, paymentEscrowAddress);
          setPaymentEscrow(contractInstance);
          console.log('Web3 initialized and contract loaded:', contractInstance);
        } else {
          console.error('MetaMask not detected. Please install MetaMask!');
        }
      }, []);

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

    const handlePayment = async (event) => {
        event.preventDefault();
    
        if (!web3 || !paymentEscrow) {
            console.error('Web3 or contract is not initialized');
            return;
        }
    
        try {
            // Fetch accounts
            const accounts = await web3.eth.getAccounts();
            const acc = accounts[0];
    
            // Call calculateEtherAmount to get the required payment value
            const etherAmount = await paymentEscrow.methods.calculateEtherAmount().call();
    
            // Convert the amount to a string (if needed for web3.js) and pass it as `value`
            const transaction = await paymentEscrow.methods
                .depositPayment()
                .send({ from: acc, value: etherAmount });
    
            console.log('Transaction successful:', transaction);
    
            // Fetch the last appointment ID after the transaction
            const lastAppointmentId = await paymentEscrow.methods.getLastAppointmentId().call();
    
            console.log('Last Appointment ID:', lastAppointmentId.toString());

            const payment = {
                order: id,
                transactionId: lastAppointmentId.toString()
            };

            fetch(`https://quickmed-server-side.onrender.com/bookings/crypto/${id}`, {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json',
                    'authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify(payment)
            }).then(res=>res.json())
            .then(data => {
                console.log("Transaction Data: ", data);
                toast.success("Your transaction has been completed.");
            });
        } catch (err) {
            console.error('Error during transaction:', err);
        }
    };
    

    return (
        <div className='mb-24'>
            <Helmet>
                <title>QuickMed-Payment</title>
            </Helmet>
            <div className='flex justify-between mb-8 font-bold shadow-lg shadow-[gray] hover:shadow-xl hover:shadow-[gray] mx-[1vw] py-[1vw] rounded-lg'>
             <h1 className='ml-8 text-transparent bg-clip-text bg-gradient-to-br from-accent to-secondary text-5xl '>Payment <span className='text-[#20242c]'>Section</span></h1>
             <div className='mr-8'><li><Link className='font-black text-3xl py-3 px-5 bg-[#fd3434a1] rounded-full' to="/dashboard"><FontAwesomeIcon className='text-white' icon={faArrowLeft} beatFade></FontAwesomeIcon></Link></li></div></div>
            <div className='flex items-center justify-center'>
                <div className='hidden md:block animate-pulse'>
                    <img src={logo} alt=''/>
                </div>
            <div className='mt-12 bg-[#20242c] p-2 rounded-lg h-[750px]'>
            <div className="flex justify-center mb-16">
                <div className="block p-6 rounded-lg shadow-lg shadow-white hover:shadow-xl hover:shadow-white bg-white max-w-lg w-full text-left">
                    <h5 className="text-transparent bg-clip-text bg-gradient-to-br from-accent to-secondary font-bold text-2xl leading-tight mb-2">Hello, {booking.username}!</h5>
                    <p className="text-[#20242c] text-xl mb-4">
                        You have booked an appointment for <span className='text-transparent bg-clip-text bg-gradient-to-br from-accent to-secondary font-semibold'>{booking.service} at {booking.slot}</span>
                    </p>
                    <p className="text-[#20242c] text-xl mb-4">
                        Please pay <span className='text-transparent bg-clip-text bg-gradient-to-br from-accent to-secondary font-semibold'>$50.00</span>
                    </p>
                </div>
            </div>
            <div className="flex justify-center mt-[-30px]">
                <div className="block p-6 pb-2 rounded-lg shadow-lg shadow-white hover:shadow-xl hover:shadow-white bg-white max-w-lg w-full text-left">
                    <Elements stripe={stripePromise}>
                        <CheckoutForm booking={booking} />
                    </Elements>
                </div>
            </div>
            <div className="flex items-center justify-center my-8">
              <div className="flex-grow h-1 bg-white"></div>
              <span className="mx-4 text-white font-extrabold border-white border-4 rounded-full p-2">OR</span>
              <div className="flex-grow h-1 bg-white"></div>
            </div>
            <div className="flex justify-center mb-16">
                <div className="block p-6 rounded-lg shadow-lg shadow-white hover:shadow-xl hover:shadow-white bg-gray-100 max-w-lg w-full text-left">
                    <h5 className="text-transparent bg-clip-text bg-gradient-to-br from-accent to-secondary font-bold text-2xl leading-tight mb-2 border-4 p-2 border-black rounded-lg">Pay with Ether</h5>
                    <p className="text-[#20242c] text-xl mb-4">
                        20% Discount on <span className='text-transparent bg-clip-text bg-gradient-to-br from-accent to-secondary font-semibold'>Crypto Payment!</span>
                    </p>
                    <p className="text-[#20242c] text-xl mb-4">
                        Please pay <span className='text-transparent bg-clip-text bg-gradient-to-br from-accent to-secondary font-semibold'>{"<"} $40.00 {"(Refundable)"}</span>
                    </p>
                    <div className='relative'>
                    <button onClick={handlePayment} className='px-5 w-full font-bold py-2 shadow-xl shadow-[gray] hover:shadow-lg hover:shadow-[gray]  bg-gradient-to-br from-accent to-secondary hover:bg-[#a0760b] rounded-xl text-white mt-2 animate-bounce' type="submit" disabled={!web3 || !paymentEscrow}>
                    Pay ETH ~ {"($35 + Gas Fee)"}
                    </button>
                    <div className="absolute top-0 right-[-5px] w-4 h-4 bg-[#ff2c2c] rounded-full shadow-white shadow-2xl animate-bounce"></div>
                    </div>
                </div>
            </div>
            </div>
            <div className='hidden md:block animate-pulse'>
                    <img src={logo} alt=''/>
            </div>
            </div>
            <Toaster/>
        </div>
    );
};

export default Payment;