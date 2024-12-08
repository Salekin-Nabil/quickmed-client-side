import React, { useEffect, useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Loading from '../../Loading/Loading';
import toast, { Toaster } from 'react-hot-toast';

const CheckoutForm = ({ booking }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [cardError, setCardError] = useState('');
    const [success, setSuccess] = useState('');
    const [processing, setProcessing] = useState(false);
    const [transactionId, setTransactionId] = useState('');
    const [clientSecret, setClientSecret] = useState('');

    const { _id, username, email } = booking;
    const bill = 50;

    useEffect(() => {
        fetch('https://quickmed-server-side.onrender.com/create-payment-intent', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({ bill })
        })
            .then(res => res.json())
            .then(data => {
                if (data?.clientSecret) {
                    setClientSecret(data.clientSecret);
                }
            });

    }, [bill]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const card = elements.getElement(CardElement);

        if (card === null) {
            return;
        }

        const { error } = await stripe.createPaymentMethod({
            type: 'card',
            card
        });

        setCardError(error?.message || '')
        setSuccess('');
        setProcessing(true);

        // confirm card payment
        const { paymentIntent, error: intentError } = await stripe.confirmCardPayment(
            clientSecret,
            {
                payment_method: {
                    card: card,
                    billing_details: {
                        name: username,
                        email: email
                    },
                },
            },
        );

        if (intentError) {
            setCardError(intentError?.message);
            setProcessing(false);
        }
        else {
            setCardError('');
            setTransactionId(paymentIntent.id);
            console.log(paymentIntent);
            setSuccess('Your payment has been successfully completed.')
            
            //store payment on database
            const payment = {
                order: _id,
                transactionId: paymentIntent.id
            }
            fetch(`https://quickmed-server-side.onrender.com/bookings/${_id}`, {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json',
                    'authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify(payment)
            }).then(res=>res.json())
            .then(data => {
                setProcessing(false);
                toast.success("Your transaction has been completed.");
            })

        }
    };

    if(processing)
    {
        <Loading></Loading>
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
                <button className='px-5 font-bold py-2 shadow-xl shadow-[gray] hover:shadow-lg hover:shadow-[gray]  bg-gradient-to-br from-accent to-secondary hover:bg-[#a0760b] rounded-xl text-white mt-8' type="submit" disabled={!stripe || !clientSecret || success}>
                    Pay
                </button>
            </form>
            {
                cardError && <p className='text-red-500'>{cardError}</p>
            }
            {
                success && <div className='text-transparent bg-clip-text bg-gradient-to-br from-accent to-secondary font-bold mt-4'>
                    <p>{success}</p>
                    <p>Your transaction Id: <span className="text-orange-700 text-transparent bg-clip-text bg-gradient-to-br from-accent to-secondary font-bold">{transactionId}</span> </p>
                </div>
            }
            <Toaster/>
        </>
    );
};

export default CheckoutForm;