import AlertContext from "./AlertContext";
import React, { useState } from "react";

const AlertState = (props) => {
    const [alert, setAlert] = useState({
        message: "",
        type: "", // "primary", "secondary", "success", "danger", "warning", "info", "light", "dark", etc.
        visible: false,
      })

      const showAlert = (message, type) => {
        setAlert({ message, type, visible: true });
        setTimeout(()=>{
            setAlert({ msg: '', type: '', visible: false });
          }, 2000)
      };


  return (
    <AlertContext.Provider value={{ alert, showAlert }}>
        {props.children}
    </AlertContext.Provider>
  )
}


export default AlertState