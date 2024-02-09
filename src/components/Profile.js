import React, { useContext, useEffect, useState } from 'react'
import StudentContext from '../context/StudentContext'
import getRandomAvatar from './uidGen'
import Sidedash from './Sidedash'
import useStudentData from './Usestudentdata'

const Profile = () => {
  const context = useContext(StudentContext)
  const { getOneStudent } = context;

  const { studentData, isLoading, error } = useStudentData(getOneStudent);


    // if (isLoading) return <div>Loading...</div>; // for loading TODO
  if (error) return <div>Error: {error}</div>;
  if (!studentData) return <div>No student data found</div>;

  //gets random avatars
  const avatarFilename = getRandomAvatar("studentData.gender");
  const dateString = studentData.regisDate;
  const dateRegistered = new Date(dateString);
  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  return (
    <>
    <div className="container-fluid">
                <div className="row">
                    <Sidedash />
                    
                    <div className="col-md-9 pt-3"><div className="row">
      <section className="vh-100">
        <div className="h-100">
          <div className="row d-flex h-100">
            <div className="mb-4 mb-lg-0">
              <div className="card mb-3" style={{borderRadius: ".5rem"}}>
                <div className="row g-0">
                  <div className="col-md-4 gradient-custom text-center text-white"
                    style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}
                    >
                    <img  src={`/images/${avatarFilename}.jpg`}
                      alt="Avatar" className="img-fluid my-5" style={{width: "130px"}} />
                    <h5>{(studentData.role === "Admin" || studentData.role === "Superadmin")? studentData.role:"User ID"}</h5>
                    <p>{studentData.uid}</p>
                    <i className="far fa-edit mb-5"></i>
                  </div>
                  <div className="col-md-8">
                    <div className="card-body p-4">
                      <h6>{studentData.name}</h6>
                      <hr className="mt-0 mb-4"/>
                      <div className="row pt-1">
                        <div className="col-6 mb-3">
                          <h6>Email</h6>
                          <p className="text-muted">{studentData.email}</p>
                        </div>
                        <div className="col-6 mb-3">
                          <h6>Phone</h6>
                          <p className="text-muted">{studentData.phone}</p>
                        </div>
                      </div>
                      <h6>Details</h6>
                      <hr className="mt-0 mb-4"/>
                      <div className="row pt-1">
                        <div className="col-6 mb-3">
                          <h6>Registered On</h6>
                          <p className="text-muted">{`${dateRegistered.getDate()} ${month[dateRegistered.getMonth()]} ${dateRegistered.getFullYear()}`}</p>
                        </div>
                        <div className="col-6 mb-3">
                          <h6>Most Viewed</h6>
                          <p className="text-muted">Dolor sit amet</p>
                        </div>
                      </div>
                      <div className="d-flex justify-content-start">
                        <a href="#!"><i className="fab fa-facebook-f fa-lg me-3"></i></a>
                        <a href="#!"><i className="fab fa-twitter fa-lg me-3"></i></a>
                        <a href="#!"><i className="fab fa-instagram fa-lg"></i></a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
      </div>
      </div>
      </div>
    </>
  )
}

export default Profile