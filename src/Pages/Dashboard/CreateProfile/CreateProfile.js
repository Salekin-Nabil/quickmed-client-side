import React, { useRef, useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import Helmet from 'react-helmet';
import { useForm } from 'react-hook-form';
import ReactStars from "react-rating-stars-component";
import auth from '../../../firebase.init';
import logo from '../../../assets/icons/logos/quickmed_diagnostic.jpg';
import toast, { Toaster } from 'react-hot-toast';
import '../../Shared/gradient.css';
import Web3 from 'web3';
import patientRecordABI from '../SmartContracts/ABI/patientRecordABI';
import patientRecordAddress from '../SmartContracts/ContractAddress/patientRecordAddress';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, Outlet } from 'react-router-dom';

const CreateProfile = () => {
    const [user] = useAuthState(auth);
    const {displayName, email} = user;
    const ageRef = useRef('');
    const phoneRef = useRef('');
    const addressRef = useRef('');
    const medConditionRef = useRef('');

    const { register, handleSubmit } = useForm();

    const [web3, setWeb3] = useState(null);
  const [patientRecord, setPatientRecord] = useState(null);

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      window.ethereum.request({ method: 'eth_requestAccounts' });

      const contractInstance = new web3Instance.eth.Contract(patientRecordABI, patientRecordAddress);
      setPatientRecord(contractInstance);
      console.log('Web3 initialized and contract loaded:', contractInstance);
    } else {
      console.error('MetaMask not detected. Please install MetaMask!');
    }
  }, []);

  const onSubmit = () => {
    if (!web3 || !patientRecord) {
      console.error('Web3 or contract is not initialized');
      return;
    }

    const data = [
      user.displayName,
      ageRef.current.value,
      phoneRef.current.value,
      addressRef.current.value,
      '',
      '',
      medConditionRef.current.value,
    ];
    console.log('Form data:', data);

    web3.eth.getAccounts()
      .then((accounts) => {
        const acc = accounts[0];
        const data = {"walletAddress":acc};
        fetch(`https://quickmed-server-side.onrender.com/users/wallet/${email}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body : JSON.stringify(data)
        });
      }).then(res=> res.json())
      .then(result =>{
          console.log(result);
          toast.success('Profile has been successfully created. Thank You.');
      });

    web3.eth.getAccounts()
      .then((accounts) => {
        const acc = accounts[0];
        return patientRecord.methods
          .addPatient(
            acc,
            user.displayName,
            ageRef.current.value,
            phoneRef.current.value,
            addressRef.current.value,
            '',
            '',
            medConditionRef.current.value
          )
          .send({ from: acc });
      })
      .then((tx) => {
        console.log('Transaction successful:', tx);
      })
      .catch((err) => {
        console.error('Error during transaction:', err);
      });
  };
  
    return (
        <div>
            <Helmet>
                <title>QuickMed-Create Profile</title>
            </Helmet>
            <div className='flex justify-between mb-8 font-bold shadow-lg shadow-[gray] hover:shadow-xl hover:shadow-[gray] mx-[1vw] py-[1vw] rounded-lg'>
             <h1 className='ml-8 text-transparent bg-clip-text bg-gradient-to-br from-accent to-secondary text-5xl '>Create <span className='text-[#20242c]'>Profile</span></h1>
             <div className='mr-8'><li><Link className='font-black text-3xl py-3 px-5 bg-[#fd3434a1] rounded-full' to="/dashboard/my_profile"><FontAwesomeIcon className='text-white' icon={faArrowLeft} beatFade></FontAwesomeIcon></Link></li></div></div>
             <div className='flex items-center'>
                <div className='hidden md:block'>
                    <img src={logo} alt=''/>
                </div>
                <div className="block p-6 rounded-xl shadow-lg shadow-[gray] hover:shadow-xl hover:shadow-[gray] bg-white w-full md:mx-10 mb-8">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <p className='text-2xl text-center font-black mb-4 text-transparent bg-clip-text bg-gradient-to-br from-accent to-secondary uppercase'>Create Your Profile</p>
                        <div className="form-group mb-6 w-full mr-2">
                            <input type="text" className="block
                                    w-full
                                    px-3
                                    py-1.5
                                    text-base
                                    font-normal
                                    text-gray-700
                                    bg-white bg-clip-padding
                                    border-4 border-solid border-[#194519]
                                    shadow-lg shadow-[gray] hover:shadow-xl hover:shadow-[gray]
                                    rounded-xl
                                    transition
                                    ease-in-out
                                    m-0
                                    focus:text-gray-700 focus:bg-white focus:border-[#194519] focus:outline-none"
                                    value={displayName} readOnly required/>
                        </div>
                        <div className="form-group mb-6 w-full">
                            <input type="number" className="block
                                    w-full
                                    px-3
                                    py-1.5
                                    text-base
                                    font-normal
                                    text-gray-700
                                    bg-white bg-clip-padding
                                    border-4 border-solid border-[#194519]
                                    shadow-lg shadow-[gray] hover:shadow-xl hover:shadow-[gray]
                                    rounded-xl
                                    transition
                                    ease-in-out
                                    m-0
                                    focus:text-gray-700 focus:bg-white focus:border-[#194519] focus:outline-none"
                                    ref={ageRef}
                                    placeholder="Your Age" required/>
                        </div>
                        <div className="form-group mb-6 w-full">
                            <input type="text" className="block
                                    w-full
                                    px-3
                                    py-1.5
                                    text-base
                                    font-normal
                                    text-gray-700
                                    bg-white bg-clip-padding
                                    border-4 border-solid border-[#194519]
                                    shadow-lg shadow-[gray] hover:shadow-xl hover:shadow-[gray]
                                    rounded-xl
                                    transition
                                    ease-in-out
                                    m-0
                                    focus:text-gray-700 focus:bg-white focus:border-[#194519] focus:outline-none"
                                    ref={phoneRef}
                                    placeholder="Your Phone Number" required/>
                        </div>
                        <div className="form-group mb-6 w-full mr-2">
                            <textarea className="form-control block
                                    w-full
                                    px-3
                                    py-1.5
                                    text-base
                                    font-normal
                                    text-gray-700
                                    bg-white bg-clip-padding
                                    border-4 border-solid border-[#194519]
                                    shadow-lg shadow-[gray] hover:shadow-xl hover:shadow-[gray]
                                    rounded-xl
                                    transition
                                    ease-in-out
                                    m-0
                                    focus:text-gray-700 focus:bg-white focus:border-[#194519] focus:outline-none"
                                    ref={addressRef}
                                    placeholder="Your Address" required rows={5}/>
                        </div>
                        <div className="form-group mb-6 w-full mr-2">
                            <textarea className="form-control block
                                    w-full
                                    px-3
                                    py-1.5
                                    text-base
                                    font-normal
                                    text-gray-700
                                    bg-white bg-clip-padding
                                    border-4 border-solid border-[#194519]
                                    shadow-lg shadow-[gray] hover:shadow-xl hover:shadow-[gray]
                                    rounded-xl
                                    transition
                                    ease-in-out
                                    m-0
                                    focus:text-gray-700 focus:bg-white focus:border-[#194519] focus:outline-none"
                                    ref={medConditionRef}
                                    placeholder="Any Medical Condition" rows={5}/>
                        </div>
                                
                        <div className="form-group form-check text-center mb-6">
                            <input type="checkbox"
                                    className="form-check-input appearance-none h-4 w-4 border border-[#194519] rounded-sm bg-white checked:bg-[#194519] checked:border-[#194519] focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain mr-2 cursor-pointer"
                            />
                            <label className="form-check-label inline-block text-[#20242c]" htmlFor="exampleCheck87">Send me a copy of this message</label>
                            </div>
                            <button type="submit" className="
                                w-full
                                px-6
                                py-2.5
                                gradient_background
                                text-white
                                font-medium
                                text-xs
                                leading-tight
                                uppercase
                                rounded-xl
                                hover:bg-[#3a8e50]
                                focus:bg-[#1d4e25] 
                                active:bg-[#153a18] focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg
                                shadow-lg shadow-[gray] hover:shadow-xl hover:shadow-[gray]
                                transition
                                duration-150
                                ease-in-out">Create</button>
                    </form>
                </div>
                <div className='hidden md:block'>
                    <img src={logo} alt=''/>
                    
                </div>
            </div>
            <Toaster/>
        </div>
    );
};

export default CreateProfile;