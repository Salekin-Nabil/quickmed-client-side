import React from 'react';
import appointment from '../../../assets/images/services_image/appointment.jpg';
import { DayPicker } from 'react-day-picker';

const css = `
  .my-selected:not([disabled]) { 
    color: white;
    border-radius: 50%;
    background: linear-gradient(360deg, #f1f5f3, #013017 );
    background-repeat: no-repeat;
    
  }
  .my-today { 
    font-weight: 800;
    color: rgb(11, 141, 78);
  }
`;

const AppointmentBanner = ({selectedDate, setSelectedDate}) => {
    
    return (
        <header className='my-6'>
            <div className="hero">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <img src={appointment} alt="Schedule" className="lg:max-w-xl rounded-lg shadow-2xl" />
                    <div className='lg:mr-6'>
                    <style>{css}</style>
                        <DayPicker 
                            mode='single'
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            styles={{
                                head_cell: {
                                  width: "70px",
                                  height: "120px"
                                },
                                table: {
                                  maxWidth: "none",
                                },
                                day: {
                                  margin: "auto",
                                }
                              }}
                              modifiersClassNames={{
                                selected: 'my-selected',
                                today: 'my-today'
                              }}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AppointmentBanner;