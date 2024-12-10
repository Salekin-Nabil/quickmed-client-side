import React, { useEffect, useRef, useState } from "react";
import auth from "../../firebase.init";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams, useNavigate } from "react-router-dom";
import Web3 from 'web3';
import paymentEscrowABI from '../Dashboard/SmartContracts/ABI/paymentEscrowABI';
import paymentEscrowAddress from '../Dashboard/SmartContracts/ContractAddress/paymentEscrowAddress';
import toast, { Toaster } from "react-hot-toast";

const VideoCall = () => {
  const [user] = useAuthState(auth);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const { userId, secondUserId, appointmentID } = useParams();
  const navigate = useNavigate();

  const [connectionId, setConnectionId] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  const ws = useRef(null);
  const iceCandidatesQueue = useRef([]);

  const messageContainerRef = useRef(null)

  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const [messages, setMessages] = useState([]);
  const recognitionRef = useRef(null);

  const [web3, setWeb3] = useState(null);
  const [paymentEscrow, setPaymentEscrow] = useState(null);

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      window.ethereum.request({ method: 'eth_requestAccounts' });

      const contractInstance = new web3Instance.eth.Contract(paymentEscrowABI, paymentEscrowAddress);
      setPaymentEscrow(contractInstance);
    } else {
      console.error('MetaMask not detected. Please install MetaMask!');
    }
  }, []);

  useEffect(() => {
    if (user) {
      setConnectionId(user.uid);
    }
  }, [user]);

  useEffect(() => {
    if (userId && secondUserId) {
      const sortedIds = [userId, secondUserId].sort();
      const session = `${sortedIds[0]}x${sortedIds[1]}`;
      setSessionId(session);
    }
  }, [userId, secondUserId]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!connectionId || !sessionId) return;

    ws.current = new WebSocket("wss://quick-med.fly.dev/ws/call");

    ws.current.onopen = () => {
      ws.current.send(
        JSON.stringify({
          type: "init",
          id: connectionId,
          sessionId: sessionId,
          appointmentId: appointmentID 
        })
      );

      setupPeerConnection();
    };

    ws.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "offer":
          await handleOfferMsg(data);
          break;
        case "answer":
          await handleAnswerMsg(data);
          break;
        case "candidate":
          await handleNewICECandidateMsg(data);
          break;
        case "hangup":
          await handleHangupMsg();
          break;
        case "transcription":
          handleTranscriptionMsg(data);
          break;
        default:
          break;
      }
    };

    ws.current.onclose = () => {
      console.log("WebSocket closed");
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      endCall();
    };
  }, [connectionId, sessionId, appointmentID]);

  const setupPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    peerConnection.current = pc;

    const sortedIds = [userId, secondUserId].sort();
    const isInitiator = connectionId === sortedIds[0];

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(async (stream) => {
        localStream.current = stream;
        localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });

        if (isInitiator) {
          try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            ws.current.send(
              JSON.stringify({
                type: "offer",
                sdp: pc.localDescription,
                id: connectionId,
                sessionId: sessionId,
              })
            );
          } catch (err) {
            console.error("Error creating offer:", err);
          }
        }
      })
      .catch((err) => {
        console.error("Error accessing media devices:", err);
        alert("Couldn't get access to microphone or camera.");
      });

    pc.onicecandidate = (event) => {
      if (event.candidate && ws.current) {
        ws.current.send(
          JSON.stringify({
            type: "candidate",
            candidate: event.candidate,
            id: connectionId,
            sessionId: sessionId,
          })
        );
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current.srcObject !== event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log("ICE connection state:", pc.iceConnectionState);
    };

    if (!isInitiator) {
      pc.onnegotiationneeded = async () => {
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          ws.current.send(
            JSON.stringify({
              type: "offer",
              sdp: pc.localDescription,
              id: connectionId,
              sessionId: sessionId,
            })
          );
        } catch (err) {
          console.error("Error during negotiation needed:", err);
        }
      };
    }
  };

  const handleOfferMsg = async (data) => {
    try {
      const desc = new RTCSessionDescription(data.sdp);
      await peerConnection.current.setRemoteDescription(desc);

      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      ws.current.send(
        JSON.stringify({
          type: "answer",
          sdp: peerConnection.current.localDescription,
          id: connectionId,
          sessionId: sessionId,
        })
      );

      while (iceCandidatesQueue.current.length) {
        const candidate = iceCandidatesQueue.current.shift();
        await peerConnection.current.addIceCandidate(candidate);
      }
    } catch (err) {
      console.error("Error handling offer:", err);
    }
  };

  const handleAnswerMsg = async (data) => {
    try {
      const desc = new RTCSessionDescription(data.sdp);
      await peerConnection.current.setRemoteDescription(desc);

      while (iceCandidatesQueue.current.length) {
        const candidate = iceCandidatesQueue.current.shift();
        await peerConnection.current.addIceCandidate(candidate);
      }
    } catch (err) {
      console.error("Error handling answer:", err);
    }
  };

  const handleNewICECandidateMsg = async (data) => {
    try {
      const candidate = new RTCIceCandidate(data.candidate);
      if (peerConnection.current.remoteDescription) {
        await peerConnection.current.addIceCandidate(candidate);
      } else {
        iceCandidatesQueue.current.push(candidate);
      }
    } catch (err) {
      console.error("Error adding received ICE candidate:", err);
    }
  };

  const handleTranscriptionMsg = (data) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "remote", text: data.text },
    ]);
  };

  const handleHangupMsg = async () => {
    endCall();
  };

  const endCall = async () => {
    stopSpeechRecognition();

    fetch(`https://quickmed-server-side.onrender.com/bookings/${appointmentID}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        'authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
    })
    .then((res) => res.json())
    .then((result) => {
      if (!web3 || !paymentEscrow) {
        console.error('Web3 or contract is not initialized');
        navigate("/");
        return;
      }

      web3.eth.getAccounts()
        .then((accounts) => {
          const acc = accounts[0];
          return paymentEscrow.methods.releasePayment(result.transactionId)
            .send({ from: acc });
        })
        .then((transaction) => {
          console.log('Transaction successful:', transaction);
          toast.success("Deposit Released for Withdrawal");
        })
        .catch((err) => {
          console.error('Error during transaction:', err);
        });
    });

    const url = `https://quickmed-server-side.onrender.com/bookings/calls/ended/${appointmentID}`;
    fetch(url, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
    })
    .then((res) => res.json())
    .then((result) => {
      console.log(result);
    });

    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
      localStream.current = null;
    }

    if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
      remoteVideoRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());
      remoteVideoRef.current.srcObject = null;
    }

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    if (ws.current) {
      ws.current.send(
        JSON.stringify({
          type: "hangup",
          id: connectionId,
          sessionId: sessionId,
        })
      );
      ws.current.close();
      ws.current = null;
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    setMessages([]);
    navigate("/");
  };

  const toggleVideo = () => {
    if (localStream.current) {
      const videoTracks = localStream.current.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks[0].enabled = !videoTracks[0].enabled;
        setIsVideoEnabled(videoTracks[0].enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream.current) {
      const audioTracks = localStream.current.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = !audioTracks[0].enabled;
        setIsAudioEnabled(audioTracks[0].enabled);

        if (audioTracks[0].enabled) {
          startSpeechRecognition();
        } else {
          stopSpeechRecognition();
        }
      }
    }
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech Recognition API not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "local", text: finalTranscript },
        ]);

        if (ws.current) {
          ws.current.send(
            JSON.stringify({
              type: "transcription",
              text: finalTranscript,
              id: connectionId,
              sessionId: sessionId,
            })
          );
        }
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition error:", event.error);
      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        stopSpeechRecognition();
      }
    };

    recognition.onend = () => {
      if (isAudioEnabled && recognitionRef.current) {
        recognitionRef.current.start();
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.onerror = null;
      recognitionRef.current.onresult = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  useEffect(() => {
    if (isAudioEnabled) {
      startSpeechRecognition();
    } else {
      stopSpeechRecognition();
    }

    return () => {
      stopSpeechRecognition();
    };
  }, [isAudioEnabled]);

  return (
    <div className="flex flex-row h-[80vh] max-h-[80vh]">
      <div className="relative flex items-center justify-center flex-1 bg-black pt-16 pb-16 md:pb-20 overflow-hidden">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover shadow-lg"
        />

        <div className="absolute bottom-6 right-6 w-32 h-24 md:w-40 md:h-28 lg:w-48 lg:h-32 border-2 border-gray-700 shadow-lg rounded-lg overflow-hidden">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute bottom-6 flex gap-4 justify-center w-full">
          <button
            className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition"
            onClick={toggleVideo}
          >
            <i
              className={`fas ${
                isVideoEnabled ? "fa-video" : "fa-video-slash"
              } text-white`}
            ></i>
          </button>
          <button
            className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition"
            onClick={toggleAudio}
          >
            <i
              className={`fas ${
                isAudioEnabled ? "fa-microphone" : "fa-microphone-slash"
              } text-white`}
            ></i>
          </button>
          <button
            className="p-3 rounded-full bg-red-600 hover:bg-red-500 transition"
            onClick={endCall}
          >
            <i className="fas fa-phone-slash text-white"></i>
          </button>
        </div>
      </div>
      <div
        ref={messageContainerRef}
        className="flex flex-col w-80 bg-gray-900 text-white overflow-y-auto"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className="flex flex-row bg-gray-700 m-2 p-2 rounded"
          >
            <div
              className={`${
                message.sender === "local" ? "bg-blue-500" : "bg-green-500"
              } w-[4px] max-w-[4px] min-w-[4px]`}
            ></div>
            <div className="text-xs px-4 py-1 font-semibold">{message.text}</div>
          </div>
        ))}
      </div>
      <Toaster/>
    </div>
  );
};

export default VideoCall;
