import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Header } from './includes/Header';
import { Footer } from './includes/Footer';


export const PublicLayout = () => {

    return (
      <>
        <Header/>
        <Outlet/>
        <Footer/>
      </>
    )
}