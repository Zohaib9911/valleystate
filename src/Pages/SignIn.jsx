import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { Link } from 'react-router-dom';
import OAuth from '../Components/OAuth';
import { toast } from 'react-toastify';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';


export default function SignIn() {
  const [showpassword, setShowpassword] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential.user) {
        navigate('/');
      }
    } catch (error) {
      toast.error("invalid Credentaials ")
    }
  }


  return (
    <section>
      <h1 className=' text-3xl text-center mt-6 font-bold'>Sign In</h1>
      <div className=' flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
        <div className=' md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
          <img src="https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1373&q=80" alt="Key of site" />
        </div>
        <div className=' w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
          <form onSubmit={handleSubmit}>
            <input type="email"
              id='email'
              value={email}
              onChange={onChange}
              placeholder='Email Address'
              className=' mb-6 w-full px-4 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out'
            />
            <div className=' relative mb-6'>
              <input type={showpassword ? "text" : "password"}
                id='password'
                value={password}
                onChange={onChange}
                placeholder='Password'
                className=' w-full py-2 px-4 text-xl text-gray-700 bg-white border-x-gray-300 rounded transition ease-in-out'
              />
              {
                showpassword ? (
                  <AiFillEyeInvisible
                    className=' absolute right-3 top-3 text-xl cursor-pointer'
                    onClick={() => setShowpassword((prev) => (!prev))}
                  />
                ) : (
                  <AiFillEye
                    className=' absolute right-3 top-3 text-xl cursor-pointer'
                    onClick={() => setShowpassword((prev) => (!prev))}
                  />
                )
              }
            </div>
            <div className=' flex justify-between whitespace-nowrap text-sm sm:text-lg'>
              <p className=' mb-6'>
                Don't have an account?
                <Link to='/sign-up' className=' text-red-500 hover:text-red-700 transition duration-200 ease-in-out ml-1' >
                  Register
                </Link>
              </p>
              <p  >
                <Link to='/forget-password' className=' text-blue-500 hover:text-blue-800 transition duration-200 ease-in-out '>
                  Forget Password?
                </Link>
              </p>
            </div>
            <button className='w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800'
              type='submit'
            >
              Sign In
            </button>
            <div className=' flex items-center my-4 before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300'>
              <p className=' text-center font-semibold mx-4'>OR</p>
            </div>
            <OAuth />


          </form>
        </div>

      </div>
    </section>
  )
}
