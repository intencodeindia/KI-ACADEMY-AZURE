import React from 'react'
import Main from './Main'
import Header from '@/app/components/header/Header'
import Footer from '@/app/components/footer/Footer'

const Page = () => (
  <div className="d-flex flex-column min-vh-100">
    <Header />
    <div className="container-fluid flex-grow-1 px-0 px-lg-3 mb-5">
      <Main />
    </div>
    <Footer />
  </div>
)

export default Page