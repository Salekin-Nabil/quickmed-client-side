// import React, { useContext } from 'react';
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../../firebase.init";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";
import { Helmet } from "react-helmet";
// import { Link } from 'react-router-dom';
// import { AuthContext } from '../../../contexts/AuthProvider';

const MyAppointment = () => {
  // const { user } = useContext(AuthContext);
  const [appointments, setAppoinments] = useState([]);
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  const url = `http://localhost:3000/bookings?email=${user?.email}`;

  useEffect(() => {
    if (user) {
      fetch(url, {
        method: "GET",
        headers: {
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
        .then((res) => {
          if (res.status === 401 || res.status === 403) {
            signOut(auth);
            localStorage.removeItem("accessToken");
            navigate("/");
          }
          return res.json();
        })
        .then((data) => {
          setAppoinments(data);
        });
    }
  }, [user]);

  const handleDeleteBooking = (id) => {
    fetch(`http://localhost:3000/bookings/${id}`, {
      method: "DELETE",
      headers: {
        authorization: `bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        fetch(url, {
          method: "GET",
          headers: {
            authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
          .then((res) => {
            if (res.status === 401 || res.status === 403) {
              signOut(auth);
              localStorage.removeItem("accessToken");
              navigate("/");
            }
            return res.json();
          })
          .then((data) => {
            setAppoinments(data);
          });
        toast.success("Booking cancelled successfully.");
      });
  };

  return (
    <div className="mb-[60px] mx-[20px]">
      <Helmet>
        <title>QuickMed-My Appointments</title>
      </Helmet>
      <h1 className="text-transparent bg-clip-text bg-gradient-to-br from-accent to-secondary text-5xl mb-8 font-bold shadow-lg shadow-[gray] hover:shadow-xl hover:shadow-[gray] mx-[1vw] py-[1vw] rounded-lg">
        My <span className="text-[#20242c]">Appointments</span>
      </h1>
      <div className="overflow-x-auto rounded-xl shadow-xl shadow-[gray]">
        <table className="table-zebra w-full">
          <thead className="bg-gradient-to-br from-accent to-secondary text-white">
            <tr>
              <th className="py-5"></th>
              <th className="py-5">Name</th>
              <th className="py-5">Service</th>
              <th className="py-5">Date</th>
              <th className="py-5">Time</th>
              <th className="py-5">Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments &&
              appointments?.map((appointment, i) => (
                <tr key={appointment._id}>
                  <th className="text-center py-5">{i + 1}</th>
                  <td className="text-center py-5">{appointment.username}</td>
                  <td className="text-center py-5">{appointment.service}</td>
                  <td className="text-center py-5">
                    {appointment.appointmentDate}
                  </td>
                  <td className="text-center py-5">{appointment.slot}</td>
                  <td className="text-center py-5">
                    <button
                      onClick={() => handleDeleteBooking(appointment._id)}
                      className="btn btn-xs btn-danger text-white bg-[red] border-0 shadow shadow-[black]"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <Toaster />
    </div>
  );
};

export default MyAppointment;
