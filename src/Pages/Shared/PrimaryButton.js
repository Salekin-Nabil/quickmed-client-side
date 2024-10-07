import React from 'react';
import "./gradient.css"

const PrimaryButton = ({children}) => {
    return (
        <button className="btn btn-primary border-0 shadow-lg shadow-[#013017] uppercase text-white font-bold gradient_background text-3xl px-7 mb-3">{children}</button>
    );
};

export default PrimaryButton;