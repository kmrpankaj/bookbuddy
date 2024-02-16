import React, { forwardRef, useState, useEffect } from 'react'
import { capitalizeFirstLetter } from './Utilsfunc'

const Editslot = forwardRef((props, ref) => {
    const { slot, onChangeEdit, slotUpdate, makeSeatAvailable } = props

    const [isCustomDateEnabled, setIsCustomDateEnabled] = useState(false);
    // Update based on props if needed, to reset when modal opens with new slot data
    useEffect(() => {
      if (slot.seatValidTill) {
          setIsCustomDateEnabled(true); // Enable custom date if existing date is present
      } else {
          setIsCustomDateEnabled(false); // Disable otherwise
      }
  }, [slot.seatValidTill]);

    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      const year = date.getFullYear();
      // getMonth() returns 0-11; adding 1 to get 1-12 for months and padding with '0' to ensure two digits
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      // getDate() returns 1-31; padding with '0' to ensure two digits
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
  };
  const handleCustomDateCheckboxChange = (e) => {
    setIsCustomDateEnabled(e.target.checked);
};
  return (
    <>
        {/* <!-- Button trigger modal --> */}
<button type="button" style={{ display: "none" }} ref={ref} className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
  Launch demo modal
</button>

{/* <!-- Modal --> */}
<div className="modal fade" id="staticBackdrop"  tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLongTitle">Seat Number {slot.seatNumber}: {capitalizeFirstLetter(slot.slotName)} Slot</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
          {/* <span aria-hidden="true">&times;</span> */}
        </button>
      </div>
      <div className="modal-body">
        <form>
            <div className="form-group">
                <label className='mb-3' htmlFor="inputBookedby">Enter UID to assign this seat</label>
                <div className='d-flex align-items-center justify-content-between'>
                    <input onChange={onChangeEdit} value={slot.bookedBy || ''} name="bookedBy" type="text" id="uidinput" className="form-control" placeholder="UID" />
                    <span className='px-1' title='Unassign' role="button" type="button" data-bs-dismiss="modal" onClick={makeSeatAvailable}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                        </svg>
                    </span>
                </div>
                 {/* Checkbox to enable/disable custom validity date */}
            <div className="form-check my-3 mx-1 d-inline-block">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="customDateCheckbox"
                    checked={isCustomDateEnabled}
                    onChange={handleCustomDateCheckboxChange}
                />
                <label className="form-check-label" htmlFor="customDateCheckbox">
                    <small>Do you manually want to set a validity?</small>
                </label>
            </div>
                 {/* Custom validity date input */}
                 {/* Conditionally render the date input field */}
                {isCustomDateEnabled && (
                <div className="form-group">
                  <label className='mb-3' htmlFor="customValidityDate"> Set a Custom Validity</label>
                  <input name="seatValidTill" type="date" id="customValidityDate" className="form-control" value={formatDate(slot.seatValidTill) || ''} onChange={onChangeEdit} />
                </div>
                )}
            </div>
        </form>
      </div>
      <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" onClick={slotUpdate} data-bs-dismiss="modal" className="btn btn-primary">Update</button>
        </div>
    </div>
  </div>
</div>
    </>
  )
})

export default Editslot