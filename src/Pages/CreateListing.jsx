import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CreateListing() {
  const navigate = useNavigate();
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

  const handleChange = () => {

  }
  return (
    <main className=' max-w-md px-2 mx-auto'>
      <h1 className=' text-3xl text-center mt-6 font-bold'>Create a Listing</h1>
      <form >
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
                    type="text"
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
