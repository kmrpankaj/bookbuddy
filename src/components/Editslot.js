import React, { forwardRef } from 'react'


const Editslot = forwardRef((props, ref) => {
    const { slot, onChangeEdit, slotUpdate } = props
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
        <h5 className="modal-title" id="exampleModalLongTitle">Assign {slot.slotName} slot</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
          {/* <span aria-hidden="true">&times;</span> */}
        </button>
      </div>
      <div className="modal-body">
        <form>
            <div className="form-group">
                <label className='mb-3' htmlFor="inputBookedby">Enter UID to assign this seat</label>
                <input onChange={onChangeEdit} value={slot.bookedBy || ''} name="bookedBy" type="text" className="form-control" placeholder="UID" />
            </div>
        </form>
      </div>
      <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" data-bs-dismiss="modal" onClick={slotUpdate} className="btn btn-primary">Update</button>
        </div>
    </div>
  </div>
</div>
    </>
  )
})

export default Editslot