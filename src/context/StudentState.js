import StudentContext from './StudentContext'
import React, { useState } from 'react'

const StudentState = (props) => {
  const host = process.env.REACT_APP_BACKEND_URL;
    const studentsd = []

      const [students, setStudents] = useState(studentsd)


// Get all students
const getAllStudents = async () => {
  try {
    const response = await fetch(`${host}/students/showall/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token'), // Replace with your actual auth token
      },
    });
    const json = await response.json();
    setStudents(json);
  } catch (error) {
    console.error("Error fetching all students:", error);
    // Handle the error, you might want to set an error state or display a message to the user
  }
};



// get one studentprofile
const getOneStudent = async () => {
  try {
    const response = await fetch(`${host}/students/student-data/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token'), // Replace with your actual auth token
      },
    });
    const studentsData = await response.json();
    return studentsData;
  } catch (error) {
    console.error("Error fetching all students:", error);
    // Handle the error, you might want to set an error state or display a message to the user
  }
};


// Add students

const addStudent = async (name, email, gender, password, address, phone, parentsphone, photo, documentid, role) => {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('gender', gender);
  formData.append('password', password);
  formData.append('address', address);
  formData.append('phone', phone);
  formData.append('parentsphone', parentsphone);

  // Check if photo and documentid are files and append them if they are
  if (photo instanceof File) {
    formData.append('photo', photo, photo.name);
  }
  if (documentid instanceof File) {
    formData.append('documentid', documentid, documentid.name);
  }

  formData.append('role', role);

  try {
    const response = await fetch(`${host}/students/create/`, {
      method: "POST",
      body: formData, // No headers needed, FormData is automatically detected
    });

    const json = await response.json();

    if (!response.ok) {
      console.log(response, 'hello res')
      throw new Error(`HTTP error! status: ${response.status}, message: ${json.message}`);
    }
    
    // Since we cannot directly get the photo and documentid paths from the response here,
    // assuming the server response includes the new student data with file paths
    const student = json.newStudents; // Adjust based on actual response structure
    setStudents(prevStudents => [...prevStudents, student]);
    return response;
  } catch (error) {
    console.error("Error adding student:", error);
    return { success: false, message: error.message };
  }
}


// Add a student copy
// const addStudent = async (name, email, gender, password, address, phone, parentsphone, photo, documentid, role) => {
//   try {
//     const response = await fetch(`${host}/students/create/`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ name, email, gender, password, address, phone, parentsphone, photo, documentid, role }),
//     });
//     if (!response.ok) { // Check if the response status code is not successful
//       throw new Error(`HTTP error! status: ${response.status}`); // Throw an error with the status
//     }
//     const json = await response.json();

//     const student = {
//       "name": name,
//       "email": email,
//       "gender": gender,
//       "password": password,
//       "address": address,
//       "phone": phone,
//       "parentsphone": parentsphone,
//       "photo": photo,
//       "documentid": documentid,
//       "role": role,
//     };
//     setStudents([...students, student]);
//     return response;
//   } catch (error) {
//     console.error("Error adding student:", error);
//     return { success: false, message: error.message };
//   }
// }

      // Delete a student
      const deleteStudent = async (id) => {
        try {
          const response = await fetch(`${host}/students/delete/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem('token')
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
const editStudent = async (id, name, email, gender, password, address, phone, parentsphone, photo, documentid, role, accountStatus) => {
  try {
    const response = await fetch(`${host}/students/update/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token'), // Replace with your actual auth token
      },
      body: JSON.stringify({ name, email, gender, password, address, phone, parentsphone, photo, documentid, role, accountStatus }),
    });
    const json = await response.json();
    let newStudents = JSON.parse(JSON.stringify(students))
    // Logic to edit in client
    for (let index = 0; index < students.length; index++) {
      const element = newStudents[index];
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
        element.role = role;
        element.accountStatus = accountStatus;
        break;
      }
    }
    setStudents(newStudents)
  } catch (error) {
    console.error("Error editing student:", error);
    // Handle the error
  }
};

// Edit a student's account status
const editStudentAccountStatus = async (id, accountStatus) => {
  try {
    const response = await fetch(`${host}/students/update/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token'), // Replace with your actual auth token
      },
      body: JSON.stringify({ accountStatus }), // Send only the accountStatus field
    });

    if (response.ok) {
      // Assuming the response is successful, you can update the client-side state
      let newStudents = JSON.parse(JSON.stringify(students));

      for (let index = 0; index < students.length; index++) {
        const element = newStudents[index];
        if (element._id === id) {
          element.accountStatus = accountStatus; // Update only the accountStatus field
          break;
        }
      }

      setStudents(newStudents);
    } else {
      console.error("Error editing student:", response.statusText);
      // Handle the error
    }
  } catch (error) {
    console.error("Error editing student:", error);
    // Handle the error
  }
};

  return (
    <StudentContext.Provider value={{students, addStudent, deleteStudent, editStudent, getAllStudents, editStudentAccountStatus, getOneStudent}}>
        {props.children}
    </StudentContext.Provider>
  )
}

export default StudentState



