// import { useQuery } from '@tanstack/react-query';
import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Loading from '../../Loading/Loading';
import { useQuery } from 'react-query';
import { Helmet } from 'react-helmet';

const DoctorsApplication = () => {
    // const {data: users = [], isLoading, refetch} = useQuery({
    //     queryKey: ['users'],
    //     queryFn: async() =>{
    //         const res = await fetch('http://localhost:3000/users');
    //         if(isLoading){
    //           return <Loading></Loading>
    //         }
    //         const data = await res.json();
    //         return data;
    //     }
    // });
    const {data: doctors, isLoading, refetch} = useQuery({
        queryKey: ['doctors'],
        queryFn: async() =>{
            const res = await fetch('http://localhost:3000/doctors', {
              method: 'GET',
              headers: {
                authorization: `Bearer ${localStorage.getItem('accessToken')}`
              }
            });
            const data = await res.json();
            return data;
        }
    });

    if(isLoading){
      return <Loading></Loading>
    }

    const handleDoctorApproval = email => {
        fetch(`http://localhost:3000/doctor/admin/${email}`, {
            method: 'PUT', 
            headers: {
                authorization: `bearer ${localStorage.getItem('accessToken')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if(data.modifiedCount > 0){
                toast.success('Doctor application approved.')
                refetch();
            }
        })
    }

    const handleDeleteDoctors = email => {
        fetch(`http://localhost:3000/doctor/${email}`, {
            method: 'DELETE', 
            headers: {
                authorization: `bearer ${localStorage.getItem('accessToken')}`
            }
        })
        .then(res => res.json())
        .then(data => {
                toast.success('Doctor application rejected.')
                refetch();
        })
    }

    return (
        <div className='mb-[60px] mx-[20px]'>
            <Helmet>
                <title>QuickMed-Doctor's Application Review</title>
            </Helmet>
             <h1 className='text-transparent bg-clip-text bg-gradient-to-br from-accent to-secondary text-5xl mb-8 font-bold shadow-lg shadow-[gray] hover:shadow-xl hover:shadow-[gray] mx-[1vw] py-[1vw] rounded-lg'>All Doctors <span className='text-[#20242c]'>Applications</span></h1>
            <div className="overflow-x-auto rounded-xl shadow-xl shadow-[gray]">
              <table className="table-zebra w-full">
                      <thead className='bg-gradient-to-br from-accent to-secondary text-white'>
                        <tr>
                          <th></th>
                          <th className='py-5'></th>
                          <th className='py-5'>Name</th>
                          <th className='py-5'>Email</th>
                          <th className='py-5'>Specialization</th>
                          <th className='py-5'>Qualification</th>
                          <th className='py-5'>Experience</th>
                          <th className='py-5'>Status</th>
                          <th className='py-5'>Remove Doctor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          doctors.map((doctor, i) =><tr key={doctor._id}>
                              <th>
                                <label>
                                  <input type="checkbox" className="checkbox" />
                                </label>
                              </th>
                              <th className='text-center py-5'>{i+1}</th>
                              <td>
                                <div className="flex items-center space-x-3  ml-10">
                                  <div className="avatar">
                                    <div className="mask mask-squircle w-12 h-12">
                                      <img src={doctor.userPhoto} alt="Avatar Tailwind CSS Component" />
                                    </div>
                                  </div>
                                  <div>
                                    <div className="font-bold">{doctor.userName}</div>
                                    <div className="text-sm opacity-50">United States</div>
                                  </div>
                                </div>
                              </td>
                              <td className='text-center py-5'>{doctor.email}</td>
                              <td className='text-center py-5'>{doctor.specialization}</td>
                              <td className='text-center py-5'>{doctor.qualification}</td>
                              <td className='text-center py-5'>{doctor.experience}</td>
                              <td className='text-center py-5'>{ doctor?.role !== 'doctor' ? <button onClick={() => handleDoctorApproval(doctor.email)} className='btn btn-xs btn-primary bg-[#2a6e2a] text-white border-0 shadow shadow-[black]'>Approve</button> : "Doctor"}</td>
                              <td className='text-center py-5'><button onClick={() => handleDeleteDoctors(doctor.email)} className='btn btn-xs btn-danger bg-[red] text-white border-0 shadow shadow-[black]'>Remove</button></td>
                            </tr>)
                        }
      
                      </tbody>
                    </table>
                  </div>
            <Toaster/>
        </div>
    );
};

export default DoctorsApplication;