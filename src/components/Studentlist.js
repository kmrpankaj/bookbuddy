import React, { useContext, useEffect } from 'react'
import StudentContext from '../context/StudentContext'
import getRandomAvatar from './uidGen'
import Sidedash from './Sidedash'

const Studentlist = () => {
    const context = useContext(StudentContext)
    const { students, deleteStudent, getAllStudents } = context;
    useEffect(() => {
        getAllStudents()
    }, [])
    
    return (
        <>
            <div className="container-fluid">
                <div className="row">
                <Sidedash />
                <div className="col-md-9"><div className="row">
                    {students.map((student) => {
                        const dateString = student.regisDate;
                        const date = new Date(dateString);
                        
                        const avatarFilename = getRandomAvatar(student.gender || "male");
                        return (
                            <div key={student.uid} className="col-md-4 col-xl-4">
                                <div className="card mb-3">
                                    <div className="card-body text-center">
                                        <img src={`/images/${avatarFilename}.jpg`} alt="Stacie Hall" className="img-fluid rounded-circle mb-2" width="128" height="128" />
                                        <h5 className="card-title mb-0">{student.name}</h5>
                                        <div className="text-muted mb-2">{student.uid}</div>

                                        <div>
                                            <button className="btn btn-primary btn-sm" href="#">Edit</button>
                                            <button className="btn btn-primary btn-sm mx-1" href="#">Disable</button>
                                            <button className="btn btn-primary btn-sm" onClick={()=> {deleteStudent(student._id)}}>Delete</button>
                                        </div>
                                    </div>
                                    <hr className="my-0" />
                                    <div className="card-body">
                                        <h5 className="h6 card-title">Seat Details</h5>
                                        <a href="#" className="badge bg-primary me-1 my-1">25</a>
                                    </div>
                                    <hr className="my-0" />
                                    <div className="card-body">
                                        <h5 className="h6 card-title">About</h5>
                                        <ul className="list-unstyled mb-0">
                                            <li className="mb-1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house" viewBox="0 0 16 16"><path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" /></svg> Lives in: <span>{student.address}</span></li>
                                            <li className="mb-1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope" viewBox="0 0 16 16"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" /></svg> Email: <span>{student.email}</span></li>
                                            <li className="mb-1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-phone" viewBox="0 0 16 16"><path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/><path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/></svg> Phone: <span>{student.phone}</span></li>
                                        </ul>
                                    </div>
                                    <hr className="my-0" />
                                    <div className="card-body">
                                        <h5 className="h6 card-title">Other Details</h5>
                                        <ul className="list-unstyled mb-0">
                                            <li className="mb-1"><span className="fas fa-globe fa-fw me-1">Role:</span> <span>{student.role}</span></li>
                                            <li className="mb-1"><span className="fab fa-twitter fa-fw me-1">Registered on:</span> <span>{`${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`}</span></li>
                                            <li className="mb-1"><span className="fab fa-facebook fa-fw me-1">Photo:</span> <span>{student.photo}</span></li>
                                            <li className="mb-1"><span className="fab fa-instagram fa-fw me-1">Document ID: </span> <span>{student.documentid}</span></li>
                                            <li className="mb-1"><span className="fab fa-linkedin fa-fw me-1">Parent's Phone:</span> <span>{student.parentsphone}</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Studentlist