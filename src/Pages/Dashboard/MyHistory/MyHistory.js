import { useQuery } from '@tanstack/react-query';
// import React, { useContext } from 'react';
import React from 'react';
// import { Link } from 'react-router-dom';
// import { AuthContext } from '../../../contexts/AuthProvider';

const MyHistory = () => {
    // const { user } = useContext(AuthContext);

    // const url = `https://doctors-portal-server-rust.vercel.app/bookings?email=${user?.email}`;

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

    return (
        <div>
            <h3 className="text-3xl mb-5 font-bold text-transparent bg-clip-text bg-gradient-to-br from-accent to-secondary text-center uppercase">My History</h3>
            {/* <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Treatment</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Payment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            bookings &&
                            bookings?.map((booking, i) => <tr key={booking._id}>
                                <th>{i + 1}</th>
                                <td>{booking.patient}</td>
                                <td>{booking.treatment}</td>
                                <td>{booking.appointmentDate}</td>
                                <td>{booking.slot}</td>
                                <td>
                                    {
                                        booking.price && !booking.paid && <Link
                                            to={`/dashboard/payment/${booking._id}`}
                                        >
                                            <button
                                                className='btn btn-primary btn-sm'
                                            >Pay</button>
                                        </Link>
                                    }
                                    {
                                        booking.price && booking.paid && <span className='text-green-500'>Paid</span>
                                    }
                                </td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </div> */}
        </div>
    );
};

export default MyHistory;

// import React from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { Link, Outlet } from 'react-router-dom';
// import auth from '../../../firebase.init';
// // import useAdmin from '../../hooks/useAdmin';

// const MyAppointment = () => {
//     const [user] = useAuthState(auth);
//     // const [admin] = useAdmin(user);
//     return (
//         <div className="">
//             <h1>My Appointment</h1>
//         </div>
//     );
// };

// export default MyAppointment;