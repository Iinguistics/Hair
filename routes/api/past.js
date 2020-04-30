const express = require('express');
const router = express.Router();
const Appointment = require('../../models/Appointment');
const config = require('config');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const moment = require('moment');


router.get('/', async (req, res) => {
  try {
     const appointments = await Appointment.find().sort();

     let today = new Date();
     let dd = String(today.getDate()).padStart(2, '0');
     let mm = String(today.getMonth() + 1).padStart(2, '0');
     let yyyy = today.getFullYear();

     let hour = new Date().getHours() + 2;
     let minutes =  new Date().getMinutes();
     let presentTime = hour + ":" + minutes;
     
     today = yyyy + '-' + mm + '-' + dd;
     
     const result = appointments.filter(date => date.appointmentDate < today);

     function compare(a, b) {
      const dateA = a.appointmentDate;
      const dateB = b.appointmentDate;
      let comparison = 0;
      if (dateA > dateB) {
        comparison = 1;
      } else if (dateA < dateB) {
        comparison = -1;
      }
      return comparison;
    }

     result.sort(compare)
    
     
     res.json(result);
     console.log(today);
     
  }
      catch (err) {
       console.log(err.message);
       res.status(500).send('server error');
  }
});


module.exports = router;