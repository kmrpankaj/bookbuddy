import React from 'react'
import Sidedash from './Sidedash'

const Home = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <Sidedash />

        <div className="col-md-9 pt-3">
          <div className="row">
            Book a seat.
          </div>
        </div>
      </div>
    </div>

  )
}

export default Home