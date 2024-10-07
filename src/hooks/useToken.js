import { useEffect, useState } from "react";

const useToken = (user) => {
    const [token, setToken] = useState('');
    useEffect(() => {
        const email = user[0]?.user?.email;
        const name = user[0]?.user?.displayName || user[1];
        const photo = user[0]?.user?.photoURL || "https://graph.facebook.com/1840598326336872/picture";
        const currentUser = {name: name, email: email, photo: photo};
        if (email) {
            fetch(`http://localhost:7000/user/${email}`,{
                method: 'PUT',
                headers: {
                    'content-type': 'application/json'
                },
                body:JSON.stringify(currentUser)
            })
                .then(res => res.json())
                .then(data => {
                    const accessToken = data.token;
                    localStorage.setItem('accessToken', accessToken);
                    setToken(accessToken);
                });
        }
    }, [user]);
    return [token];
}

export default useToken;