import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router';

export default function SiteHeader() {
  const [pagestate, setPageState] = useState("Sign in");
  const location = useLocation();
  const navigate = useNavigate();
  const pathMatchRoute = (route) => {
    if (route === location.pathname) {
      return true;
    }
  }

  return (
    <div className=' bg-white border-b shadow-md sticky top-0 z-40'>
      <header className=' flex justify-between items-center px-3 max-w-6xl mx-auto'>
        <div>
          <img
            className=' h-[80px] cursor-pointer'
            src="https://firebasestorage.googleapis.com/v0/b/academic-b6371.appspot.com/o/Valley%20Developer%20logo%20v1.png?alt=media&token=ada09ed0-8e77-4702-8916-520fbaa94121" alt="Valley state logo"
            onClick={() => navigate('/')} />
        </div>
        <div>
          <ul className=' flex space-x-10'>
            <li className={` cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathMatchRoute('/') && " text-black border-b-red-600"}`}
              onClick={() => navigate('/')}
            >Home</li>
            <li
              className={` cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathMatchRoute('/offers') && " text-black border-b-red-600"}`}
              onClick={() => navigate('/offers')}
            >Offers</li>
            <li
              className={` cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathMatchRoute('/sign-in') && " text-black border-b-red-600"}`}
              onClick={() => navigate('/sign-in')}
            >Sign In</li>
          </ul>
        </div>
      </header>
    </div>
  )
}

