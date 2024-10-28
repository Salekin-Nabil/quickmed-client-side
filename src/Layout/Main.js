import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../Pages/Shared/Footer/Footer";
import Navbar from "../Pages/Shared/Navbar/Navbar";
import ScrollTop from "../Pages/Shared/Navbar/ScrollTop";
import ChatBot from "../Pages/Shared/Navbar/ChatBot";
import { CallProvider } from "../contexts/CallProvider";
import VideoCallWrapper from "./VideoCallWrapper";

const Main = () => {
  return (
    <div>
      <CallProvider>
        <VideoCallWrapper>
          <Navbar></Navbar>
          <Outlet></Outlet>
          <Footer></Footer>
          <div className="flex justify-between">
            <ScrollTop></ScrollTop>
            <ChatBot></ChatBot>
          </div>
        </VideoCallWrapper>
      </CallProvider>
    </div>
  );
};

export default Main;
