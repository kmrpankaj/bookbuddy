import StudentContext from './StudentContext'
import React, { useState } from 'react'

const StudentState = (props) => {
  const host = "localhost:http://3001"
    const studentsd = [
      {
        "_id": "659c71e7fa6b28a0ace5c9e6",
        "name": "Amar Ratna",
        "email": "pankaj1088@gmail.com",
        "password": "$2a$10$wTQy/Vzy3ROAepMZ269bPOXj.l2MGAXmspO14WHzl3DQVahSjtkjy",
        "address": "B15 Jai bhawani phase one bhopal",
        "phone": 9863026419,
        "parentsphone": 7000958835,
        "photo": "photorahul23.jpg",
        "documentid": "aadharahul13.jpg",
        "uid": "20230612A4DC",
        "regisDate": "2024-01-08T22:06:31.957Z",
        "__v": 0,
        "role": "Admin"
      },
      {
        "_id": "65a44cbf55c2740919373b09",
        "name": "Shashikant",
        "email": "Shashikant123@gmail.com",
        "password": "$2a$10$BMUWGMs8sqxgackZHo32t.cy.7qI2N2DT2aVaisG1m6PVzfF6tJam",
        "address": "B15 Jai bhawani phase one bhopal",
        "phone": 9786384736,
        "parentsphone": 7100953835,
        "photo": "photorahul23.jpg",
        "documentid": "aadharahul13.jpg",
        "uid": "20230612A4DC",
        "regisDate": "2024-01-14T21:06:07.984Z",
        "role": "Admin",
        "__v": 0
      },
      {
        "_id": "65a66ad033d57ce386b50a55",
        "name": "Shashikant",
        "email": "Shashikant1235@gmail.com",
        "password": "$2a$10$gyOCsLFxPwr.jiI7KiZT0eCqtvE.IFsAO1AvW6JgCbejMs2d1uwXy",
        "address": "B15 Jai bhawani phase one bhopal",
        "phone": 9786354736,
        "parentsphone": 7100953835,
        "photo": "photorahul23.jpg",
        "documentid": "aadharahul13.jpg",
        "uid": "240116AD04",
        "regisDate": "2024-01-16T11:38:56.921Z",
        "role": "Student",
        "__v": 0
      },
      {
        "_id": "65b011b8a8d3fc2a461e804c",
        "name": "Shashikant",
        "email": "pushparaj1235@gmail.com",
        "gender": "female",
        "password": "$2a$10$asTCLb9Ih.FThLY01nfYa.uo5y.53q2IR1hfugaqaDaS9qkdn6yc.",
        "address": "B15 Jai bhawani phase one bhopal",
        "phone": 9786354735,
        "parentsphone": 7100953835,
        "photo": "photorahul23.jpg",
        "documentid": "aadharahul13.jpg",
        "uid": "240116AD05",
        "regisDate": "2024-01-23T19:21:28.041Z",
        "role": "Student",
        "__v": 0
      },
      {
        "_id": "65b0e25a826a92e26538de68",
        "name": "Shashikant2",
        "email": "pushparaj12352@gmail.com",
        "gender": "female",
        "password": "$2a$10$LfXI0n619KqDJJ6MD54j0u5blMBauldZLmB8h76xUsAqUGEsJlwla",
        "address": "B15 Jai bhawani phase one bhopal",
        "phone": 9786314735,
        "parentsphone": 7100953835,
        "photo": "photorahul23.jpg",
        "documentid": "aadharahul13.jpg",
        "uid": "20240124AM01",
        "regisDate": "2024-01-24T10:11:38.648Z",
        "role": "Student",
        "__v": 0
      },
      {
        "_id": "65b0e292826a92e26538de6d",
        "name": "Shashi Kumari",
        "email": "shashiraj12352@gmail.com",
        "gender": "female",
        "password": "$2a$10$zmMYMFF4am8/A4VGoPWA9OzIDQ8mM55WoLyA91tvINmbXGV/OomEq",
        "address": "B15 Jai bhawani phase one bhopal",
        "phone": 2786314735,
        "parentsphone": 7100953835,
        "photo": "photorahul23.jpg",
        "documentid": "aadharahul13.jpg",
        "uid": "20240124GX01",
        "regisDate": "2024-01-24T10:12:34.540Z",
        "role": "Student",
        "__v": 0
      },
      {
        "_id": "65b0e3ad78698cab43f11eb5",
        "name": "Shashikala Kumari",
        "email": "shashikala@gmail.com",
        "gender": "female",
        "password": "$2a$10$6zVWRkhDZYG.X/TDgDjTc.19owAJisa1yS/4482AMck9EB9zMPdlG",
        "address": "B15 Jai bhawani phase one bhopal",
        "phone": 3786314735,
        "parentsphone": 7100953835,
        "photo": "photorahul23.jpg",
        "documentid": "aadharahul13.jpg",
        "uid": "20240124BZ98",
        "regisDate": "2024-01-24T10:17:17.135Z",
        "role": "Student",
        "__v": 0
      }
    ]

      const [students, setStudents] = useState(studentsd)

      // Add a student
      const addStudent = async (name, email, gender, password, address, phone, parentsphone, photo, documentid) => {
        //todo api call
        const response = await fetch(`${host}/students/create`, {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({name, email, gender, password, address, phone, parentsphone, photo, documentid}), // body data type must match "Content-Type" header
        });
        const json = response.json(); // parses JSON response into native JavaScript objects

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
        setStudents(students.concat(student))
      }

      // Delete a student
      const deleteStudent = (id) => {
        console.log('Deleting note with ' + id)
        const newStudentsData = students.filter((student)=> {return student._id!==id})
        setStudents(newStudentsData)
      }

      // Edit a student
      const editStudent = async (id, name, email, gender, password, address, phone, parentsphone, photo, documentid) => {
        // API call
        const response = await fetch(`${host}/students/update/${id}`, {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          headers: {
            "Content-Type": "application/json",
            "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHVkZW50cyI6eyJpZCI6IjY1YTQ0Y2JmNTVjMjc0MDkxOTM3M2IwOSIsInJvbGUiOiJBZG1pbiJ9LCJpYXQiOjE3MDYxMjQyOTN9.JmF_mbZZ-fuqAMjpm1g_g7VnIwTqP0W4EvQnfO6jRGE"
          },
          body: JSON.stringify({name, email, gender, password, address, phone, parentsphone, photo, documentid}), // body data type must match "Content-Type" header
        });
        const json = response.json(); // parses JSON response into native JavaScript objects
        // Logic to edit in client
        for(let index=0; index < students.length; index++) {
          const element = students[index];
          if (element._id === id){
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
      }

  return (
    <StudentContext.Provider value={{students, addStudent, deleteStudent, editStudent}}>
        {props.children}
    </StudentContext.Provider>
  )
}

export default StudentState



