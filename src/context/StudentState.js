import StudentContext from './StudentContext'
import React, { useState } from 'react'

const StudentState = (props) => {
  const host = "http://localhost:3001"
    const studentsd = []

      const [students, setStudents] = useState(studentsd)

// Get all students
const getAllStudents = async () => {
  try {
    const response = await fetch(`${host}/students/showall/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHVkZW50cyI6eyJpZCI6IjY1OWM3MWU3ZmE2YjI4YTBhY2U1YzllNiIsInJvbGUiOiJBZG1pbiJ9LCJpYXQiOjE3MDYxMzAxNDl9.RWFbVyihu8pMVGn7gq4D-KQQXD-ME8cmVRBTbTVleQU", // Replace with your actual auth token
      },
    });
    const json = await response.json();
    setStudents(json);
  } catch (error) {
    console.error("Error fetching all students:", error);
    // Handle the error, you might want to set an error state or display a message to the user
  }
};

// Add a student
const addStudent = async (name, email, gender, password, address, phone, parentsphone, photo, documentid) => {
  try {
    const response = await fetch(`${host}/students/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, gender, password, address, phone, parentsphone, photo, documentid }),
    });
    const json = await response.json();
    const student = {
      "name": name,
      "email": email,
      "gender": gender,
      "password": password,
      "address": address,
      "phone": phone,
      "parentsphone": parentsphone,
      "photo": photo,
      "documentid": documentid
    };
    setStudents([...students, student]);
  } catch (error) {
    console.error("Error adding student:", error);
    // Handle the error
  }
};

      // Delete a student
      const deleteStudent = async (id) => {
        try {
          const response = await fetch(`${host}/students/delete/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHVkZW50cyI6eyJpZCI6IjY1OWM3MWU3ZmE2YjI4YTBhY2U1YzllNiIsInJvbGUiOiJBZG1pbiJ9LCJpYXQiOjE3MDYxMzAxNDl9.RWFbVyihu8pMVGn7gq4D-KQQXD-ME8cmVRBTbTVleQU", // Replace with your actual auth token
            },
          });
          const json = response.json();
          setStudents(json);
        } catch (error) {
          console.error("Error fetching all students:", error);
          // Handle the error, you might want to set an error state or display a message to the user
        }
        console.log('Deleting note with ' + id)
        const newStudentsData = students.filter((student)=> {return student._id!==id})
        setStudents(newStudentsData)
      }

// Edit a student
const editStudent = async (id, name, email, gender, password, address, phone, parentsphone, photo, documentid) => {
  try {
    const response = await fetch(`${host}/students/update/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHVkZW50cyI6eyJpZCI6IjY1OWM3MWU3ZmE2YjI4YTBhY2U1YzllNiIsInJvbGUiOiJBZG1pbiJ9LCJpYXQiOjE3MDYxMzAxNDl9.RWFbVyihu8pMVGn7gq4D-KQQXD-ME8cmVRBTbTVleQU", // Replace with your actual auth token
      },
      body: JSON.stringify({ name, email, gender, password, address, phone, parentsphone, photo, documentid }),
    });
    const json = await response.json();
    // Logic to edit in client
    for (let index = 0; index < students.length; index++) {
      const element = students[index];
      if (element._id === id) {
        element.name = name;
        element.email = email;
        element.gender = gender;
        element.password = password;
        element.address = address;
        element.phone = phone;
        element.parentsphone = parentsphone;
        element.photo = photo;
        element.documentid = documentid;
      }
    }
  } catch (error) {
    console.error("Error editing student:", error);
    // Handle the error
  }
};

  return (
    <StudentContext.Provider value={{students, addStudent, deleteStudent, editStudent, getAllStudents}}>
        {props.children}
    </StudentContext.Provider>
  )
}

export default StudentState



