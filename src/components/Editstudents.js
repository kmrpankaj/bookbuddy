import React, { forwardRef, useContext, useEffect } from 'react'
import AlertContext from '../context/AlertContext'

const Editstudents = forwardRef((props, ref) => {
    const { student, onChangeEdit, handleClickEdit, editLoader } = props
    const {showAlert} = useContext(AlertContext)

    
    return (
        <>
            {/* <!-- Button trigger modal --> */}
            <button style={{ display: "none" }} ref={ref} type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                Launch static backdrop modal
            </button>

            {/* <!-- Modal --> */}
            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="99" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Edit Students</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {/* edit form starts here */}
                            <div className="card">
                                <div className="card-body">
                                    <div className="m-sm-3">
                                        <form enctype="multipart/form-data" method="post" className='text-start'>
                                            <div className="mb-3">
                                                <label className="form-label">Full name</label>
                                                <input className="form-control form-control-lg" type="text" value={student.ename} name="ename" placeholder="Enter your name" onChange={onChangeEdit} />
                                            </div>

                                            {(localStorage.getItem('role') === 'Admin')? "":
                                            <>
                                            <div className="mb-3">
                                                <label className="form-label">Email</label>
                                                <input className="form-control form-control-lg" type="email" value={student.eemail} name="eemail" placeholder="Enter your email" onChange={onChangeEdit} />
                                            </div>
                                            </>
                                            }
                                            <div className="mb-3">
												<label className="form-label">Gender</label>
												<div className="form-check form-check-inline mx-2">
												<input className="form-check-input" value="Male" type="radio" name="egender" id="flexRadioDefault1" checked={student.egender === 'Male'} onChange={onChangeEdit}/>
												<label className="form-check-label" htmlFor="Male">
													Male
												</label>
												</div>
												<div className="form-check form-check-inline">
												<input className="form-check-input" value="Female" type="radio" name="egender" id="flexRadioDefault2" checked={student.egender === 'Female'}  onChange={onChangeEdit}/>
												<label className="form-check-label" htmlFor="Female">
													Female
												</label>
												</div>
											</div>
                                            <div className="mb-3">
												<label className="form-label">Address</label>
												<input className="form-control form-control-lg" type="text" value={student.eaddress} name="eaddress" placeholder="Enter your address" onChange={onChangeEdit}/>
											</div>
                                            <div className="mb-3">
                                                <label className="form-label">Phone</label>
                                                <input className="form-control form-control-lg" type="text" value={student.ephone} name="ephone" placeholder="Your phone number" onChange={onChangeEdit} />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Alternate No</label>
                                                <input className="form-control form-control-lg" type="text" value={student.eparentsphone} name="eparentsphone" placeholder="Guiardian or relative number" onChange={onChangeEdit} />
                                            </div>

                                            {/* <div className="mb-3">
                                                <label className="form-label">Photo</label>
                                                <input className="form-control form-control-lg" type="file" name="ephoto" placeholder="Upload your photo" onChange={onChangeEdit} />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Document</label>
                                                <input className="form-control form-control-lg" type="file" name="edocumentid" placeholder="Upload your document" onChange={onChangeEdit} />
                                            </div> */}

                                            <div className="mb-3">
                                                <label className="form-label">Photo</label>
                                                    <input className="form-control form-control-lg" type="file" name="ephoto" placeholder="Upload your photo" onChange={onChangeEdit} />
                                                <div>
                                                    {student.ephoto ? (
                                                        <small className="px-1 bg-light">Current photo: {student.ephoto || 'No file selected'}</small>
                                                    ) : (
                                                        <small className="px-1 bg-light">No file uploaded</small>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Document</label>
                                                    <input className="form-control form-control-lg" type="file" name="edocumentid" placeholder="Upload your document" onChange={onChangeEdit} />
                                                <div>
                                                    {student.edocumentid ? (
                                                        <small className="px-1 bg-light">Current document: {student.edocumentid || 'uploads/default.'}</small>
                                                    ) : (
                                                        <small className="px-1 bg-light">No file uploaded</small>
                                                    )}
                                                </div>
                                            </div>


                                            {(localStorage.getItem('role') === 'Admin')? "":
                                            <>
                                            <div className="mb-3">
												<label className="form-label">Role</label>
												<input className="form-control form-control-lg" type="text" value={student.erole} name="erole" placeholder="Add a role" onChange={onChangeEdit}/>
											</div>
                                            </>
                                            }

                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleClickEdit}>{editLoader ? <div class="spinner-border spinner-border-sm" role="status"></div>: "Update"}</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- Modal --> */}
        </>
    )
})

export default Editstudents