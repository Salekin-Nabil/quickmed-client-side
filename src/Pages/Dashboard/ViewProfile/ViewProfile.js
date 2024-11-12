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

const ViewProfile = () => {
    const [user] = useAuthState(auth);
    const {displayName} = user;
    const ageRef = useRef('');
    const phoneRef = useRef('');
    const addressRef = useRef('');
    const medConditionRef = useRef('');
    const [userInfo, setUserInfo] = useState({});
    const [age, setAge] = useState(null);

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

  // Fetch data only once after patientRecord is set
  useEffect(() => {
    if (web3 && patientRecord) {
      web3.eth.getAccounts()
        .then((accounts) => {
          const acc = accounts[0];
          return patientRecord.methods
            .getPatientDetails(acc).call();
        })
        .then((result) => {
          setAge(Number(result[1].toString()));
          setUserInfo(result);
          console.log(result);
        })
        .catch((err) => {
          console.error('Error during transaction:', err);
        });
    }
  }, [web3, patientRecord]); // This ensures the effect runs only once when web3 and patientRecord are set

  let i = 0;

    return (
        <div>
            <Helmet>
                <title>QuickMed-Update Profile</title>
            </Helmet>
            <div className='flex justify-between mb-8 font-bold shadow-lg shadow-[gray] hover:shadow-xl hover:shadow-[gray] mx-[1vw] py-[1vw] rounded-lg'>
             <h1 className='ml-8 text-transparent bg-clip-text bg-gradient-to-br from-accent to-secondary text-5xl '>View <span className='text-[#20242c]'>Profile</span></h1>
             <div className='mr-8'><li><Link className='font-black text-3xl py-3 px-5 bg-[#fd3434a1] rounded-full' to="/dashboard/my_profile"><FontAwesomeIcon className='text-white' icon={faArrowLeft} beatFade></FontAwesomeIcon></Link></li></div></div>
             
             <div className="overflow-x-auto rounded-xl shadow-xl shadow-[gray]">
                <table className="table-zebra w-full">
                    <thead className='bg-gradient-to-br from-accent to-secondary text-white'>
                        <tr>
                            <th className='py-5'></th>
                            <th className='py-5'>Name</th>
                            <th className='py-5'>Age</th>
                            <th className='py-5'>Phone Number</th>
                            <th className='py-5'>Home Address</th>
                            <th className='py-5'>Prescription</th>
                            <th className='py-5'>Medical Test Result</th>
                            <th className='py-5'>Medical Condition</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            <tr>
                                <th className='text-center py-5'>{i+1}</th>
                                <td className='text-sm text-center py-5'>{displayName}</td>
                                <td className='text-sm text-center py-5'>{age || ""}</td>
                                <td className='text-sm text-center py-5'>{userInfo[2] || ""}</td>
                                <td className='text-sm text-center py-5'>{userInfo[3] || ""}</td>
                                <td className='text-sm text-center py-5'>{userInfo[4] || ""}</td>
                                <td className='text-sm text-center py-5'>{userInfo[5] || ""}</td>
                                <td className='text-sm text-center py-5'>{userInfo[6] || ""}</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
            <Toaster/>
        </div>
    );
};

export default ViewProfile;