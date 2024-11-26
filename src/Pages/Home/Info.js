import React from "react";
import InfoCard from "./InfoCard";
import clock from "../../assets/icons/clock.svg";
import marker from "../../assets/icons/marker.svg";
import phone from "../../assets/icons/phone.svg";
import "../Shared/gradient.css";

const Info = () => {
  return (
    <div>
      <div className='flex items-center justify-center mb-10'>
                <h2 className='text-lg font-bold text-[#294629] text-center bg-[#99b999] border-[#497c49bb] border-8 rounded-3xl shadow-xl p-2 hover:cursor-pointer'>
                    Pick the area of your body experiencing discomfort.
                </h2>
            </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <InfoCard
        cardTitle="Opening Hours"
        bgClass="gradient_background"
        img={clock}
        description="7 Days a Week, 24 Hours"
      ></InfoCard>
      <InfoCard
        cardTitle="Our Locations"
        bgClass="gradient_neutral"
        img={marker}
        description="We serve all over Globe."
      ></InfoCard>
      <InfoCard
        cardTitle="Contact Us"
        bgClass="gradient_background"
        img={phone}
        description="+1 (628)-946-6188 (quickmed@gmail.com)"
      ></InfoCard>
      </div>
    </div>
  );
};

export default Info;