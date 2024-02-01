const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const { Seat, slotSchema } = require('../models/seats');
const { body, validationResult } = require('express-validator');
const Students = require('../models/students')

// Route 1: Get all the seats using: GET /seats/getseats. Requires login
router.get('/fetchallseats', fetchuser, async (req, res)=> {
    try {
        if (req.students.role !== "Admin") {
            return res.status(403).send({ error: "Unauthorized access" });
          }
    const seat = await Seat.find();
    res.json(seat)
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
}
})

// Route 2: Add a new seat using: POST /seats/addseats. Requires login
// router.post('/addaseat', fetchuser, [
//     body('seatNumber', 'Enter a seat number').isLength({min: 3}),
//     body('seatLocation', 'Enter a valid location').isLength({min: 3}),
//     body('seatStatus', 'Enter a boolean value').isBoolean(),
//     body('slot', 'Enter a valid location').isLength({min: 3})
// ], async (req, res)=> {
//     try {
//     const {seatNumber, seatLocation, seatStatus, slot} = req.body;
//     const errors = validationResult(req);
//     if(!errors.isEmpty()) {
//         return res.status(400).json({errors: errors.array()});
//     }
//     if (req.students.role !== "Admin") {
//         return res.status(403).send({ error: "Unauthorized access" });
//       }
//     const seat = new seats({
//         seatNumber, seatLocation, seatStatus, slot, students: req.students.id
//     })
//     const savedSeat = await seat.save();
//     res.json(savedSeat)
// } catch (error) {
//         console.error(error.message);
//         res.status(500).send("Internal Server Error");
// }
// })


// Route 2: Add a new seat using: POST /seats/addseats. Requires login
router.post('/addaseat', fetchuser, [
    body('seatNumber', 'Enter a seat number').isLength({ min: 2 }),
    body('seatLocation', 'Enter a valid location').isLength({ min: 3 }),

], async (req, res) => {
    try {
        const { seatNumber, seatLocation, seatStatus } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        if (req.students.role !== "Admin") {
            return res.status(403).send({ error: "Unauthorized access" });
        }

        // Create a new seat with slots initialized to false and bookedBy set to null
        // Create a new seat
const newSeat = new Seat({
    seatNumber,
    seatLocation,
    seatStatus: {
        morning: { status: false, bookedBy: null },
        afternoon: { status: false, bookedBy: null },
        evening: { status: false, bookedBy: null },
        night: { status: false, bookedBy: null },
    },
});

// Iterate over each slot in seatStatus
for (const slotKey in seatStatus) {
    if (seatStatus.hasOwnProperty(slotKey)) {
        const slot = seatStatus[slotKey];

        // If a student is booked for the slot, search for the student by name
        if (slot.bookedBy) {
            const student = await Students.findOne({ uid: slot.bookedBy });

            if (!student) {
                return res.status(404).json({ error: `Student '${slot.bookedBy}' not found` });
            }

            // Update the bookedBy field with the student's ID
            newSeat.seatStatus[slotKey].bookedBy = student._id;
            newSeat.seatStatus[slotKey].status = true;
        } else {
            newSeat.seatStatus[slotKey].status = false;
        }
    }
}
        // Save the new seat to the database
        const savedSeat = await newSeat.save();

        res.json(savedSeat);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});



// Route 3: Update seats using: PATCH /seats/updateseats. Requires login
router.patch('/updateseats/:id', fetchuser, async (req, res) => {
    const { seatNumber, seatLocation, seatStatus, slot } = req.body;
    if (req.students.role !== "Admin") {
        return res.status(403).send({ error: "Unauthorized access" });
      }
    //create a newSeat object
    const newSeat = {};
    if(seatNumber){newSeat.seatNumber = seatNumber};
    if(seatLocation){newSeat.seatLocation = seatLocation};
    if(seatStatus){newSeat.seatStatus = seatStatus};
    if(slot){newSeat.slot = slot};

    const seat = await seats.findByIdAndUpdate(req.params.id, {$set: newSeat}, {new:true});
    res.json({seat});
})

// Route 3: Delete seats using: DELETE /seats/deleteseats. Requires login
router.delete('/deleteseats/:id', fetchuser, async (req, res) => {
    try{
        if (req.students.role !== "Admin") {
            return res.status(403).send({ error: "Unauthorized access" });
          }
          let seat = await seats.findById(req.params.id)
          if(seat == null) {
              return res.status(404).json({ message: 'Cannot find seat'})
          }
       seat = await seats.deleteOne()
        res.json({message: 'Seat Deleted', seat: seat})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

module.exports = router