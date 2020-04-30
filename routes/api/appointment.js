const express = require('express');
const router = express.Router();
const Appointment = require('../../models/Appointment');
const config = require('config');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const moment = require('moment');
const mongodb = require('mongodb');


//@route  POST api/appointment
//@desc   Set appointment
//@access Public
router.post('/', 

 async (req,res) => {
        
          let { name, phone, appointmentDate, appointmentTime  } = req.body;
          try{ 
              
              appointment = new Appointment({
                  name,
                  phone,
                  appointmentDate,
                  appointmentTime
              });
              
              let checkDate = await Appointment.findOne({ appointmentDate });
              let checkTime = await Appointment.findOne({ appointmentTime });
              if(checkDate && checkTime){
                return  res.status(400).json(
                  {message: "Time slot unavailable, please choose another time that works for you."}
              )
              }
              let today = new Date();
              let dd = String(today.getDate()).padStart(2, '0');
              let mm = String(today.getMonth() + 1).padStart(2, '0');
              let yyyy = today.getFullYear();

              let hour = new Date().getHours() + 2;
              let minutes =  new Date().getMinutes();
              let presentTime = hour + ":" + minutes;
              
              today = yyyy + '-' + mm + '-' + dd;
              if(appointmentDate < today){
                return  res.status(400).json(
                  {message: "Please enter a valid date"}
              )
              }

              if(appointmentDate === today && appointmentTime < presentTime){
                return  res.status(400).json(
                  {message: "Please choose a time that is at least 2 hours from now"}
              )
              }
              
               await appointment.save();
               res.json('submitted');
          } catch(err) {
               console.error(err.message);
               res.status(500).send('server error');
          }           
 }
);


// Get Appointments  took out auth right before async in arg's
router.get('/', async (req, res) => {
    try {
       const appointments = await Appointment.find().sort({ date: -1 });
       res.json(appointments);
    }
        catch (err) {
         console.log(err.message);
         res.status(500).send('server error');
    }
  });


  /* use for getting  past, current & future appointments
  const myArray = [
{appointmentDate: 55, appointmentTime: "12:05" },
{appointmentDate: 5564, appointmentTime: "18:30"},
{appointmentDate: 322, appointmentTime: "16:45"},
{appointmentDate: 12, appointmentTime: "15:05"},

]


const result = myArray.filter(word => word.appointmentDate > 13);

function compare(a, b) {
  const bandA = a.appointmentTime;
  const bandB = b.appointmentTime;

  let comparison = 0;
  if (bandA > bandB) {
    comparison = 1;
  } else if (bandA < bandB) {
    comparison = -1;
  }
  return comparison;
}

console.log(result.sort(compare));

  */

/*
router.delete('/:id', async (req, res) => {
  await Appointment.deleteOne({_id: new mongodb.ObjectID(req.params.id)})
  res.status(200).send();
  res.json({message: "deleted"});
})
*/

router.put('/:id', async (req, res) => {
  try{
   // let { name, phone, appointmentDate, appointmentTime  } = req.body;
  await Appointment.findByIdAndUpdate({_id: req.params.id }, req.body)
  res.status(200).send();
  res.json({message: "updated"});
  }   
    catch (err) {
    console.log(err.message);
    res.status(500).send('server error');
  }
})



router.delete('/:id', async (req, res) => {
  try{
  await Appointment.findByIdAndRemove({_id: req.params.id })
  res.status(200).send();
  res.json({message: "deleted"});
  }   
    catch (err) {
    console.log(err.message);
    res.status(500).send('server error');
  }
})


module.exports = router;