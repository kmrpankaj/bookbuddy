import React, { useContext } from 'react'
import AlertContext from '../context/AlertContext';

const Alerts = () => {
    const { alert } = useContext(AlertContext)
  return (
    alert.visible &&
    <div className={`alert alert-${alert.type}`} role="alert">
        {alert.message}
    </div>
  )
}

export default Alerts