import { getAuth, updateProfile } from 'firebase/auth'
import { collection, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '../firebase';
import { FcHome } from "react-icons/fc";
import ListingItems from '../Components/ListingItems';

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetail, setChangeDetail] = useState(false);
  const [loading, setLoading] = useState(true)
  const [listing, setListing] = useState(null);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })
  const { name, email } = formData;
  console.log(listing)

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
  useEffect(() => {
    const fetchUserListings = async () => {
      const listingRef = collection(db, "listings");
      const q = query(listingRef, where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      )
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data()
        });
      });
      setListing(listings)
      setLoading(false)
    }
    fetchUserListings()
  }, [auth.currentUser.uid])

  const handleDelete = () => {

  };

  const handleEdit = () => {

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
          <button
            className=' w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800'
            type='submit'
          >
            <Link to='/create-listing'
              className=' flex justify-center items-center '
            >
              <FcHome className="mr-2 text-3xl bg-red-200 rounded-full p-1 border-2" />
              Sell or rent your home
            </Link>
          </button>
        </div>
      </section>
      <div className=' max-w-6xl px-3 mt-6 mx-auto'>
        {
          !loading && listing.length > 0 && (
            <>
              <h2 className=' text-2xl text-center font-semibold mb-6'>
                My Listings
              </h2>
              <ul className=' sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
                {
                  listing.map((item) => (
                    <ListingItems
                      key={item.id}
                      id={item.id}
                      listing={item.data}
                      onDelete={() => handleDelete(item.id)}
                      onEdit={() => handleEdit(item.id)}
                    />
                  ))
                }
              </ul>
            </>
          )
        }
      </div>
    </>
  )
}
