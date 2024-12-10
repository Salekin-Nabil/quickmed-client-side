import React from 'react';
import Helmet from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import Loading from '../../Loading/Loading';
import { useState, useEffect } from 'react';
import logo from '../../../assets/icons/logos/quickmed_diagnostic.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import summary_pic from '../../../assets/images/summary.jpg';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../../firebase.init';


const Summary = () => {
    const [user] = useAuthState(auth);
    const {id} = useParams();
    const [summary, setSummary] = useState({});

    const url = `https://quick-med.fly.dev/appointments/${id}/conversation`;

    useEffect(() => {
        if(user) {
            fetch(url, {
                method: 'GET',
                headers:{
                    'authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
            .then(res => {
                return res.json()})
            .then(data => {
                setSummary(data);
            });
        }
    }, [user]);

    return (
        <div className='mb-24'>
            <Helmet>
                <title>QuickMed-Consultation Summary</title>
            </Helmet>
            <div className='flex justify-between mb-8 font-bold shadow-lg shadow-[gray] hover:shadow-xl hover:shadow-[gray] mx-[1vw] py-[1vw] rounded-lg'>
             <h1 className='ml-8 text-transparent bg-clip-text bg-gradient-to-br from-accent to-secondary text-5xl '>Consultation <span className='text-[#20242c]'>Summary</span></h1>
             <div className='mr-8'><li><Link className='font-black text-3xl py-3 px-5 bg-[#fd3434a1] rounded-full' to="/dashboard"><FontAwesomeIcon className='text-white' icon={faArrowLeft} beatFade></FontAwesomeIcon></Link></li></div></div>
            <div className='flex items-center justify-center'>
                <div className='hidden md:block animate-pulse'>
                    <img src={logo} alt=''/>
                </div>
                <div className="max-w-lg rounded-xl overflow-hidden shadow-lg">
                  <img className="w-full" src={summary_pic} alt="Sunset in the mountains"/>
                  <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">The Consultation Summary</div>
                    <p className="text-gray-700 text-base">
                      {summary.summary}
                    </p>
                  </div>
                  <div className="px-6 pt-4 pb-2">
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#appointmentId</span>
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{summary.appointmentId}</span>
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#consultation_summary</span>
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#power_by_gemini</span>
                  </div>
                </div>
            <div className='hidden md:block animate-pulse'>
                    <img src={logo} alt=''/>
            </div>
            </div>
        </div>
    );
};

export default Summary;