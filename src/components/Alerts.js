import React, { useContext, useEffect } from 'react'
import AlertContext from '../context/AlertContext';

const Alerts = () => {
    const { alert } = useContext(AlertContext)

    useEffect(() => {
      if (alert.visible) {
        const alertElement = document.querySelector('.alert'); // Assuming only one alert exists
        setTimeout(() => {
          alertElement.classList.remove('fadeInDown');
          alertElement.classList.add('fadeOutDown');
        }, 1500);
      }
    }, [alert.visible]);

  return (

    alert.visible && 
    <div className="alert-overlay">
      <div className={`alert w-100 z-1020 alert-${alert.type} fadeInDown`} role="alert">
          {alert.message}
      </div>
    </div>

  )
}

export default Alerts