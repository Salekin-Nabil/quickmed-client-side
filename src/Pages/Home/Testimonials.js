// import React from 'react';
// import quote from '../../assets/icons/quote.svg';
// import people1 from '../../assets/images/people1.png'
// import people2 from '../../assets/images/people2.png'
// import people3 from '../../assets/images/people3.png'
// import Review from './Review';
// const Testimonials = () => {
//     const reviews = [
//         {
//             _id:1,
//             name: 'Winson Herry',
//             review: '🌟🌟🌟🌟🌟 "I can’t recommend QuickMed enough! I found them to be extremely professional, punctual, and skilled in a range of repairs and installations. They transformed my outdated kitchen into a modern marvel, with new tiles and perfectly installed appliances. The team was friendly, knowledgeable, and meticulous in their work. Their rates were very reasonable, and the quality of their work surpassed all my expectations. My home has never looked better!"',
//             location: 'california',
//             img: people1
//         },
//         {
//             _id:2,
//             name: 'Winson Herry',
//             review: '🌟🌟🌟🌟🌟 "Outstanding service from QuickMed! They were a beacon of light when our home needed various repairs. They efficiently fixed a leaking faucet, installed a new light fixture, and even repaired some damaged drywall, all in one visit! Their attention to detail, swift service, and reasonable pricing have made me a loyal customer. It’s a huge relief knowing there’s a trustworthy and skilled QuickMed I can call whenever I need help around the house!"',
//             location: 'california',
//             img: people2
//         },
//         {
//             _id:3,
//             name: 'Winson Herry',
//             review: '🌟🌟🌟🌟🌟 "QuickMed was a game-changer for our home improvement needs. We hired them for multiple tasks, including painting, plumbing repairs, and furniture assembly. Every task was completed with precision, and their professionalism was unparalleled. The level of craftsmanship and dedication was truly impressive, making QuickMed our go-to choice for all future home maintenance and repair needs!"',
//             location: 'california',
//             img: people3
//         },
//     ];
//     return (
//         <section className='my-28'>
//             <div className='flex justify-between'>
//                 <div>
//                     <h4 className="text-xl text-transparent bg-clip-text bg-gradient-to-br from-accent to-secondary font-bold">Testimonials</h4>
//                     <h2 className='text-3xl'>What our Clients say</h2>
//                 </div>
//                 <div>
//                     <img src={quote} className="w-24 lg:w-48" alt="" />
//                 </div>
//             </div>
//             <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
//                 {
//                     reviews.map(review =><Review
//                         key={review._id}
//                         review={review}
//                     ></Review>)
//                 }
//             </div>
//         </section>
//     );
// };

// export default Testimonials;
import React, { useEffect, useState } from 'react';
import quote from '../../assets/icons/quote.svg';
import Review from './Review';

const Testimonials = () => {
    const [reviews,setReviews] = useState({});

    useEffect(()=>{
        fetch("http://localhost:7000/reviews_3")
        .then(res=>res.json())
        .then(data=>setReviews(data));
    }, []);

    const data = Array.from(reviews);
    
    return (
        <section className='my-28'>
             <div className='flex justify-between'>
                 <div>
                     <h4 className="text-xl text-transparent bg-clip-text bg-gradient-to-br from-accent to-secondary font-bold">Testimonials</h4>
                     <h2 className='text-3xl'>What our Clients say</h2>
                 </div>
                 <div>
                     <img src={quote} className="w-24 lg:w-48" alt="" />
                 </div>
             </div>
             <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
             {
                    data.map(review => <Review key={review._id} review={review}></Review>)
                }
            </div>
        </section>
    );
};

export default Testimonials;