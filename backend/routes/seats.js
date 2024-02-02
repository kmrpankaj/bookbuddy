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



// // Route 3: Update seats using: PATCH /seats/updateseats. Requires login
// router.patch('/updateseats/:id', fetchuser, async (req, res) => {
//     const { seatNumber, seatLocation, seatStatus } = req.body;
//     if (req.students.role !== "Admin") {
//         return res.status(403).send({ error: "Unauthorized access" });
//       }
//     //create a newSeat object
//     const newSeat = {};
//     if(seatNumber){newSeat.seatNumber = seatNumber};
//     if(seatLocation){newSeat.seatLocation = seatLocation};
//     if(seatStatus){newSeat.seatStatus = seatStatus};

//     const seat = await Seat.findByIdAndUpdate(req.params.id, {$set: newSeat}, {new:true});
//     res.json({seat});
// })

// Route 3: Update seats using: PATCH /seats/updateseats. Requires login
router.patch('/updateseats/:id', fetchuser, async (req, res) => {
    const { seatNumber, seatLocation, seatStatus } = req.body;

    // Check if the user is an admin
    if (req.students.role !== "Admin") {
        return res.status(403).send({ error: "Unauthorized access" });
    }

    // Create a newSeat object
    const newSeat = {};

    if (seatNumber) {
        newSeat.seatNumber = seatNumber;
    }

    if (seatLocation) {
        newSeat.seatLocation = seatLocation;
    }

    if (seatStatus) {
        newSeat.seatStatus = {};
        // Assuming seatStatus is an object with properties morning, afternoon, evening, night
        newSeat.seatStatus = { ...newSeat.seatStatus, ...seatStatus };
        // Define an array of time slots
        const timeSlots = ['morning', 'afternoon', 'evening', 'night'];

        // Loop through each time slot and update status if bookedBy is null
        timeSlots.forEach(slot => {
            if (!newSeat.seatStatus[slot]) {
                newSeat.seatStatus[slot] = {};
            }
            if (newSeat.seatStatus && newSeat.seatStatus[slot] && newSeat.seatStatus[slot].bookedBy === null) {
                newSeat.seatStatus[slot].status = false;
            } else {
                newSeat.seatStatus[slot].status = true;
            }
        });
    }

    try {
        const seat = await Seat.findByIdAndUpdate(req.params.id, { $set: newSeat }, { new: true });
        console.log(newSeat);
    
        // Update Students schema with seatAssigned property
       // Update Students schema with seatAssigned property
if (seat && seat.seatStatus) {
    const timeSlots = ['morning', 'afternoon', 'evening', 'night'];
  
    // Map bookedBy values to corresponding timeSlots
    const bookedByValuesWithSlots = timeSlots.map(slot => ({
      uid: seat.seatStatus[slot]?.bookedBy,
      slot,
    })).filter(Boolean);
  
    // Update corresponding students in the Students model
    if (bookedByValuesWithSlots.length > 0) {
      const studentUpdates = bookedByValuesWithSlots.map(({ uid, slot }) => ({
        uid,
        update: {
          $push: {
            'seatAssigned.bookedShifts': {
              seatNumber: seat.seatNumber,
              slot, // Use the extracted slot name here
            },
          },
        },
      }));
  
      try {
        const updatedStudents = await Promise.all(
          studentUpdates.map(async ({ uid, update }) => {
            const student = await Students.findOneAndUpdate(
              { uid },
              update,
              { new: true }
            );
            return student;
          })
        );
  
        res.json({ seat, updatedStudents });
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
    } else {
      res.json({ seat });
    }
  }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});







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