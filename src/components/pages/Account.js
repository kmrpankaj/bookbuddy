import React from 'react'
import Sidedash from '../uicomponents/Sidedash'

const Account = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <Sidedash />

        <div className="col-md-9 pt-3">
          <div className="row">
            This is your account page.
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account