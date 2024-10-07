import React from "react";
import appointment from '../../assets/images/appointment.jpeg';
import PrimaryButton from "../Shared/PrimaryButton";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../firebase.init";
import emailjs from 'emailjs-com';
import toast, { Toaster } from "react-hot-toast";

const Contact = () => {
  const [user] = useAuthState(auth);

  const sendEmail = event => {
    event.preventDefault();
    const form = event.target;
        const subject = form.subject.value;
        const from_name = user.displayName || form.name.value;
        const from_email = user.email || form.email.value;
        const message = form.message.value;

    console.log(subject, from_name, from_email, message);

    const emailContent = {
        subject: subject,
        message: message,
        from_name: from_name,
        from_email: from_email
    };
    
    emailjs.send('service_t9to7au', 'template_syioszx', emailContent, 'bUm7ZKGy_QH1fU7EM')
  .then((result) => {
      toast.success("Email has been sent!");
      console.log(result.text);
  }, (error) => {
      console.error(error.text);
  });
};
  return (
    <div style={{
        background:`url(${appointment})`
    }} className='bg-primary px-10 py-14 '>
      <div className='text-center pb-14 text-white'>
        <p className='text-xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-accent to-secondary'>
          Contact Us
        </p>
        <h1 className='text-4xl'>Inquery for Pre-estimated Schedule</h1>
      </div>
      <div>
      <form onSubmit={sendEmail} className='grid grid-cols-1 justify-items-center gap-5'>
        {user ? <input
          name="email"
          type='text'
          disabled
          value={user.email}
          className='input w-full max-w-md'
        /> 

        : <input
        name="email"
        type='text'
        placeholder='Email Address'
        className='input w-full max-w-md'
        required
        />}
        
        {user ? <input
          name="name"
          type='text'
          disabled
          value={user.displayName}
          className='input w-full max-w-md'
        />
          : <input
          name="name"
          type='text'
          placeholder='Your Name'
          className='input w-full max-w-md'
          required
        />}

        <input
          name="subject"
          type='text'
          placeholder='Subject'
          className='input w-full max-w-md'
          required
        />
        <textarea
          name="message"
          className='textarea w-full max-w-md'
          placeholder='Your message'
          required
          rows={6}
        ></textarea>
        <PrimaryButton type="submit">Submit</PrimaryButton>
        </form>
      </div>
      <Toaster/>
    </div>
  );
};

export default Contact;