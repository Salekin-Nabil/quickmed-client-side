// import React, { useContext } from 'react';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../../firebase.init';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import toast, { Toaster } from 'react-hot-toast';
import { Helmet } from 'react-helmet';
import { faTrashCan, faCreditCard, faMagnifyingGlass, faListUl } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { Link } from 'react-router-dom';
// import { AuthContext } from '../../../contexts/AuthProvider';
import Web3 from 'web3';
import paymentEscrowABI from '../SmartContracts/ABI/paymentEscrowABI';
import paymentEscrowAddress from '../SmartContracts/ContractAddress/paymentEscrowAddress';

const MyAppointment = () => {
    // const { user } = useContext(AuthContext);
    const [appointments, setAppoinments] = useState([]);
    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    const [web3, setWeb3] = useState(null);
    const [paymentEscrow, setPaymentEscrow] = useState(null);
    const [change, setChange] = useState(null);


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

    const url = `https://quickmed-server-side.onrender.com/bookings?email=${user?.email}`;

    useEffect(() => {
        if(user) {
            fetch(url, {
                method: 'GET',
                headers:{
                    'authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
            .then(res => {
                if(res.status === 401 || res.status === 403){
                    signOut(auth);
                    localStorage.removeItem("accessToken");
                    navigate("/");
                }
                return res.json()})
            .then(data => {
                console.log("Change: ", change);
                setAppoinments(data);
            });
        }
    }, [user, change]);

    const handleDeleteBooking = id => {
        fetch(`https://quickmed-server-side.onrender.com/bookings/${id}`, {
            method: 'DELETE', 
            headers: {
                authorization: `bearer ${localStorage.getItem('accessToken')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            fetch(url, {
                method: 'GET',
                headers:{
                    'authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
            .then(res => {
                if(res.status === 401 || res.status === 403){
                    signOut(auth);
                    localStorage.removeItem("accessToken");
                    navigate("/");
                }
                return res.json()})
            .then(data => {
                setAppoinments(data)
            });
            toast.success('Booking cancelled successfully.');
        })
    };

    const handleRefund = async (id, transactionId) =>{
    
        if (!web3 || !paymentEscrow) {
            console.error('Web3 or contract is not initialized');
            return;
        }

        
        try {
            // Fetch accounts
            const accounts = await web3.eth.getAccounts();
            const acc = accounts[0];

            const transaction = await paymentEscrow.methods
                .refundPayment(transactionId)
                .send({ from: acc });
    
            console.log('Transaction successful:', transaction);

            fetch(`https://quickmed-server-side.onrender.com/bookings/crypto/refund/${id}`, {
                method: 'DELETE',
                headers: {
                    authorization: `bearer ${localStorage.getItem('accessToken')}`
                }
            })
            .then(res => res.json())
            .then(data => {
                setChange(data);
                toast.success('Payment Refunded Successfully.');
            })

            fetch(`https://quickmed-server-side.onrender.com/bookings/crypto/refund/${id}`, {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json',
                    'authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            }).then(res=>res.json())
            .then(data => {
                console.log("Transaction Data: ", data);
            });
        } catch (err) {
            console.error('Error during transaction:', err);
        }
    };

    return (
        <div className='mb-[60px] mx-[20px]'>
            <Helmet>
                <title>QuickMed-My Appointments</title>
            </Helmet>
             <h1 className='text-transparent bg-clip-text bg-gradient-to-br from-accent to-secondary text-5xl mb-8 font-bold shadow-lg shadow-[gray] hover:shadow-xl hover:shadow-[gray] mx-[1vw] py-[1vw] rounded-lg'>My <span className='text-[#20242c]'>Appointments</span></h1>
            <div className="overflow-x-auto rounded-xl shadow-xl shadow-[gray]">
                <table className="table-zebra w-full">
                    <thead className='bg-gradient-to-br from-accent to-secondary text-white'>
                        <tr>
                            <th className='py-5'></th>
                            <th className='py-5'>Name</th>
                            <th className='py-5'>Service</th>
                            <th className='py-5'>Date</th>
                            <th className='py-5'>Time</th>
                            <th className='py-5'>Status</th>
                            <th className='py-5'>Checkout</th>
                            <th className='py-5'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            appointments &&
                            appointments?.map((appointment, i) => <tr key={appointment._id}>
                                <th className='text-center py-5'>{i + 1}</th>
                                <td className='text-center py-5'>{appointment.username}</td>
                                <td className='text-center py-5'>{appointment.service}</td>
                                <td className='text-center py-5'>{appointment.appointmentDate}</td>
                                <td className='text-center py-5'>{appointment.slot}</td>
                                {
                                            appointment.status==="unpaid" && 
                                            <td className="text-center  font-bold text-[red] px-6 py-4 whitespace-nowrap">
                                            Unpaid
                                        </td>
                                        }
                                        {
                                            appointment.status==="pending" && 
                                            <td className="text-center text-[goldenrod] font-bold px-6 py-4 whitespace-nowrap">
                                            Pending
                                        </td>
                                        }
                                        {/* {
                                            appointment?.crypto==="yes" && 
                                            <td className="text-center text-[goldenrod] font-bold px-6 py-4 whitespace-nowrap">
                                            Pending
                                        </td>
                                        } */}
                                        {
                                            appointment.status==="accepted" && 
                                            <td className="text-center text-[purple] font-bold px-6 py-4 whitespace-nowrap">
                                            Accepted
                                        </td>
                                        }
                                        {
                                            appointment.status==="ongoing" && 
                                            <td className="font-bold text-center text-[#91c929b2] px-6 py-4 whitespace-nowrap">
                                            Ongoing Consultaion
                                        </td>
                                        }
                                        {
                                            appointment.status==="completed" && 
                                            <td className="font-bold text-center text-[green] px-6 py-4 whitespace-nowrap">
                                            Completed
                                        </td>
                                        }
                                    {
                                    appointment.status==="unpaid" &&
                                    <td className="text-center text-white px-6 py-4 whitespace-nowrap">
                                    <button onClick={()=>navigate(`/dashboard/payment/${appointment._id}`)} className='rounded-md bg-[green] hover:bg-gradient-to-br hover:from-accent to-secondary text-white py-1 px-5 md:px-24 border-0 shadow shadow-[black] text-bold'>Pay ------- <FontAwesomeIcon className='text-white' icon={faCreditCard} bounce></FontAwesomeIcon></button>
                                    </td>

                                    }
                                    {
                                    appointment.status==="completed" &&
                                    <td className="text-center text-white px-6 py-4 whitespace-nowrap">
                                    <button onClick={()=>navigate(`/dashboard/my_reviews`)} className='rounded-md bg-[#da792a] hover:bg-gradient-to-br hover:from-accent to-secondary text-white py-1 px-5 md:px-24 border-0 shadow shadow-[black] text-bold'>Review ------- <FontAwesomeIcon className='text-white' icon={faMagnifyingGlass} beatFade></FontAwesomeIcon></button>
                                    </td>

                                    }
                                    {
                                        (appointment?.crypto==="yes" && appointment.status==="pending") &&
                                        <td className="text-center text-white px-6 py-4 whitespace-nowrap">
                                            <button onClick={()=>handleRefund(appointment._id, appointment.transactionId)} className='text-sm rounded-md bg-[#ce9224] hover:bg-gradient-to-br hover:from-accent to-secondary text-white py-1 px-5 md:px-24 border-0 shadow shadow-[black]' disabled={!web3 || !paymentEscrow}>Refund ------- <FontAwesomeIcon className='text-white' icon={faCreditCard} bounce></FontAwesomeIcon></button>
                                        </td>
                                    }
                                    {
                                        (!appointment?.crypto && appointment.status==="pending") &&
                                    <td className="text-lg text-white font-semibold px-6 py-4 whitespace-nowrap text-center">
                                        <span className='rounded-lg text-transparent bg-clip-text bg-gradient-to-br from-accent to-secondary text-sm font-bold py-3 px-4 border-0 shadow shadow-[black]'>Paid:  {appointment.transactionId}</span>
                                    </td>
                                    }
                                {/* <td className='text-center py-5'><button onClick={() => handleDeleteBooking(appointment._id)} className='btn btn-xs btn-danger text-white bg-[red] border-0 shadow shadow-[black]'>Cancel</button></td> */}
                                {
                                            appointment.status==="unpaid" &&
                                            <td className='text-center py-5'><button onClick={() => handleDeleteBooking(appointment._id)} className='btn btn-xs btn-danger text-white bg-[red] border-0 shadow shadow-[black]'>Cancel... <FontAwesomeIcon className='text-white' icon={faTrashCan} fade></FontAwesomeIcon></button></td>
                                }
                                {
                                    appointment.status==="completed" &&
                                    <td className="text-center text-white px-6 py-4 whitespace-nowrap">
                                    <button onClick={()=>navigate(`/dashboard/summary/${appointment._id}`)} className='rounded-md bg-[#528b1c] hover:bg-gradient-to-br hover:from-accent to-secondary text-white py-1 px-5 md:px-24 border-0 shadow shadow-[black] text-bold'>Consultation Summary... <FontAwesomeIcon className='text-white' icon={faListUl} beatFade></FontAwesomeIcon></button>
                                    </td>

                                }
                                {
                                    (appointment.status==="pending" || appointment.status==="accepted" || appointment.status==="ongoing") &&
                                        <td className="text-lg text-center text-white font-semibold px-6 py-4 whitespace-nowrap">
                                            <span className='rounded-full text-red-700 py-3 px-4'>Can't Delete</span>
                                        </td>
                                        }
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>
            <Toaster/>
        </div>
    );
};

export default MyAppointment;