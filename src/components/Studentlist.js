import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StudentContext from '../context/StudentContext'
import getRandomAvatar from './uidGen'
import Sidedash from './Sidedash'
import Editstudents from './Editstudents'
import AlertContext from '../context/AlertContext'
import { capitalizeFirstLetter } from './Utilsfunc'
import { copyToClipboard } from './Utilsfunc'
import ScrollButton from './ScrollButton'


const Studentlist = (props) => {
    const context = useContext(StudentContext)
    const { students, deleteStudent, getAllStudents, editStudent, editStudentAccountStatus } = context;
    const {showAlert} = useContext(AlertContext)
    const editModalRef = useRef(null);
    const [filter, setFilter] = useState('all'); // State for filtering seats
    const [searchTerm, setSearchTerm] = useState('');
    const [student, setStudent] = useState({id: "", ename: "", eemail: "", egender: "", password: "", eaddress: "", ephone: "", eparentsphone: "", ephoto: "", edocumentid: "", uid: "", erole: "Student"})
    const history = useNavigate()
    const [studentFiles, setStudentFiles] = useState({ ephoto: null, edocumentid: null });

    useEffect(() => {
        if(localStorage.getItem('token') && (localStorage.getItem('role') === 'Admin' || localStorage.getItem('role') === 'Superadmin') ){
            getAllStudents()
        } else if (localStorage.getItem('role') === 'Student') {
            showAlert("You aren't allowed to be here", "danger")
            history("/account");
        } else {
            showAlert("Please login to continue", "warning")
            history("/login");
        }
        
    }, [])
    const updateStudents = (currentStudent) => {
               // in order to ref the modal from another component
        if (editModalRef.current) {
            editModalRef.current.click();
          }
        setStudent({id: currentStudent._id, ename: currentStudent.name, eemail: currentStudent.email, egender: currentStudent.gender, password: currentStudent.password, eaddress: currentStudent.address, ephone: currentStudent.phone, eparentsphone: currentStudent.parentsphone, ephoto: currentStudent.photo, edocumentid: currentStudent.documentid, erole: currentStudent.role})
    }


    const handleClickEdit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        
        formData.append('name', student.ename);
        formData.append('email', student.eemail);
        formData.append('gender', student.egender);
        formData.append('password', student.epassword);
        formData.append('address', student.eaddress);
        formData.append('phone', student.ephone);
        formData.append('parentsphone', student.eparentsphone);
        formData.append('role', student.erole);
        formData.append('accountStatus', student.eaccountStatus);

        // Append text fields to formData only if they have been explicitly set
        Object.keys(student).forEach(key => {
            if (student[key] !== undefined && key !== 'password' && key !== 'accountStatus') {
            formData.append(key, student[key]);
            }
        });
    
        // Add file fields if they exist
        if (studentFiles.ephoto) {
            formData.append('photo', studentFiles.ephoto);
        }
        if (studentFiles.edocumentid) {
            formData.append('documentid', studentFiles.edocumentid);
        }

        try {
            const response = await editStudent(student.id, formData);
        // console.log(response.message, "hihello")
            if (response.success) {
              //console.log("Successfully updated student 1:", response.updatedStudent);
              // Perform additional UI updates here, if necessary
              showAlert(`Update successful! ${response.updatedStudent.name}`, "success")
            } else {
            console.error("Failed to update student:", response.message);
            showAlert(`Error uploading photos: ${response.error}`, "danger")
              // Handle error UI feedback here
            }
          } catch (error) {
            console.error("Unexpected error:", error);
            // Handle unexpected errors here
            showAlert(`Error uploading photos: ${error.message}`, "danger")
          }
    }

    const toggleAccountStatus = (e, id, currentAccountStatus) => {
        e.preventDefault();
        const newAccountStatus = currentAccountStatus === true ? false : true;
        editStudentAccountStatus(id, newAccountStatus);
        //console.log("Updating account status to:", newAccountStatus);
      };

    const onChangeEdit = (e) => {
    if (e.target.type === 'file') {
        setStudentFiles({ ...studentFiles, [e.target.name]: e.target.files[0] });
    } else {
        setStudent({ ...student, [e.target.name]: e.target.value });
    }
    };
    const copyTheUid = (uid) => {
        copyToClipboard(`studentuid-${uid}`)
        showAlert("UID copied to clipboard", "success")
    }

    // check if validity has expired or not
    function hasExpiredSeat(seatAssigned) {
        return seatAssigned.some(seat => {
            const validityDate = new Date(seat.validityDate);
            return validityDate.getTime() < Date.now();
        });
    }

      const filteredStudents = students.filter((student) => {
        switch (filter) {
          case 'active':
              return student.accountStatus === true;
          case 'inactive':
            return student.accountStatus === false;
          case 'hasBooking':
            return student.seatAssigned.length > 0;
          case 'expired':
            return hasExpiredSeat(student.seatAssigned);;
          default:
              return student; // By default, no filtering based on account status or bookings
        }
      }).filter((student) => {
          // Add the search term filtering here
          return student.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                 student.uid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 student.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 student.parentsphone?.toLowerCase().includes(searchTerm.toLowerCase());
      })

    return (
        <>
            <div className="container-fluid">
            <ScrollButton />
                <div className="row">
                    <Sidedash onSetActive={() => setFilter('active')} onSetInactive={() => setFilter('inactive')} onSetAll={() => setFilter('all')}  onSetExpired={() => setFilter('expired')} onSetHasBooking={() => setFilter('hasBooking')} />
                    
                    <div className="col-md-9 pt-3"><div className="row">
                        <div className='col-md-12 position-relative'>
                            <input 
                            type="text" 
                            className="form-control mb-3" 
                            placeholder="Search by name UID email or phone.." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} />
                            {searchTerm && (
                            <button 
                                className="btn btn-outline-secondary" 
                                type="button" 
                                onClick={() => setSearchTerm('')}
                                style={{position: 'absolute', height: 37, right: 12, top: 0, bottom: 0, zIndex: 10, cursor: 'pointer'}}
                            >
                                X
                            </button>
                             )}
                        </div>
                    
                        {filteredStudents.length===0 && "No user found! WTF!!!"}
                        {filteredStudents.map((student) => {
                            const dateString = student.regisDate;
                            const date = new Date(dateString);
                            //gets random avatars
                            const avatarFilename = student.avatar;
                            return (
                                <>
                                    <div key={student.uid} className="col-md-4 col-xl-4">
                                        <div className="card mb-3">
                                            <div className="card-body text-center">
                                                <img src={`/images/${avatarFilename}.jpg`} alt="Stacie Hall" className="img-fluid rounded-circle mb-2" width="128" height="128" />
                                                <h5 className="card-title mb-0">{student.name}</h5>
                                                <div className="text-muted mb-2 position-relative"><span id={`studentuid-${student.uid}`}>{student.uid}</span> <svg className='position-absolute' width="16" height="16" onClick={()=> copyTheUid(student.uid)} style={{cursor: "pointer", top: "2px", paddingLeft: "5px"}} fill="#212529 " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z"/><title>Copy to clipboard</title></svg></div>
                                               
                                                <div>
                                                    <button className="btn btn-primary btn-sm" onClick={()=>{updateStudents(student)}}>Edit</button>
                                                    
                                                    {(student.role==="Superadmin" )?"":
                                                    <>
                                                    <button className="btn btn-primary btn-sm mx-1" onClick={(e) => toggleAccountStatus(e, student._id, student.accountStatus)}>{student.accountStatus?"Active": "Inactive"}</button>
                                                    {(localStorage.getItem('role') === 'Admin')? "":
                                                    <>
                                                    <button className="btn btn-primary btn-sm" onClick={(e) => { deleteStudent(student._id); showAlert(`${student.name} deleted successfully`, "danger") }}>Delete</button>
                                                    </>
                                                    }
                                                    </>
                                                    }
                                                </div>
                                            </div>
                                            <hr className="my-0" />
                                            <div className="card-body position-relative">
                                            <span className='collapsible position-relative'>
                                                <h5 className="h6 card-title cursor-pointer" data-bs-toggle="collapse" data-bs-target={`#T${student.uid}`} aria-expanded="true" aria-controls={`T${student.uid}`}>Seat Details</h5>
                                                <svg className="collapse-svg position-absolute" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M246.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L224 109.3 361.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160zm160 352l-160-160c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L224 301.3 361.4 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3z"/></svg>
                                            </span>   
                                                <div className={`collapse ${student.seatAssigned.length > 0 ? "show":""}`} id={`T${student.uid}`}>
                                                    <ul className='list-group'>
                                                        {
                                                            //show booked shifts
                                                            student.seatAssigned && student.seatAssigned.length > 0 ? (
                                                                student.seatAssigned.map((shift, index) => (

                                                                    //checking validity date

                                                                <li className={`list-group-item ${(new Date(shift.validityDate) < new Date().setHours(0, 0, 0, 0)?"border-danger":"")}`} key={index}>
                                                                    <small>Seat: {shift.seatNumber} | {capitalizeFirstLetter(shift.slot)} | Valid: {shift.validityDate}</small>
                                                                </li>
                                                                ))
                                                            ) : (
                                                                <p>No booked shifts</p>
                                                            )
                                                        }
                                                    </ul>
                                                </div>
                                            </div>
                                            <hr className="my-0" />
                                            <div className="card-body">
                                                
                                                <span className='collapsible position-relative'>
                                                    <h5 className="h6 card-title cursor-pointer" data-bs-toggle="collapse" data-bs-target={`#C${student.uid}`} aria-expanded="false" aria-controls={`C${student.uid}`}>About</h5>
                                                    <svg className="collapse-svg position-absolute" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M246.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L224 109.3 361.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160zm160 352l-160-160c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L224 301.3 361.4 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3z"/></svg>
                                                </span>
                                                <div className="collapse" id={`C${student.uid}`}>
                                                    <ul className="list-unstyled mb-0">
                                                        <li className="mb-1"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-house" viewBox="0 0 576 512"><path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c.2 35.5-28.5 64.3-64 64.3H128.1c-35.3 0-64-28.7-64-64V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24zM352 224a64 64 0 1 0 -128 0 64 64 0 1 0 128 0zm-96 96c-44.2 0-80 35.8-80 80c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16c0-44.2-35.8-80-80-80H256z"/></svg> Lives in: <span>{student.address}</span></li>
                                                        <li className="mb-1"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-envelope" viewBox="0 0 448 512"><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM218 271.7L64.2 172.4C66 156.4 79.5 144 96 144H352c16.5 0 30 12.4 31.8 28.4L230 271.7c-1.8 1.2-3.9 1.8-6 1.8s-4.2-.6-6-1.8zm29.4 26.9L384 210.4V336c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V210.4l136.6 88.2c7 4.5 15.1 6.9 23.4 6.9s16.4-2.4 23.4-6.9z"/></svg> Email: <span>{student.email}</span></li>
                                                        <li className="mb-1"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-phone" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg> Phone: <span>{student.phone}</span></li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <hr className="my-0" />
                                            <div className="card-body">
                                            <span className='collapsible position-relative'>
                                                <h5 className="h6 card-title cursor-pointer" data-bs-toggle="collapse" data-bs-target={`#P${student.uid}`} aria-expanded="false" aria-controls={`P${student.uid}`}>Other Details</h5>
                                                <svg className="collapse-svg position-absolute" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M246.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L224 109.3 361.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160zm160 352l-160-160c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L224 301.3 361.4 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3z"/></svg>
                                            </span>    
                                                <div className="collapse" id={`P${student.uid}`}>
                                                <ul className="list-unstyled mb-0">
                                                    <li className="mb-1"><span className="fas fa-globe fa-fw me-1">Role:</span> <span>{student.role}</span></li>
                                                    <li className="mb-1"><span className="fab fa-twitter fa-fw me-1">Registered on:</span> <span>{`${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`}</span></li>
                                                    <li className="mb-1"><span className="fab fa-facebook fa-fw me-1">Photo:</span> <span><a target="_blank" href={`${process.env.REACT_APP_BACKEND_URL}/${student.photo}`}>Image-{student.photo}</a></span></li>
                                                    <li className="mb-1"><span className="fab fa-instagram fa-fw me-1">Document ID: </span> <span><a target="_blank" href={`${process.env.REACT_APP_BACKEND_URL}/${student.documentid}`}>Id Proof-{student.documentid}</a></span></li>
                                                    <li className="mb-1"><span className="fab fa-linkedin fa-fw me-1">Parent's Phone:</span> <span>{student.parentsphone}</span></li>
                                                </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        })}
                    </div>
                    </div>
                </div>
            </div>
            <Editstudents key={student._id} ref={editModalRef} student={student} onChangeEdit={onChangeEdit} handleClickEdit={handleClickEdit} />
        </>
    )
}

export default Studentlist