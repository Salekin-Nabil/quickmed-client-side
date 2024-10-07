import { useQuery } from '@tanstack/react-query';
// import React, { useContext } from 'react';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../../firebase.init';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { Helmet } from 'react-helmet';
// import { Link } from 'react-router-dom';
// import { AuthContext } from '../../../contexts/AuthProvider';

const AllBookings = () => {
    // const { user } = useContext(AuthContext);
    const [appointments, setAppoinments] = useState([]);
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();

    const url = `http://localhost:7000/all_bookings`;

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

    useEffect(() => {
        if(user) {
            fetch(url, {
                method: 'GET',
                headers:{
                    'authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
            .then(res => {
                console.log("res:", res);
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
    }, [user]);

    return (
        <div className='mb-[60px] mx-[10px]'>
            <Helmet>
                <title>QuickMed-All Appointments</title>
            </Helmet>
             <h1 className='text-transparent bg-clip-text bg-gradient-to-br from-accent to-secondary text-5xl mb-8 font-bold shadow-lg shadow-[gray] hover:shadow-xl hover:shadow-[gray] mx-[1vw] py-[1vw] rounded-lg'>All <span className='text-[#20242c]'>Appointments</span></h1>
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
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllBookings;