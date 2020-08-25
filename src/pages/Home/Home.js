import React from 'react';
import useAuth from '../../hooks/useAuth';

const Home = () => {
    const auth = useAuth();
    console.log(auth);
    return (
        <div>
            <h2>Home</h2>
        </div>
    );
};

export default Home;