import React from 'react';
// import doctor from '../../assets/images/doctor.png';
import ai_doctor from '../../assets/images/AI_Doctor.png';
import appointment from '../../assets/images/appointment.jpeg';
import PrimaryButton from '../Shared/PrimaryButton';

const MakeAppointment = () => {
    return (
        <section style={{
            background: `url(${appointment})`
        }} 
        className='flex justify-center items-center md:mt-[10rem]'>
            <div className='flex-1 hidden lg:block'>
                <img className='mt-[-120px] mb-[-70px] w-[26vw] ml-[10vw]' src={ai_doctor} alt="" />
            </div>
            <div className='flex-1 px-5'>
                <h3 className='text-xl text-transparent bg-clip-text bg-gradient-to-br from-accent to-secondary font-bold'>Appointment</h3>
                <h2 className='text-3xl text-white py-2'>Make an Appointment Today</h2>
                <p className='text-white pb-2'>Need personalized care? Schedule a consultation with one of our licensed doctors in just a few clicks. Whether it's for a routine check-up or urgent care, our medical professionals are ready to assist. Make an appointment today and get the expert help you need, when you need it!</p>
                <PrimaryButton><a href='/appointment'>Get Started</a></PrimaryButton>
            </div>
        </section>
    );
};

export default MakeAppointment;