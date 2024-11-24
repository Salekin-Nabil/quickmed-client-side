import React from 'react';
import { BodyComponent } from '../../components/BodyComponent/BodyComponent';

const Banner = () => {
    const handlePartClick = (id) => {
        console.log(`part with id pressed ${id}`);
    };
    return (
        <div className='mb-12 flex flex-col'>
            <BodyComponent
                onClick={handlePartClick}
                partsInput={{
                    head: { show: true },
                    leftShoulder: { show: true },
                    rightShoulder: { show: true },
                    leftArm: { show: true },
                    rightArm: { show: true },
                    chest: { show: true },
                    stomach: { show: true },
                    leftLeg: { show: true },
                    rightLeg: { show: true },
                    leftHand: { show: true },
                    rightHand: { show: true },
                    leftFoot: { show: true },
                    rightFoot: { show: true },
                }}
                mode={"default"}
            />
            <div className='flex items-center justify-center'>
                <h2 className='text-lg font-semibold text-gray-800 text-center'>
                    Pick the area of your body experiencing discomfort.
                </h2>
            </div>
        </div>
    );
};

export default Banner;