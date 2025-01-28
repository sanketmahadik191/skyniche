import axios from 'axios';
import React from 'react';
import { CiEdit } from "react-icons/ci";
import { AiTwotoneDelete } from "react-icons/ai";

const Card = ({ reload, modal, firstName, lastName, salary, desig, dept, email, profile }) => {

    const delUser = async (email) => {
        try {
            axios.delete('https://skyniche-server.onrender.com/api/user/deleteuser', {
                data: { email: email }
            })
                .then((response) => {
                    console.log(response);
                    reload();
                })
                .catch((err) => {
                    console.log(err);
                });
        } catch (error) {
            console.log("Something went wrong at removing user", error);
        }
    };

    return (
        <div className='bg-white p-4 flex flex-col w-full sm:w-60 flex-shrink-0 rounded-2xl shadow-lg border border-gray-200'>
            <div className='flex justify-end'>
                <button onClick={() => { delUser(email); }} className='bg-red-500 text-white rounded-md p-2 font-semibold hover:bg-red-600'>
                    <AiTwotoneDelete size={18} />
                </button>
            </div>

            <div className='flex flex-col items-center mt-4'>
                <div className='flex justify-center items-center rounded-full h-32 w-32 bg-gray-200 overflow-hidden'>
                    {
                        profile ? <img className='w-full h-full object-cover' src={profile} alt={`${firstName} ${lastName}`} /> :
                            <span className='font-bold text-xl'>{`${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`}</span>
                    }
                </div>

                <h1 className='font-bold text-lg mt-4'>{`${firstName} ${lastName}`}</h1>
                <h3 className='text-sm text-gray-500'>{email}</h3>

                <div className='flex justify-around w-full mt-3'>
                    <button onClick={modal} className='bg-blue-500 text-white px-3 py-2 text-sm rounded-md hover:bg-blue-600'>
                        <CiEdit size={18} />
                    </button>
                </div>

                <div className='w-full text-start px-4 mt-4'>
                    <p><b>CTC:</b> ${salary}</p>
                    <p><b>Designation:</b> {desig}</p>
                    <p><b>Department:</b> {dept}</p>
                </div>
            </div>
        </div>
    );
};

export default Card;