import React, { useContext } from 'react'
import AlertContext from '../context/AlertContext';

const Alerts = () => {
    const { alert } = useContext(AlertContext)
  return (

    alert.visible && 
    <div className={`alert position-absolute w-100 z-1 alert-${alert.type}`} role="alert">
        {alert.message}
    </div>

  )
}

export default Alerts