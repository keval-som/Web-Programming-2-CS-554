import React from 'react';
import { Link } from 'react-router-dom';

function Home() {

return (
    <>
        <h1>Welcome to the SpaceX Info Hub</h1>
        <p>
            This site is dedicated to providing information about SpaceX, its missions, and its groundbreaking achievements in space exploration. 
            We utilize the SpaceX API to fetch and display real-time data about launches, rockets, and more.
        </p>
        <div>
            <Link to="/history">
                <button className='btn-primary'>
                    Go to History Page
                </button>
            </Link>
            <Link to="/company">
                <button className='btn-primary'>
                    Go to Company Page
                </button>
            </Link>
        </div>
        <div>
            <Link to="/launches/page/1">
                <button className='btn-primary'>
                    Go to Launches Listing
                </button>
            </Link>
            <Link to="/payloads/page/1">
                <button className='btn-primary'>
                    Go to Payloads Listing
                </button>
            </Link>
            <Link to="/cores/page/1">
                <button className='btn-primary'>
                    Go to Cores Listing
                </button>
            </Link>
            <Link to="/rockets/page/1">
                <button className='btn-primary'>
                    Go to Rockets Listing
                </button>
            </Link>
            <Link to="/ships/page/1">
                <button className='btn-primary'>
                    Go to Ships Listing
                </button>
            </Link>
            <Link to="/launchpads/page/1">
                <button className='btn-primary'>
                    Go to Launch Pads Listing
                </button>
            </Link>
        </div>
    </>
);
}

export default Home;