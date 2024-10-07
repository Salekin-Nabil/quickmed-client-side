import React from 'react';
import about_1 from '../../assets/images/about_1.png'
import about_2 from '../../assets/images/about_2.png'
import about_3 from '../../assets/images/about_3.png'
import about_bg1 from '../../assets/images/appointment.jpeg'
import about_bg2 from '../../assets/images/appointment2.jpeg'
import about_bg3 from '../../assets/images/appointment1.png'

const About = () => {
    return (
        <div>
            <h1 className='text-center uppercase font-black text-5xl'>About Our Services</h1>
            <section style={{
            background: `url(${about_bg1})`
        }} 
        className='flex justify-center items-center md:mt-[18rem]'>
            <div className='flex-1 hidden lg:block'>
                <img className='mt-[-280px] mb-[-46px] w-[29vw] ml-[10vw]' src={about_3} alt="" />
            </div>
            <div className='flex-1 px-5 hover:cursor-pointer'>
                <h3 className='text-2xl text-orange-300 font-bold'>QuickMed: Where AI Meets Expert Care – Fast, Reliable, Always There!</h3>
                <h2 className='text-3xl font-black text-white py-2'>Smart Healthcare Solutions in Seconds</h2>
                <p className='text-white pb-2'>QuickMed combines the speed of AI with the expertise of real doctors to bring you healthcare like never before. Whether you need quick answers from our AI-powered chatbot or personalized guidance from a licensed physician, we’ve got you covered 24/7. Skip the waiting room and get instant, reliable care for any health issue, anytime, anywhere. QuickMed ensures fast solutions and expert care are always just a click away!</p>
            </div>
        </section>
            <section style={{
            background: `url(${about_bg2})`
        }} 
        className='flex justify-center items-center md:mt-[16rem]'>
            <div className='flex-1 px-5 hover:cursor-pointer'>
                <h3 className='text-2xl text-orange-300 font-bold'>Our Commitment</h3>
                <h2 className='text-3xl font-black text-white py-2'>Dedicated Care When You Need It Most</h2>
                <p className='text-white pb-2'>At QuickMed, your health is our top priority. We're committed to providing you with fast, reliable care, no matter the time or place. With our AI-driven solutions and dedicated team of doctors, you can count on personalized support around the clock. Whether it's an emergency or routine care, QuickMed is always there—ensuring you get the quality healthcare you deserve, every single time.</p>
            </div>
            <div className='flex-1 hidden lg:block'>
                <img className='mt-[-280px] mb-[-115px] w-[24vw] ml-[10vw]' src={about_2} alt="" />
            </div>
        </section>
            <section style={{
            background: `url(${about_bg3})`
        }} 
        className='flex justify-center items-center md:mt-[20rem]'>
            <div className='flex-1 hidden lg:block'>
                <img className='mt-[-290px] mb-[-30px] w-[29vw] ml-[10vw]' src={about_1} alt="" />
            </div>
            <div className='flex-1 px-5 hover:cursor-pointer'>
                <h3 className='text-2xl text-orange-300 font-bold'>Your Health Can’t Wait – Book with QuickMed Today!</h3>
                <h2 className='text-3xl font-black text-white py-2'>Easy Appointments, Expert Care</h2>
                <p className='text-white pb-2'>Don't wait to get the care you need. With QuickMed, booking an appointment is fast, simple, and hassle-free. Whether it's a routine check-up or urgent consultation, our team of experienced doctors is ready to help. Just a few clicks and you’re on your way to expert care, anytime, anywhere. Take control of your health and schedule your appointment today!</p>
            </div>
        </section>
        </div>
    );
};

export default About;