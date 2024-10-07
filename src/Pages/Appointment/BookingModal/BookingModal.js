import { format } from 'date-fns';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import toast, { Toaster } from 'react-hot-toast';
import auth from '../../../firebase.init';
import emailjs from 'emailjs-com';

const BookingModal = ({ treatment, setTreatment, selectedDate, refetch }) => {
    // treatment is just another name of appointmentOptions with name, slots, _id
    const [user] = useAuthState(auth);
    const { _id, name, slots } = treatment;
    const date = format(selectedDate, 'PP');

    // const notify = () => toast(`Your Booking is Successfully Enlisted on ${date} at ${slot}`);
    // const notify1 = (data) => toast(`${data}`);

    const handleBooking = event => {
        event.preventDefault();
        const form = event.target;
        const slot = form.slot.value;
        const username = user.displayName;
        const email = user.email;
        const phone = form.phone.value;
        const location = form.location.value;
        // [3, 4, 5].map((value, i) => console.log(value))
        const booking = {
            appointmentDate: date,
            serviceId: _id,
            service: name,
            username: username,
            slot,
            email,
            phone,
            location
        }

        fetch('http://localhost:7000/bookings', {
            method: "POST",
            headers:{
                "content-type": "application/json"
            },
            body: JSON.stringify(booking)
        })
        .then(res => res.json())
        .then(data => {
            if (data.acknowledged){
                alert(`Your Booking is Successfully Enlisted on ${date} at ${slot}`);
                // notify();
            }
            else {
                alert(`${data.message}`);
                // notify1(data.message);
            }
            
            refetch();
            setTreatment(null);
            sendEmail(booking);
        })

        // TODO: send data to the server
        // and once data is saved then close the modal 
        // and display success toast
    }

    const sendEmail = (booking) => {
        const { username, email, service, appointmentDate, slot } = booking;

        const emailContent = {
            service_name: service,
            to_name: username,
            appointment_date: appointmentDate,
            slot: slot,
            email: email
        };
        
        emailjs.send('service_t9to7au', 'template_23mvl8p', emailContent, 'bUm7ZKGy_QH1fU7EM')
      .then((result) => {
          console.log(result.text);
      }, (error) => {
          console.error(error.text);
      });
    };

    return (
        <div>
            <input type="checkbox" id="booking-modal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box relative">
                    <label htmlFor="booking-modal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                    <h3 className="text-lg font-bold">{name}</h3>
                    <form onSubmit={handleBooking} className='grid grid-cols-1 gap-3 mt-10'>
                        <input type="text" disabled value={date} className="input w-full input-bordered " />
                        <select name="slot" className="select select-bordered w-full">
                            {
                                slots.map((slot, i) => <option
                                    value={slot}
                                    key={i}
                                >{slot}</option>)
                            }
                        </select>
                        <input type="text" disabled value={user.displayName} className="input w-full input-bordered " />
                        <input type="email" disabled value={user.email} className="input w-full input-bordered " />
                        <input name="phone" type="text" placeholder="Phone Number" className="input w-full input-bordered" required/>
                        <input name="location" type="text" placeholder="Your Address" className="input w-full input-bordered" required/>
                        <br />
                        <input className='btn btn-accent w-full' type="submit" value="Submit" />
                    </form>
                </div>
                
            </div>
            <Toaster/>
        </div>
    );
};

export default BookingModal;