import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import axios from "axios";
import { TERipple } from "tw-elements-react";
import Chatbot from "../../../assets/icons/logos/ai_chatbot_3.png";
import ReactMarkdown from "react-markdown";
import auth from "../../../firebase.init";
import { useAuthState } from "react-firebase-hooks/auth";

const ChatBot = () => {
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [user] = useAuthState(auth);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || isSending) return;

    setIsSending(true);
    const botResponse = await sendMessageToBackend(message);

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: message, sender: "user" },
      { text: botResponse, sender: "bot" },
    ]);
    setMessage("");
    setIsSending(false);
  };

  const sendMessageToBackend = async (message) => {
    try {
      const response = await axios.post("https://quick-med.fly.dev/message", {
        message: message,
        user_id: user.uid,
      });
      return response.data.message;
    } catch (error) {
      return "Failed to get response";
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <div
        className={`${
          showChat ? "block" : "hidden"
        } fixed z-50 bottom-[140px] right-[40px] w-96 p-3 rounded-lg bg-white flex flex-col h-96 border border-black`}
      >
        <div className="flex-grow flex flex-col space-y-2 overflow-y-auto mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-md ${
                msg.sender === "user"
                  ? "bg-[#81c481f1] text-white text-right"
                  : "bg-gray-200 text-black text-left"
              }`}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex flex-row space-x-4">
          <input
            className="p-2 border border-gray-300 rounded-md focus:outline-none flex-grow"
            type="text"
            placeholder="Write your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="text-black rounded-lg p-2 focus:outline-none border border-[#5aa15af1] hover:bg-[#3c693cf1] disabled:opacity-50"
            onClick={handleSendMessage}
            disabled={isSending}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#81c481f1"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#3c693cf1"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </div>
      <TERipple rippleColor="light">
        <button
          className="fixed bottom-[40px] right-[40px] p-2 bg-[#cbe2c7] text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-[#71a869] hover:shadow-lg focus:bg-cyan-050 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-[#5b884d] active:shadow-lg transition duration-150 ease-in-out"
          onClick={() => setShowChat(!showChat)}
        >
          <img className="w-[70px]" src={Chatbot} alt="Chatbot" />
        </button>
      </TERipple>
    </>
  );
};

export default ChatBot;