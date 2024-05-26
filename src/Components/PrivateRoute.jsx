import React from 'react'
import { UserAuthHook } from '../CustomeHook/UserAuthHook'
import { Navigate, Outlet } from 'react-router-dom'
import Spinner from './Spinner';

export default function PrivateRoute() {
  const { loggedIn, loading } = UserAuthHook();
  if (loading) {
    return <Spinner />
  }
  return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />

}
