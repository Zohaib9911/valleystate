import { getAuth, updateProfile } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '../firebase';

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetail, setChangeDetail] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })
  const { name, email } = formData;

  const handleLogOut = () => {
    auth.signOut();
    navigate('/');
  }

  const handleChahge = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  };

  const hanldeSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // Update Display name in firebase 
        await updateProfile(auth.currentUser, {
          displayName: name
        });
        // Update name in FireStore

        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, { name });
      }
      toast.success("UserName Updated Successfully")
    } catch (error) {
      toast.error("Error While updating")
    }
  }

  return (
    <>
      <section className=' max-w-6xl mx-auto flex flex-col justify-center items-center'>
        <h1 className=' text-3xl text-center mt-6 font-bold'>My Profile</h1>
        <div className=' w-full md:w-[50%] mt-6 px-3'>
          <form >
            {/* Name Input */}
            <input type="text"
              id='name'
              value={name}
              disabled={!changeDetail}
              onChange={handleChahge}
              className={` mb-6 w-full px-4 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${changeDetail && " bg-rose-200 focus:bg-red-200"}`}
            />
            {/* Email */}
            <input type="email"
              id='email'
              value={email}
              disabled
              className=' mb-6 w-full px-4 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out'
            />
            <div className=' flex justify-between whitespace-nowrap text-sm sm:text-xl mb-6'>
              <p className=' flex items-center'>
                Do you want to change your name
                <span
                  onClick={() => {
                    changeDetail && hanldeSubmit();
                    setChangeDetail((prev) => !prev)
                  }}
                  className=' text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer'>{
                    changeDetail ? "Apply Chnage" : "Edit"
                  }</span>
              </p>
              <p onClick={handleLogOut} className=' text-blue-600 hover:text-blue-700 transition ease-in-out duration-200 cursor-pointer'>
                Sign Out
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
