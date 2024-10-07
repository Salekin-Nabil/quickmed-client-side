import React, { useContext, useState } from 'react';
import {useCreateUserWithEmailAndPassword, useSignInWithFacebook, useSignInWithGoogle, useUpdateProfile} from 'react-firebase-hooks/auth';
import auth from '../../firebase.init';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Loading from '../Loading/Loading';
import google from '../../assets/images/google.png';
import facebook from '../../assets/images/facebook.png';
import toast, { Toaster } from 'react-hot-toast';
import useToken from '../../hooks/useToken';
// import { AuthContext } from '../../contexts/AuthProvider';

const Signup = () => {
    const { register, formState: { errors }, handleSubmit } = useForm();
    // const { signIn } = useContext(AuthContext);
    // const [loginError, setLoginError] = useState('');
    // const [loginUserEmail, setLoginUserEmail] = useState('');
    // // const [token] = useToken(loginUserEmail);

    // const from = location.state?.from?.pathname || '/';

    // // if (token) {
    // //     navigate(from, { replace: true });
    // // }

    // const handleLogin = data => {
    //     console.log(data);
    //     setLoginError('');
    //     signIn(data.email, data.password)
    //         .then(result => {
    //             const user = result.user;
    //             console.log(user);
    //             setLoginUserEmail(data.email);
    //         })
    //         .catch(error => {
    //             console.log(error.message)
    //             setLoginError(error.message);
    //         });
    // }

    const [createUserWithEmailAndPassword,user1,loading1,error1] = useCreateUserWithEmailAndPassword(auth);

    const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

    const [signInWithFacebook, user2, loading2, error3] = useSignInWithFacebook(auth);

    const [displayName, setDisplayName] = useState('');
    // const [photoURL, setPhotoURL] = useState('');
    const [updateProfile, updating, error2] = useUpdateProfile(auth);

    const navigate = useNavigate();
    const location = useLocation();
    // const [img, setImg] = useState('');
    const [token] = useToken([(user || user1 || user2), displayName]);
    // const imageStorageKey = '4e2ac90c555ef2e96717462dc536a405';

    let from = location.state?.from?.pathname || "/";
    
    let errorElement;

    if(loading || loading1 || updating|| loading2){
        return <Loading></Loading>
    }

    if (error || error1 || error2 || error3) {
        errorElement = <p className='text-red-700  my-4 text-sm'>Error: {error?.message || error1?.message || error2?.message || error3?.message}</p>
    }

    if (token) {
        // console.log(user2);
        navigate(from, { replace: true });
    }

    const notify = () => toast.success('You Have Successfully Registered.');

    const OnSubmit = async data =>{
        setDisplayName(data.username);
        await createUserWithEmailAndPassword(data.email, data.password);
        // const image = data.photo[0];
        // console.log(data.photo[0]);
        // const formData = new FormData();
        // formData.append('photo', image);
        // const url = `https://api.imgbb.com/1/upload?key=${imageStorageKey}`;
        // fetch(url, {
        //     method: 'POST',
        //     body: formData
        // })
        // .then(res => res.json())
        // .then(result => {
        //     if(result.success){
        //         setImg(result.data.url);
        //         setPhotoURL(result.data.url);
        //     }
        //     console.log('imgbb:', result);
        //     console.log('url:', result.data.url);
        // });
        const success = await updateProfile({ displayName : data.username });
          if (success) {
            notify();
          }
    } 

    return (
        <div className='h-[800px] flex justify-center items-center place-content-between md:mt-[-60px] font-semibold'>
            <div className='w-96 p-7 shadow-lg shadow-[gray] rounded-xl'>
                <h2 className='text-xl text-center uppercase'>Sign Up</h2>
                {/* <form> */}
                <form onSubmit={handleSubmit(OnSubmit)}>
                    <div className="form-control w-full max-w-xs">
                        <label className="label"> <span className="label-text">Username</span></label>
                        <input type="text"
                            placeholder='Your Username'
                            {...register("username", {
                                required: "Username is required",
                                pattern: {
                                    value: /[a-z0-9]{3,20}/,
                                    message: "Provide a valid Username"
                                }
                            })}
                            className="input input-bordered w-full max-w-xs" />
                        {errors.username?.type === "required" && <p className='text-red-600'>{errors.username?.message}</p>}
                        {errors.username?.type === "pattern" && <p className='text-red-600'>{errors.username?.message}</p>}
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label"> <span className="label-text">Email</span></label>
                        <input type="email"
                            placeholder='Your Email'
                            {...register("email", {
                                required: "Email Address is required",
                                pattern: {
                                    value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                                    message: "Provide a valid Email"
                                }
                            })}
                            className="input input-bordered w-full max-w-xs" />
                        {errors.email?.type === "required" && <p className='text-red-600'>{errors.email?.message}</p>}
                        {errors.email?.type === "pattern" && <p className='text-red-600'>{errors.email?.message}</p>}
                    </div>
                    <div className="form-control w-full max-w-xs mb-5">
                        <label className="label"> <span className="label-text">Password</span></label>
                        <input type="password"
                            placeholder='Your Password'
                            {...register("password", 
                            {
                                required: "Password is required",
                                minLength: { value: 6, message: 'Password must be 6 characters or longer' }
                            })}
                            className="input input-bordered w-full max-w-xs" />
                        
                        {errors.password?.type === "required" && <p className='text-red-600'>{errors.password?.message}</p>}
                        {errors.password?.type === "minLength" && <p className='text-red-600'>{errors.password?.message}</p>}
                    </div>
                    <input className='btn btn-accent w-full' value="Sign up" type="submit" />
                    <div>
                        {errorElement}
                        {/* {loginError && <p className='text-red-600'>{loginError}</p>} */}
                    </div>
                </form>
                <p className='text-sm text-center'>Already have an account? <Link className='text-secondary' to="/login">Please Login</Link></p>
                <div className="divider">OR</div>
                <button onClick={() => signInWithGoogle()} className='btn btn-outline w-full mb-5'><img className='w-[20px] mr-2' src={google} alt='' />CONTINUE WITH GOOGLE</button>
                <button onClick={() => signInWithFacebook()} className='btn btn-outline w-full hover:bg-[blue] hover:border-0'><img className='w-[20px] mr-2' src={facebook} alt='' />CONTINUE WITH Facebook</button>
            </div>
            <Toaster />
        </div>
    );
};

export default Signup;