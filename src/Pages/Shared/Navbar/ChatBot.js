import React from "react";
import { TERipple } from "tw-elements-react";
import Chatbot from "../../../assets/icons/logos/ai_chatbot_3.png"

const ChatBot= () => {

  return (
    <>
      {/* <!-- Back to top button --> */}
      
        <TERipple rippleColor="light">
          <a
            type="button"
            href="#"
            target="_blank"
            className={`fixed bottom-[40px] right-[40px] p-2 bg-[#dbeeeb] text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-[#8cccc2] hover:shadow-lg focus:bg-cyan-050 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-cyan-700 active:shadow-lg transition duration-150 ease-in-out`}
          >
           <img className="w-[70px]" src={Chatbot}></img> 
          </a>
        </TERipple>
      
    </>
  );
}

export default ChatBot;