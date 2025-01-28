import axios from 'axios';
import React, { useState } from 'react';

const Nav = ({ handleData }) => {

    const [searchQuery, setsearchQuery] = useState("");

    const searchUsers = async () => {
        try {
            axios.post('https://skyniche-server.onrender.com/api/user/search', {
                searchquery: searchQuery
            })
                .then((response) => {
                    handleData(response.data.data);
                    setsearchQuery("");
                })
                .catch((error) => {
                    console.log("Error", error);
                });
        } catch (error) {
            console.log("Something went wrong while searching users", error);
        }
    };

    return (
        <nav className='flex justify-between items-center p-4 bg-gradient-to-r from-gray-700 via-gray-900 to-black text-white'>
            <div className='flex gap-4 items-center'>
                <div className='bg-blue-500 rounded-full w-10 h-10 flex items-center justify-center font-bold text-white'>S</div>
                <p className='font-semibold text-lg'>Dashboard</p>
            </div>

            <div className='flex items-center border border-gray-600 rounded-full bg-gray-800 px-3 py-1'>
                <input 
                    value={searchQuery}
                    onChange={(e) => { setsearchQuery(e.target.value); }}
                    className='w-full bg-transparent text-white outline-none px-2' 
                    placeholder='Search...' 
                    type="text"
                />
                <button 
                    onClick={searchUsers} 
                    className='text-yellow-400 font-semibold hover:text-yellow-500 px-2'>Search
                </button>
            </div>
        </nav>
    );
};

export default Nav;
