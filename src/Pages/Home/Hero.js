import React from 'react';
import quickMed from '../../assets/images/quickmed_diagnostic.jpg';
import PrimaryButton from '../Shared/PrimaryButton';

const Hero = () => {
    return (
            <div className="hero min-h-screen lg:mt-[-150px] lg:mb-[-310px] max-w-full">
                     <div className="hero-content flex-col lg:flex-row-reverse">
                        <img src={quickMed} className="sm:max-w-lg lg:max-w-sm rounded-xl shadow-2xl" />
                         <div>
                             <h1 className="lg:text-5xl font-black">In a Health Emergency? QuickMed’s AI and Doctors Are Just a Click Away!</h1>
                             <p className="py-6 lg:text-3xl font-bold">QuickMed offers 24/7 emergency healthcare with the power of AI and real doctors. Get quick answers from our AI chatbot or connect with a licensed physician for expert care anytime, anywhere.</p>
                             <PrimaryButton><a href='/appointment'>Get Started</a></PrimaryButton>
                         </div>
                     </div>
            </div>
        
    );
};

export default Hero;