import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthContext } from '../contextAPI/AuthContext';
import { account, ID, databases } from '../Appwrite/Config';

function ProfileComplete() {
    const [formData, setFormData] = useState({
        fullName: '',
        profilePicture: '',
        dateOfBirth: '',
        gender: '',
        
    });

    const navigate = useNavigate();
    const { logged,setProfileCompleted,currentUser  } = useAuthContext();
    var email = "";
    if(currentUser !== null){
    email = currentUser.email;
    }
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    
    
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const { fullName, dateOfBirth, gender } = formData;

        if (!fullName || !dateOfBirth || !gender) {
            toast.error('Please fill in all required fields.', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        try {
            const createdOn = new Date().toISOString();
            const user = await account.get();
           ; // Retrieve current user's details
            const profilePicture =formData.profilePicture ||(formData.gender === 'male'
                                                        ? 'https://images.nightcafe.studio/jobs/fbL1FdyjoypfdrWqbpND/fbL1FdyjoypfdrWqbpND--0--ixbsv.jpg?tr=w-1600,c-at_max'
                                                        : 'https://images.nightcafe.studio/jobs/1jGQl3zOyHYaHjADwGzI/1jGQl3zOyHYaHjADwGzI--0--xvcdg.jpg?tr=w-1600,c-at_max');
            // const email=formData.email.toLocaleLowerCase();
            await databases.createDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID, // Database ID
            import.meta.env.VITE_APPWRITE_COLLECTION_USERS_ID, // Collection ID
            user.$id, // Unique document ID
            {
                userId: user.$id,
                fullName,
                email: email,
                profilePicture: profilePicture ,// Optional field
                dateOfBirth,
                gender,
                createdOn,
                online: false,
                lastSeen: createdOn,
            }
            );

            // Update user preferences to indicate profile completion
            await account.updatePrefs({
                profileCompleted: true,
            });
            setProfileCompleted(true);

            toast.success('Profile completed successfully! Redirecting to the Home page...', {
                position: 'top-right',
                autoClose: 3000,
            });

            setTimeout(() => navigate('/'), 3000);
        } catch (error) {
            console.error('Error updating profile:', error.message);
            toast.error(`Failed to update profile: ${error.message}`, {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };

    return (
        <>
            <ToastContainer />
            {logged ? (
                <div className="flex flex-col items-center justify-center w-screen h-screen overflow-auto pt-20 md:pb-20 z-50">
                    <div className="flex items-center justify-center w-full h-full px-4 md:px-0">
                        <div className="flex flex-col items-center justify-center w-full px-4 py-8 text-white font-sans lg:py-0 md:w-2/3 lg:w-1/3 mt-10 mb-10">
                            <div className="w-full border border-slate-700 rounded-2xl backdrop-filter backdrop-blur-3xl shadow-2xl">
                                <div className="p-6 space-y-4 sm:p-8">
                                    <p className="text-2xl font-semibold leading-tight tracking-tight text-center md:text-3xl">
                                        Complete Your Profile
                                    </p>
                                    <form onSubmit={handleFormSubmit} className="space-y-4">
                                        <div>
                                            <label className="block mb-1 text-sm md:text-md font-light">
                                                Full Name
                                            </label>
                                            <input
                                                placeholder="Your full name"
                                                className="bg-white/10 border border-gray-300 text-white text-sm md:text-md rounded-lg block w-full p-2.5 focus:ring-2 focus:ring-blue-300 outline-none disabled"
                                                id="fullName"
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm md:text-md font-light">
                                                Email Address
                                            </label>
                                            <input
                                                placeholder="Your email address"
                                                className="bg-white/10 border border-gray-300 text-white text-sm md:text-md rounded-lg block w-full p-2.5 focus:ring-2 focus:ring-blue-300 outline-none"
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={email}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm md:text-md font-light">
                                                Profile Picture
                                            </label>
                                            <input
                                                placeholder="Upload your profile picture's URL (optional)"
                                                className="bg-white/10 border border-gray-300 text-white text-sm md:text-md rounded-lg block w-full p-2.5 focus:ring-2 focus:ring-blue-300 outline-none"
                                                id="profilePicture"
                                                type="url"
                                                name="profilePicture"
                                                value={formData.profilePicture}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm md:text-md font-light">
                                                Date of Birth
                                            </label>
                                            <input
                                                className="bg-white/10 border border-gray-300 text-white text-sm md:text-md rounded-lg block w-full p-2.5 focus:ring-2 focus:ring-blue-300 outline-none appearance-none"
                                                id="dateOfBirth"
                                                type="date"
                                                name="dateOfBirth"
                                                value={formData.dateOfBirth}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm md:text-md font-light">
                                                Gender
                                            </label>
                                            <select
                                                className="bg-white/10 border border-gray-300 text-white text-sm md:text-md rounded-lg block w-full p-2.5 focus:ring-2 focus:ring-blue-300 outline-none"
                                                id="gender"
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleInputChange}
                                            >
                                                <option value="" disabled>
                                                    Select a gender
                                                </option>
                                                <option value="male" className='text-black'>Male</option>
                                                <option value="female" className='text-black'>Female</option>
                                                <option value="other" className='text-black'>Other</option>
                                            </select>
                                        </div>
                                        <button
                                            className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-900 hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:outline-none focus:ring-blue-800 font-bold rounded-lg text-sm md:text-md px-5 py-2.5 text-center text-white"
                                            type="submit"
                                        >
                                            Save
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                navigate('/Login')
            )}
        </>
    );
}

export default ProfileComplete;
