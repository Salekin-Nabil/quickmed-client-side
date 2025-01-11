import React, { useState } from 'react';
import { BodyComponent } from '../../components/BodyComponent/BodyComponent';
import axios from "axios";
import ReactMarkdown from "react-markdown";
import auth from "../../firebase.init";
import { useAuthState } from "react-firebase-hooks/auth";

const Banner = () => {
    const [selectedParts, setSelectedParts] = useState([]);
    const [user] = useAuthState(auth);

    const sendMessageToBackend = async (message) => {
        try {
          const response = await axios.post("https://quick-med.onrender.com/message", {
            message: message,
            user_id: user.uid,
          });
          return response.data.message;
        } catch (error) {
          return "Failed to get response";
        }
      };

    // Mapping for body parts with medical terms and accurate positions
    const partToDetailsMapping = {
        head: {
            terms: ['Neurology', 'Psychiatry'],
            bodyPosition: { x: '51%', y: '2%' }, // Position on the anatomy
            boxPosition: { x: '60%', y: '0%' }, // Position for the box
        },
        left_shoulder: {
            terms: ['Orthopedics'],
            bodyPosition: { x: '46.7%', y: '19%' },
            boxPosition: { x: '0%', y: '-10%' },
        },
        right_shoulder: {
            terms: ['Orthopedics'],
            bodyPosition: { x: '53.5%', y: '20%' },
            boxPosition: { x: '65%', y: '11%' },
        },
        left_arm: {
            terms: ['Orthopedics'],
            bodyPosition: { x: '45.6%', y: '40%' },
            boxPosition: { x: '23%', y: '10%' },
        },
        right_arm: {
            terms: ['Orthopedics'],
            bodyPosition: { x: '54.5%', y: '40%' },
            boxPosition: { x: '70%', y: '21%' },
        },
        left_hand: {
            terms: ['Dermatology'],
            bodyPosition: { x: '44.4%', y: '50%' },
            boxPosition: { x: '18%', y: '24%' },
        },
        right_hand: {
            terms: ['Dermatology'],
            bodyPosition: { x: '55.6%', y: '50%' },
            boxPosition: { x: '75%', y: '28%' },
        },
        chest: {
            terms: ['Cardiology'],
            bodyPosition: { x: '47.7%', y: '25%' },
            boxPosition: { x: '5%', y: '0%' },
        },
        stomach: {
            terms: ['Gastroenterology'],
            bodyPosition: { x: '50%', y: '42%' },
            boxPosition: { x: '23%', y: '9.3%' },
        },
        left_leg_upper: {
            terms: ['Orthopedics'],
            bodyPosition: { x: '47.8%', y: '60%' },
            boxPosition: { x: '23%', y: '41%' },
        },
        right_leg_upper: {
            terms: ['Orthopedics'],
            bodyPosition: { x: '52.3%', y: '60%' },
            boxPosition: { x: '70%', y: '48%' },
        },
        left_leg_lower: {
            terms: ['Rheumatology'],
            bodyPosition: { x: '48.2%', y: '72%' },
            boxPosition: { x: '27%', y: '55%' },
        },
        right_leg_lower: {
            terms: ['Rheumatology'],
            bodyPosition: { x: '51.9%', y: '72%' },
            boxPosition: { x: '65%', y: '55%' },
        },
        left_foot: {
            terms: ['Orthopedics'],
            bodyPosition: { x: '48.8%', y: '96%' },
            boxPosition: { x: '32%', y: '53%' },
        },
        right_foot: {
            terms: ['Orthopedics'],
            bodyPosition: { x: '51.3%', y: '96%' },
            boxPosition: { x: '60%', y: '53%' },
        },
    };

    const handlePartClick = async (id) => {
        if (!partToDetailsMapping[id]) return;

        const isAlreadySelected = selectedParts.some((part) => part.id === id);

        if (isAlreadySelected) {
            // Remove the part if it's already selected
            setSelectedParts((prev) => prev.filter((part) => part.id !== id));
        } else {
            // Add the clicked part
            const botResponse = await sendMessageToBackend(
                `I am having discomfort in my ${id}. What should I do? Do you have any suggestion for initial recovery for now that I can do while staying at home? You can also suggest me some medicines, please.`
            );
    
            setSelectedParts((prev) => [
                ...prev,
                { id, ...partToDetailsMapping[id], botResponse }, // Include botResponse
            ]);
        }
    };

    return (
        <div className="relative w-full h-full my-10">
            {/* Body Component */}
            <BodyComponent
                onClick={handlePartClick}
                partsInput={{
                    head: { show: true },
                    leftShoulder: { show: true },
                    rightShoulder: { show: true },
                    chest: { show: true },
                    stomach: { show: true },
                    leftLeg: { show: true },
                    rightLeg: { show: true },
                    leftFoot: { show: true },
                    rightFoot: { show: true },
                }}
                mode="default"
            />
            {/* Render Boxes and Lines */}
            {selectedParts.map((part, index) => (
                <div key={part.id}>
                    {/* Line Connecting Body Part to Box */}
                    <svg
                        className="absolute pointer-events-none"
                        style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                        }}
                    >
                        <line
                            x1={part.bodyPosition.x}
                            y1={part.bodyPosition.y}
                            x2={part.boxPosition.x}
                            y2={`calc(${part.boxPosition.y} + ${index * 5}px)`} // Space between boxes
                            stroke="black"
                            strokeWidth="2"
                        />
                    </svg>
                    {/* Annotation Box */}
                    <div
                        className="absolute bg-[#99b999] border-[#497c49] border-8 rounded-md shadow-md p-2 text-md font-bold text-[#294629] hover:cursor-pointer"
                        style={{
                            position: 'absolute',
                            width: '20%',
                            top: `calc(${part.boxPosition.y} + ${index * 5}px)`, // Adjust for stacked boxes
                            left: part.boxPosition.x,
                        }}
                    >
                        {part.terms.map((term, i) => (
                <div key={i}>{term}</div>
            ))}
            <div className="mt-2 text-sm font-normal text-[#294629]">
            <ReactMarkdown>{part.botResponse}</ReactMarkdown> {/* Render botResponse */}
            </div>
                    </div>
                </div>
                
            ))}
        </div>
    );
};

export default Banner;
