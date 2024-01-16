const express = require('express')
const router = express.Router()
const Students = require('../models/students')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const JWT_SECRET = 'Myapplication1sNi$e'
var jwt = require('jsonwebtoken')
var fetchuser = require('../middleware/fetchuser');


// Getting all
router.get('/', fetchuser, async (req, res) => {
    try{
        if (req.students.role !== "Admin") {
            return res.status(403).send({ error: "Unauthorized access" });
          }
        const students = await Students.find()
        res.json(students)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})
// Getting one
router.get('/:id', getStudents, (req, res) => {
    res.send(res.students.name)
})
// Route 2: Creating one
router.post('/', async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    const students = new Students({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
        address: req.body.address,
        phone: req.body.phone,
        parentsphone: req.body.parentsphone,
        photo: req.body.photo,
        documentid: req.body.documentid,
        uid: req.body.uid,
        regisDate: req.body.regisDate,
        role: req.body.role
    })
    const data = {
        students: {
            id: students.id
        }
    }
    const authToken = jwt.sign(data, JWT_SECRET)
    try{
        const [user, phone] = await Promise.all([Students.findOne({ email: req.body.email }), Students.findOne({ phone: req.body.phone })]);
        if(user || phone) {
            return user ? res.status(400).json({ error: "Sorry, a user with this email already exists." }) : phone ? res.status(400).json({ error: "Sorry, a user with this phone number already exists." }) : "";
        }
        const newStudents = await students.save()
        res.status(201).json(newStudents)
    } catch (err){
        res.status(400).json({message: err.message})
    }
})
// Updating one
router.patch('/:id', getStudents, async (req, res) => {

    if(req.body.name != null) {
        res.students.name = req.body.name
    }
    if(req.body.email != null){
        res.students.email = req.body.email
    }
    if(req.body.regisDate != null) {
        res.students.regisDate = req.body.regisDate
    }

    try {
        const updatedStudents = await Students.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        res.json(updatedStudents)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})
// Deleting one
router.delete('/:id', fetchuser, getStudents, async (req, res) => {
    try{
        if (req.students.role !== "Admin") {
            return res.status(403).send({ error: "Unauthorized access" });
          }
        await res.students.deleteOne()
        res.json({message: 'Deleted Student'})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

async function getStudents(req, res, next) {
    let students
    try {
        students = await Students.findById(req.params.id)
        if(students == null) {
            return res.status(404).json({ message: 'Cannot find student'})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
    res.students = students
    next()
}

// Route 2: Authenticate a user using /students/login
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cant be blank').exists(),
], async (req, res) => {
    // if there are errors, return bad request and the errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const {email,password} = req.body
    try {
        let user = await Students.findOne({email});
        if(!user){
            return res.status(400).json({error: "Please try to login with correct credentials."})
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            return res.status(400).json({error: "Please try to login with correct credentials."})
        }

        const data = {
            students: {
                id: user.id,
                role: user.role
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({authToken});

    } catch (error) {
        res.status(500).send("Internal server error")
    }
})

// Route 3: Get logged in user details /students/getuser. Requires login
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.students.id;
        const user = await Students.findById(userId).select("-password")
        res.json({user});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: error.message})
    }
})



module.exports = router
