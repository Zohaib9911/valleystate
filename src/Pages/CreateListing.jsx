import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Spinner from '../Components/Spinner';
import { toast } from 'react-toastify';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getAuth } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function CreateListing() {
  const navigate = useNavigate();
  const auth = getAuth()
  const [geoLocationEnable, setGeoLocationEnable] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: false,
    regularPrice: 0,
    discountPrice: 0,
    latitude: 0,
    longitude: 0,
    images: {}
  })

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    regularPrice,
    discountPrice,
    latitude,
    longitude,
    images
  } = formData

  const handleChange = (e) => {
    let boolean = null;
    if (e.target.value === 'true') {
      boolean = true
    }
    if (e.target.value === 'false') {
      boolean = false
    }
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files
      }));
    }
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value
      }))
    }

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (+discountPrice >= +regularPrice) {
      setLoading(false)
      toast.error("Discounted Price needs to be less tha regular price")
      return
    }
    if (images.length > 6) {
      setLoading(false)
      toast.error("Maximum 6 images allowed")
      return
    }
    let geolocation = {}
    let location;
    if (geoLocationEnable) {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${import.meta.env.VITE_GEOCODING_API_KEY}`
      );
      const data = await res.json();
      console.log(data);
      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

      location = data.status === "ZERO_RESULTS" && undefined;

      if (location === undefined) {
        setLoading(false);
        toast.error("Please provide a currect location")
        return;
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
    }

    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        setLoading(true)
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${new Date().getTime()}`
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setLoading(true)
            console.log("Upload Is" + progress.toFixed(0) + "% done");
            // switch (snapshot.state) {
            //   case "paused":
            //     console.log('Upload is paused')
            //     break;
            //   case "running":
            //     console.log('Upload is running')
            //     break;
            // }
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
              setLoading(false)
            }
            )
          }
        );
      });
    }
    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("Images are not uploading")
      return;
    })

    const formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };
    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountPrice;
    delete formDataCopy.latitude;
    delete formDataCopy.longitude;
    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    setLoading(false);
    toast.success("Listing Successfully Created")
    navigate(`/category/${formDataCopy.type}/${docRef.id}`)


  }

  if (loading) {
    return <Spinner />
  }
  return (
    <main className=' max-w-md px-2 mx-auto'>
      <h1 className=' text-3xl text-center mt-6 font-bold'>Create a Listing</h1>
      <form onSubmit={handleSubmit}>
        <p className=' text-lg mt-6 font-semibold'>Sell/Rent</p>
        <div className=' flex'>
          <button
            type='button'
            id='type'
            value='sale'
            onClick={handleChange}
            className={`mr-3 pr-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transi duration-150 ease-in-out w-full
            ${type === "rent" ?
                " bg-white text-black" :
                " bg-slate-600 text-white"
              }
            `}
          >
            sell
          </button>
          <button
            type='button'
            id='type'
            value='rent'
            onClick={handleChange}
            className={`mr-3 pr-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transi duration-150 ease-in-out w-full
            ${type === "sale" ?
                " bg-white text-black" :
                " bg-slate-600 text-white"
              }
            `}
          >
            rent
          </button>
        </div>
        <p className=' text-lg mt-6 font-semibold'>Name</p>
        <input
          type="text"
          id='name'
          value={name}
          onChange={handleChange}
          placeholder='Name'
          minLength='10'
          maxLength='32'
          required
          className=' w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'
        />
        <div className=' flex space-x-6 mb-6'>
          <div>
            <p className=' text-lg font-semibold'>Beds</p>
            <input type="number"
              id='bedrooms'
              value={bedrooms}
              onChange={handleChange}
              min="1"
              max="50"
              required
              className=' w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'
            />
          </div>
          <div>
            <p className=' text-lg font-semibold'>Baths</p>
            <input type="number"
              id='bathrooms'
              value={bathrooms}
              onChange={handleChange}
              min='1'
              max='50'
              required
              className=' w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'
            />
          </div>
        </div>
        <p className=' text-lg mt-6 font-semibold'>Paking Spot</p>
        <div className=' flex'>
          <button
            type='button'
            id='parking'
            value={true}
            onClick={handleChange}
            className={` mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${!parking ? " bg-white text-black" :
              " bg-slate-600 text-white"
              }`}
          >
            Yes
          </button>
          <button
            type='button'
            id='parking'
            value={false}
            onClick={handleChange}
            className={` mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${parking ? " bg-white text-black" :
              " bg-slate-600 text-white"
              }`}
          >
            no
          </button>
        </div>
        <p className=' text-lg mt-6 font-semibold'>Furnished</p>
        <div className=' flex'>
          <button
            type='button'
            id='furnished'
            value={true}
            onClick={handleChange}
            className={` mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${!furnished ? " bg-white text-black" :
              " bg-slate-600 text-white"
              }`}
          >
            Yes
          </button>
          <button
            type='button'
            id='furnished'
            value={false}
            onClick={handleChange}
            className={` mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${furnished ? " bg-white text-black" :
              " bg-slate-600 text-white"
              }`}
          >
            no
          </button>
        </div>
        <p className=' text-lg mt-6 font-semibold'>Address</p>
        <textarea
          type="text"
          id='address'
          value={address}
          onChange={handleChange}
          placeholder='Address'
          required
          className=' w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-700 focus:bg-white focus:border-slate-600 mb-6'
        />
        {
          !geoLocationEnable && (
            <div className=' flex space-x-6 justify-start mb-6'>
              <div>
                <p className=' text-lg font-semibold'>Latitude</p>
                <input type="number"
                  id="latitude"
                  value={latitude}
                  onChange={handleChange}
                  required
                  min='-90'
                  max='90'
                  className=' w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center'
                />
              </div>
              <div>
                <p className=' text-lg font-semibold'>Latitude</p>
                <input type="number"
                  id="longitude"
                  value={longitude}
                  onChange={handleChange}
                  required
                  min='-180'
                  max='180'
                  className=' w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center'
                />
              </div>
            </div>
          )
        }
        <p className=' text-lg mt-6 font-semibold'>Description</p>
        <textarea
          type="text"
          id='description'
          value={description}
          onChange={handleChange}
          placeholder='Description'
          required
          className=' w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-700 focus:bg-white focus:border-slate-600 mb-6'
        />
        <p className="font-semibold text-lg">Offer</p>
        <div className=' flex mb-6'>
          <button
            type='button'
            id='offer'
            value={true}
            onClick={handleChange}
            className={` mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-100 ease-in-out w-full ${!offer ? " bg-white text-black" :
              " bg-slate-600 text-white"
              }`}
          >
            Yes
          </button>
          <button
            type='button'
            id='offer'
            value={false}
            onClick={handleChange}
            className={` mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-100 ease-in-out w-full ${offer ? " bg-white text-black" :
              " bg-slate-600 text-white"
              }`}
          >
            No
          </button>
        </div>
        <div className=' flex items-center mb-6'>
          <div>
            <p className=' text-lg font-semibold'>Regular Price</p>
            <div className=' flex w-full justify-center items-center space-x-6'>
              <input type="number"
                id='regularPrice'
                value={regularPrice}
                onChange={handleChange}
                min='50'
                max='400000000'
                required
                className=' w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'
              />
              {
                type === "rent" && (
                  <div className=''>
                    <p className=' w-full whitespace-nowrap text-base'>$/Month</p>
                  </div>
                )
              }
            </div>
          </div>
        </div>
        {
          offer && (
            <div className=' flex items-center mb-6 '>
              <div className=''>
                <p className=' text-lg font-semibold'>Discount Price</p>
                <div className=' flex w-full justify-center items-center space-x-6'>
                  <input
                    type="number"
                    id='discountPrice'
                    value={discountPrice}
                    onChange={handleChange}
                    min='50'
                    max='400000000'
                    required-={offer}
                    className=' w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'
                  />
                  {
                    type === "rent" && (
                      <div>
                        <p className=' text-base w-full whitespace-nowrap'>$/Month</p>
                      </div>
                    )
                  }
                </div>
              </div>
            </div>
          )
        }
        <div className=' mb-6'>
          <p className=' text-xl font-semibold'>Images</p>
          <p className=' text-gray-600'>The 1st Image Will be Cover (max-6)</p>
          <input type="file"
            id='images'
            onChange={handleChange}
            accept='.jpg,.png,.jpeg'
            multiple
            required
            className=' w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:bg-white focus:border-slate-600'
          />
        </div>
        <button
          type='submit'
          className=' mb-6 w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-200 ease-in-out'
        >
          Create Listing
        </button>
      </form>
    </main>
  )
}
