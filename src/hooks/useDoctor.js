import { useEffect, useState } from "react"

const useDoctor = user => {
    const [isDoctor, setIsDoctor] = useState(false);
    const [isDoctorLoading, setIsDoctorLoading] = useState(true);
    useEffect(() => {
        const email = user?.email;
        if (email) {
            fetch(`http://localhost:3000/users/doctor/${email}`, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    setIsDoctor(data.isDoctor);
                    setIsDoctorLoading(false);
                })
        }
    }, [user]);
    return [isDoctor, isDoctorLoading]
}

export default useDoctor;