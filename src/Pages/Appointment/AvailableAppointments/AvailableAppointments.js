import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import BookingModal from '../BookingModal/BookingModal';
import AppointmentOption from './AppointmentOption';
import Loading from '../../Loading/Loading';
import { useQuery } from 'react-query';

const AvailableAppointments = ({ selectedDate }) => {
    // const [appointmentOptions, setAppointmentOptions] = useState([]);
    const [treatment, setTreatment] = useState(null);

    // useEffect(() => {
    //     fetch('https://quickmed-server-side.onrender.com/service')
    //         .then(res => res.json())
    //         .then(data => setAppointmentOptions(data))
    // }, [])

    const date = format(selectedDate, 'PP');
    const { data: appointmentOptions = [], refetch, isLoading } = useQuery({
        queryKey: ['appointmentOptions', date],
        queryFn: async () => {
            const res = await fetch(`https://quickmed-server-side.onrender.com/v2/appointmentOptions?date=${date}`);
            const data = await res.json();
            return data
        }
    });

    if(isLoading){
        return <Loading></Loading>
    }

    return (
        <section className='my-16'>
            <p className='text-center text-2xl text-green-900 font-bold'>Available Appointments on {format(selectedDate, 'PP')}</p>
            <div className='grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6'>
                {
                    appointmentOptions.map(option => <AppointmentOption
                        key={option._id}
                        appointmentOption={option}
                        setTreatment={setTreatment}
                    ></AppointmentOption>)
                }
            </div>
            {
                treatment &&
                <BookingModal
                    selectedDate={selectedDate}
                    treatment={treatment}
                    setTreatment={setTreatment}
                    refetch={refetch}
                ></BookingModal>
            }
        </section>
    );
};

export default AvailableAppointments;