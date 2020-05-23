const express = require('express');
const connectDB = require('./config/db');
const moment = require('moment');
const app = express();
const PORT = process.env.PORT || 5000;


//Connect to Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false}));

app.get('/', (req,res) =>{
    res.send('API Running')
});

// Define routes
app.use('/api/appointment', require('./routes/api/appointment'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/logout', require('./routes/api/logout'));
app.use('/api/past', require('./routes/api/past'));
app.use('/api/today', require('./routes/api/today'));
app.use('/api/future', require('./routes/api/future'));
app.use('/api/admin', require('./routes/api/admin'));

// Handle production
if(process.env.NODE_ENV ==='production'){
    // set static folder
    app.use(express.static(__dirname + '/public/'));

    //handle SPA
    app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}


app.listen(PORT, ()=> {
    console.log(`Server started on ${PORT}`);
});





