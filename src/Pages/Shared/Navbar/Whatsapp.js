import React from "react";
import { TERipple } from "tw-elements-react";
import Chatbot from "../../../assets/icons/logos/chatbot.png"

const Whatsapp= () => {

  return (
    <>
      {/* <!-- Back to top button --> */}
      
        <TERipple rippleColor="light">
          <a
            type="button"
            href="http://wa.me/+14086670501"
            target="_blank"
            className={`fixed bottom-[40px] right-[40px] p-2 bg-cyan-200 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-cyan-400 hover:shadow-lg focus:bg-cyan-050 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-cyan-700 active:shadow-lg transition duration-150 ease-in-out`}
          >
           <img className="w-[30px]" src={Chatbot}></img> 
          </a>
        </TERipple>
      
    </>
  );
}

export default Whatsapp;