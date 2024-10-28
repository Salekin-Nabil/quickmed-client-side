import React, { useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import Helmet from 'react-helmet';
import { useForm } from 'react-hook-form';
import ReactStars from "react-rating-stars-component";
import auth from '../../firebase.init';
import logo from '../../assets/icons/logos/quickmed_diagnostic.jpg';
import toast, { Toaster } from 'react-hot-toast';
import '../Shared/gradient.css'

const ApplyDoctor = () => {
    const [user] = useAuthState(auth);
    const {displayName, email} = user;
    const expRef = useRef('');
    const specialiaztionRef = useRef('');
    const qualificationRef = useRef('');

    const { register, handleSubmit } = useForm();
    const onSubmit = () => {
        const data = {
            "userName": user.displayName,
            "userEmail": user.email,
            "userPhoto": user.photoURL,
            "specialization": specialiaztionRef.current.value,
            "qualification": qualificationRef.current.value,
            "experience": expRef.current.value,
            "role": ""
        };
        console.log(data);
        
        const url = `http://localhost:3000/doctor/${email}`;
        fetch(url, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res=> res.json())
        .then(result =>{
            console.log(result);
            toast.success('Thanks for your application.');
        });
    };
    return (
        <div>
            <Helmet>
                <title>QuickMed-Apply as a Doctor</title>
            </Helmet>
             <h1 className='text-transparent text-center bg-clip-text bg-gradient-to-br from-accent to-secondary text-5xl mb-8 font-bold shadow-lg shadow-[gray] hover:shadow-xl hover:shadow-[gray] mx-[1vw] py-[1vw] rounded-lg'>Apply As A <span className='text-[#20242c]'>Doctor</span></h1>
             <div className='flex items-center justify-center'>
                <div className='hidden md:block'>
                    <img src={logo} alt=''/>
                </div>
                <div className="block p-6 rounded-xl shadow-lg shadow-[gray] hover:shadow-xl hover:shadow-[gray] bg-white md:mx-10 mb-8 w-[50vw] lg:w-[30vw]">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <p className='text-2xl text-center font-black mb-4 text-transparent bg-clip-text bg-gradient-to-br from-accent to-secondary uppercase'>Application Form</p>
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
                            <input type="email" className="block
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
                                    value={email} readOnly required/>
                        </div>
                        <label className='px-3 text-base font-normal text-gray-700'>Specialization</label>
                        <select name="specialization" ref={specialiaztionRef} className="select select-bordered w-full px-3 border-4 border-solid mb-6 mt-3
                                    py-1.5
                                    text-base
                                    font-normal
                                    text-gray-700
                                    bg-white bg-clip-padding border-[#194519]
                                    shadow-lg shadow-[gray] hover:shadow-xl hover:shadow-[gray]
                                    rounded-xl
                                    transition
                                    ease-in-out
                                    m-0
                                    focus:text-gray-700 focus:bg-white focus:border-[#194519] focus:outline-none" required>
                            <option value="Dermatology" key={1}>Dermatology</option>
                            <option value="Psychiatry" key={2}>Psychiatry</option>
                            <option value="Gynecology" key={3}>Gynecology</option>
                            <option value="Cardiology" key={4}>Cardiology</option>
                            <option value="Pediatrics" key={5}>Pediatrics</option>
                            <option value="Endocrinology" key={6}>Endocrinology</option>
                            <option value="Neurology" key={7}>Neurology</option>
                            <option value="Gastroenterology" key={8}>Gastroenterology</option>
                            <option value="Rheumatology" key={9}>Rheumatology</option>
                            <option value="Ophthalmology" key={10}>Ophthalmology</option>
                            <option value="Urology" key={11}>Urology</option>
                            <option value="Orthopedics" key={12}>Orthopedics</option>
                        </select>

                        <label className='px-3 text-base font-normal text-gray-700'>Most Advanced Qualification</label>
                        <select name="qualification" ref={qualificationRef} className="select select-bordered w-full px-3 border-4 border-solid mb-6 mt-3
                                    py-1.5
                                    text-base
                                    font-normal
                                    text-gray-700
                                    bg-white bg-clip-padding border-[#194519]
                                    shadow-lg shadow-[gray] hover:shadow-xl hover:shadow-[gray]
                                    rounded-xl
                                    transition
                                    ease-in-out
                                    m-0
                                    focus:text-gray-700 focus:bg-white focus:border-[#194519] focus:outline-none" required>
                            <option value="Doctor of Medicine (M.D.)" key={1}>Doctor of Medicine (M.D.)</option>
                            <option value="Bachelor of Medicine, Bachelor of Surgery (MBBS or MBChB)" key={2}>Bachelor of Medicine, Bachelor of Surgery (MBBS or MBChB)</option>
                            <option value="Doctor of Osteopathic Medicine (D.O.)" key={3}>Doctor of Osteopathic Medicine (D.O.)</option>
                            <option value="Master of Science in Medicine (M.Sc. Med.)" key={4}>Master of Science in Medicine (M.Sc. Med.)</option>
                            <option value="Master of Public Health (M.P.H.)" key={5}>Master of Public Health (M.P.H.)</option>
                            <option value="Doctor of Medical Science (DMSc)" key={6}>Doctor of Medical Science (DMSc)</option>
                            <option value="Doctor of Philosophy (Ph.D.) in Medical Science" key={7}>Doctor of Philosophy (Ph.D.) in Medical Science</option>
                            <option value="Doctor of Clinical Medicine (D.C.M.)" key={8}>Doctor of Clinical Medicine (D.C.M.)</option>
                            <option value="M.D./Ph.D." key={9}>M.D./Ph.D.</option>
                            <option value="M.D./M.P.H." key={10}>M.D./M.P.H.</option>
                            <option value="M.D./M.B.A." key={11}>M.D./M.B.A.</option>
                            <option value="Fellow of the College of Physicians and Surgeons (F.C.P.S.)" key={12}>Fellow of the College of Physicians and Surgeons (F.C.P.S.)</option>
                        </select>
                        {/* <div className="form-group mb-6 w-full">
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
                                    focus:text-gray-700 focus:bg-white focus:border-[#194519] focus:outline-none" ref={specialiaztionRef}
                                    placeholder='Specialization' required/>
                        </div> */}
                        {/* <div className="form-group mb-6 w-full">
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
                                    focus:text-gray-700 focus:bg-white focus:border-[#194519] focus:outline-none" ref={qualificationRef}
                                    placeholder='Educational Qualification' required/>
                        </div> */}
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
                                    ref={expRef}
                                    placeholder="Professional Experience" required rows={5}/>
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
                                ease-in-out">Submit Application</button>
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

export default ApplyDoctor;