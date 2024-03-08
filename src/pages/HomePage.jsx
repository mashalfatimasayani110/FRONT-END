import React from 'react'
import {Link} from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'

function HomePage() {
  return (
    <MainLayout>
        <div className='bg-light p-5 mt-4 rounded-3'>
        <h1>Welcome to our Fruit POS Small Buisness</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla velit, ex pariatur qui quisquam, quasi  excepturi  non rem libero cumque repudiandae soluta! Sint atque beatae vero error consectetur! Soluta, maiores?</p>
        <p>If you have any issue feel free to contact at 999-090-888 anytime </p>
        <Link to='/pos' className='btn btn-primary'>Click here to sell products</Link>
        </div>
    </MainLayout>
  )
}

export default HomePage
