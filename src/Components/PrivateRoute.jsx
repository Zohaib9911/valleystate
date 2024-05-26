import React from 'react'
import { UserAuthHook } from '../CustomeHook/UserAuthHook'
import { Navigate, Outlet } from 'react-router-dom'

export default function PrivateRoute() {
  const { loggedIn, loading } = UserAuthHook();
  if (loading) {
    return <div>Loading...</div>
  }
  return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />

}
