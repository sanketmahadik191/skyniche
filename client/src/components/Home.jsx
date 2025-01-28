import axios from 'axios';
import React, { lazy, useEffect, useState, Suspense } from 'react';
import Nav from './Nav';
const Card = lazy(() => import('./Card'));
import { Formik } from 'formik';
import * as Yup from 'yup';
import { IoMdPersonAdd } from "react-icons/io";
import { TiDeleteOutline } from "react-icons/ti";
import { InfinitySpin } from 'react-loader-spinner';

const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    department: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
    designation: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
    salary: Yup.number().required('Required').positive('Must be positive').integer('Must be an integer'),
});

const initialValuesRegister = {
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    designation: '',
    salary: '',
    doj: '',
    picture: null
};

const updateValidationSchema = Yup.object().shape({
    firstName: Yup.string(),
    lastName: Yup.string(),
    email: Yup.string().required('Email is required for Identification'),
    salary: Yup.number(),
    department: Yup.string(),
    designation: Yup.string(),
    doj: Yup.date(),
});

const Home = () => {
    const [data, setData] = useState(null);
    const [modal, openModal] = useState(false);
    const [isRegister, setIsRegister] = useState(true);
    const [currUser, setCurrUser] = useState(null);

    const getAllUsers = async () => {
        try {
            axios.get('http://localhost:3000/api/user/getusers')
                .then((response) => setData(response.data.data))
                .catch((error) => console.log("Error", error));
        } catch (error) {
            console.log("Something went wrong at getting all users", error);
        }
    };

    const registerUser = async (values) => {
        const formData = new FormData();
        for (let val in values) {
            formData.append(val, values[val]);
        }
        try {
            axios.post('http://localhost:3000/api/user/adduser', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            }).then(() => getAllUsers())
              .catch((error) => console.log("Error", error));
        } catch (error) {
            console.log("Something went wrong while registering user");
        }
    };

    const updateUser = async (values) => {
        const formData = new FormData();
        for (let val in values) {
            formData.append(val, values[val]);
        }
        try {
            axios.patch('http://localhost:3000/api/user/updateuser', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            }).then(() => getAllUsers())
              .catch((error) => console.log("Error", error));
        } catch (error) {
            console.log("Something went wrong while updating user");
        }
    };

    const handleModal = (register, user = null) => {
        setIsRegister(register);
        setCurrUser(user);
        openModal(true);
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    return (
        <>
            <Nav handleData={setData} />
            <div className="flex flex-col min-h-fit h-full gap-4 mt-6 relative">
                <div className="flex justify-between p-4">
                    <h1 className="font-bold text-3xl text-gray-700">Employee Dashboard</h1>
                    <button onClick={() => handleModal(true)} className="rounded-full px-4 py-2 bg-blue-600 text-white hover:bg-blue-500 transition">
                        <IoMdPersonAdd size={20} />
                    </button>
                </div>
                <div className={`fixed inset-0 bg-black bg-opacity-50 z-10 flex items-center justify-center ${modal ? "flex" : "hidden"}`}>
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <div className="flex justify-between">
                            <h2 className="text-xl font-semibold">{isRegister ? "Register User" : "Update User"}</h2>
                            <button onClick={() => openModal(false)} className="text-gray-600 hover:text-red-500 transition">
                                <TiDeleteOutline size={24} />
                            </button>
                        </div>
                        <Formik
                            initialValues={isRegister ? initialValuesRegister : {
                                firstName: currUser?.firstName || '',
                                lastName: currUser?.lastName || '',
                                email: currUser?.email || '',
                                department: currUser?.department || '',
                                designation: currUser?.designation || '',
                                salary: currUser?.salary || '',
                                doj: currUser?.doj || '',
                                picture: null,
                            }}
                            validationSchema={isRegister ? RegisterSchema : updateValidationSchema}
                            onSubmit={async (values, actions) => {
                                isRegister ? await registerUser(values) : await updateUser(values);
                                actions.resetForm();
                                openModal(false);
                            }}
                        >
                            {({ handleSubmit, handleBlur, handleChange, values, touched, errors, setFieldValue }) => (
                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    {['firstName', 'lastName', 'email', 'department', 'designation', 'salary'].map((field) => (
                                        <div key={field}>
                                            <label className="block text-sm font-medium text-gray-700 capitalize" htmlFor={field}>{field}:</label>
                                            <input
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values[field]}
                                                className={`w-full px-3 py-2 border rounded-md shadow-sm ${touched[field] && errors[field] ? 'border-red-500' : 'border-gray-300'}`}
                                                type={field === 'salary' ? 'number' : field === 'email' ? 'email' : 'text'}
                                                name={field}
                                                id={field}
                                            />
                                            {touched[field] && errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
                                        </div>
                                    ))}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700" htmlFor="doj">Date of Joining:</label>
                                        <input
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.doj}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                            type="date"
                                            name="doj"
                                            id="doj"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700" htmlFor="profile">Profile Photo:</label>
                                        <input
                                            onChange={(e) => setFieldValue('picture', e.currentTarget.files[0])}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                            type="file"
                                            name="picture"
                                            id="profile"
                                        />
                                    </div>
                                    <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-500 transition">
                                        {isRegister ? "Register" : "Update"}
                                    </button>
                                </form>
                            )}
                        </Formik>
                    </div>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start w-full p-4 gap-4">
                    {!data ? (
                        <div className="flex justify-center items-center w-full h-96">
                            <InfinitySpin visible={true} width="200" color="#4fa94d" ariaLabel="loading" />
                        </div>
                    ) : (
                        data.map((e, idx) => (
                            <Suspense key={idx} fallback={<div className="text-center font-bold text-xl">Loading...</div>}>
                                <Card
                                    firstName={e.firstName}
                                    lastName={e.lastName}
                                    salary={e.salary}
                                    desig={e.designation}
                                    dept={e.department}
                                    email={e.email}
                                    profile={e.profile}
                                    modal={() => handleModal(false, e)}
                                    reload={getAllUsers}
                                />
                            </Suspense>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default Home;
