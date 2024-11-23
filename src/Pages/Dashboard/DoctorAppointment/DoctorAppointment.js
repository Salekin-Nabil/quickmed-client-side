// import React, { useContext } from 'react';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { faCheckToSlot, faPhoneFlip } from '@fortawesome/free-solid-svg-icons';
import auth from '../../../firebase.init';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { Helmet } from 'react-helmet';
import toast, { Toaster } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCall } from "../../../contexts/CallProvider";
// import { Link } from 'react-router-dom';
// import { AuthContext } from '../../../contexts/AuthProvider';

const DoctorAppointment = () => {
    // const { user } = useContext(AuthContext);
    const { initiateCall } = useCall();
    const [appointments, setAppoinments] = useState([]);
    const [userInfo, setUserInfo] = useState([]);
    const [userID, setUserID] = useState([]);
    const [users, setUsers] = useState([]);
    const [doctor, setDoctor] = useState([]);
    const [wallet, setWallet] = useState('');
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();

    const url_1 = `https://quickmed-server-side.onrender.com/doctors_info?email=${user?.email}`;

    // const { data: bookings = [] } = useQuery({
    //     queryKey: ['bookings', user?.email],
    //     queryFn: async () => {
    //         const res = await fetch(url, {
    //             headers: {
    //                 authorization: `bearer ${localStorage.getItem('accessToken')}`
    //             }
    //         });
    //         const data = await res.json();
    //         return data;
    //     }
    // })

    // const {data: users, isLoading, refetch} = useQuery({
    //     queryKey: ['users'],
    //     queryFn: async() =>{
    //         const res = await fetch('https://quickmed-server-side.onrender.com/users', {
    //           method: 'GET',
    //           headers: {
    //             authorization: `Bearer ${localStorage.getItem('accessToken')}`
    //           }
    //         });
    //         const data = await res.json();
    //         return data;
    //     }
    // });

    useEffect(() => {
            fetch('https://quickmed-server-side.onrender.com/users', {
                method: 'GET',
                headers:{
                    'authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
            .then(res => {return res.json()})
            .then(data => {
                setUsers(data)
            });
    }, []);

    useEffect(() => {
        if(user) {
            fetch(`https://quickmed-server-side.onrender.com/users/${user?.email}`, {
                method: 'GET',
                headers:{
                    'authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
            .then(res => {
                return res.json()})
            .then(data => {
                setDoctor(data)
            });
        }
    }, [user]);

    useEffect(() => {
        if(user) {
            fetch(url_1, {
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
                setUserInfo(data[0])
            });
        }
    }, [user]);

    const url = `https://quickmed-server-side.onrender.com/all_bookings_for_doctor?service=${userInfo.specialization}`;

    useEffect(() => {
        if(userInfo.specialization) {
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
        }
    }, [userInfo.specialization]);

    const handleAcceptBooking = (id, email) => {
        fetch(`https://quickmed-server-side.onrender.com/bookings_accepted/${id}`, {
            method: 'PATCH', 
            headers: {
                'content-type': 'application/json',
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
            toast.success('Appointment accepted successfully.');
        })
        
        fetch(`https://quickmed-server-side.onrender.com/users/${email}`, {
            method: 'GET', 
            headers: {
                'authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        }).then(res => {return res.json()})
        .then(data => {
            console.log(data);
            setUserID(data)
        });
    
    };

    const callMaker = (appointmentID, email) => {

        const url = `https://quickmed-server-side.onrender.com/bookings/calls/started/${appointmentID}`;
        fetch(url, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
        })
        .then(res=> res.json())
        .then(result =>{
            console.log("Call Status: ", result);
        });

        fetch(`https://quickmed-server-side.onrender.com/users/${email}`, {
            method: 'GET', 
            headers: {
                'authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setUserID(data); // Set the user ID here
            
            // Now that userID is set, initiate the call here
            initiateCall(doctor, data._id, appointmentID);
        });

        // initiateCall("ENj33EbFCESwmpJz0IzezVaHJg62");
    };

    const navigateToPatient = (email) => {
        fetch(`https://quickmed-server-side.onrender.com/users/wallet/${email}`, {
          method: 'GET',
          headers: {
            'authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json(); // Parse the JSON from the response
          })
          .then(data => {
            console.log("The Wallet is:", data.walletAddress);
            setWallet(data.walletAddress); // Set the wallet address
          })
          .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
          });
      };
    
      useEffect(() => {
        if (wallet) {
          // Navigate only after wallet is updated
          navigate(`/dashboard/consult_patient/${wallet}`);
        }
      }, [wallet, navigate]);

    return (
        <div className='mb-[60px] mx-[10px]'>
            <Helmet>
                <title>QuickMed-All Appointments</title>
            </Helmet>
             <h1 className='text-transparent bg-clip-text bg-gradient-to-br from-accent to-secondary text-5xl mb-8 font-bold shadow-lg shadow-[gray] hover:shadow-xl hover:shadow-[gray] mx-[1vw] py-[1vw] rounded-lg'>All {userInfo.specialization} <span className='text-[#20242c]'>Appointments</span></h1>
            <div className="overflow-x-auto rounded-xl shadow-xl shadow-[gray]">
                <table className="table-zebra w-full">
                    <thead className='bg-gradient-to-br from-accent to-secondary text-white'>
                        <tr>
                            <th className='py-5'></th>
                            <th className='py-5'>Name</th>
                            <th className='py-5'>Email</th>
                            <th className='py-5'>Phone Number</th>
                            <th className='py-5'>Service</th>
                            <th className='py-5'>Date</th>
                            <th className='py-5'>Time</th>
                            <th className='py-5'>Location</th>
                            <th className='py-5'>Action</th>
                            <th className='py-5'>Report</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            appointments &&
                            appointments?.map((appointment, i) => <tr key={appointment._id}>
                                <th className='text-center py-5'>{i + 1}</th>
                                <td className='text-sm text-center py-5'>{appointment.username}</td>
                                <td className='text-sm text-center py-5'>{appointment.email}</td>
                                <td className='text-sm text-center py-5'>{appointment.phone}</td>
                                <td className='text-sm text-center py-5'>{appointment.service}</td>
                                <td className='text-sm text-center py-5'>{appointment.appointmentDate}</td>
                                <td className='text-sm text-center py-5'>{appointment.slot}</td>
                                <td className='text-sm text-center py-5'>{appointment.location}</td>
                                {
                                            appointment.status==="unpaid" && 
                                            <td className="text-center  font-bold text-[red] px-6 py-4 whitespace-nowrap">
                                            Unpaid
                                        </td>
                                        }
                                        {
                                            appointment.status==="completed" && 
                                            <td className="font-bold text-center text-[green] px-6 py-4 whitespace-nowrap">
                                            Completed
                                        </td>
                                        }
                                {
                                    appointment.status==="pending" &&
                                    <td className="text-center text-white px-6 py-4 whitespace-nowrap">
                                    <button onClick={()=>handleAcceptBooking(appointment._id, appointment.email)} className='text-sm rounded-md bg-[green] hover:bg-gradient-to-br hover:from-accent to-secondary text-white py-1 px-5 md:px-24 border-0 shadow shadow-[black]'>Accept... <FontAwesomeIcon className='text-white' icon={faCheckToSlot} beatFade></FontAwesomeIcon></button>
                                    </td>
                                }
                                {
                                    appointment.status==="ongoing" &&
                                    <td className="font-bold text-center text-[goldenrod] px-6 py-4 whitespace-nowrap">
                                            Ongoing Consultaion
                                        </td>
                                }
                                {
                                    appointment.status==="accepted" &&
                                    <td className="text-center text-white px-6 py-4 whitespace-nowrap">
                                    <button onClick={()=>callMaker(appointment._id, appointment.email)} className='text-sm rounded-md bg-[red] hover:bg-gradient-to-br hover:from-accent to-secondary text-white py-1 px-5 md:px-24 border-0 shadow shadow-[black]'>Call... <FontAwesomeIcon className='text-white' icon={faPhoneFlip} shake></FontAwesomeIcon></button>
                                    </td>
                                }
                                {
                                    Object.keys(users.filter((user) => user.email === appointment.email && user?.profileCreated === "True")).length !== 0 ?
                                    <td className="text-center text-white px-6 py-4 whitespace-nowrap">
                                        <button onClick={()=>navigateToPatient(appointment.email)} className='text-sm rounded-md bg-[#e7be4eef] hover:bg-gradient-to-br hover:from-accent to-secondary text-white py-1 px-5 md:px-24 border-0 shadow shadow-[black]'>Report Submit... <FontAwesomeIcon className='text-white' icon={faCheckToSlot}></FontAwesomeIcon></button>
                                    </td>
                                    :
                                    <td className="text-center  font-bold text-[#e7be4eef] px-6 py-4 whitespace-nowrap">
                                            Profile not Created
                                        </td>
                                }
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DoctorAppointment;