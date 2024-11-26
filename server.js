const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

// Initialize Express App
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://cultureconnection01:udy0EZIQH9TclHYd@cluster0.rrita.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define Booking Schema and Model
const bookingSchema = new mongoose.Schema({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  destination: { type: String, required: true },
  checkin: { type: Date, required: true },
  checkout: { type: Date, required: true },
  rooms: { type: Number, required: true },
  adults: { type: Number, required: true },
  children: { type: Number, required: true },
});

const Booking = mongoose.model('Booking', bookingSchema);

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email provider's service (e.g., Gmail, Outlook)
  auth: {
    user: 'cultureconnection01@gmail.com', // Replace with your email
    pass: 'pxbs empr wrsf qzwb', // Replace with your email password or app password
  },
});

// Define a POST route for saving bookings
app.post('/api/bookings', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    const result = await booking.save();
    const email=result.email;
    const phone=result.phone;


    const mailOptions1 = {
        from: 'cultureconnection01@gmail.com',
        to:email ,
        subject: 'Provider Contact Details',
        text: `Booking Details:
        - Email : akshaylakhanpal0@gmail.com,
        - Phone : 7527 955 823 ,
        - Message : For further assistance, you can contact us. If you face any issues, please let us know, and we will do our best to resolve them for you. Thank you, and have a great day!
        }`
        
      };



    transporter.sendMail(mailOptions1, (err, info1) => {
        if (err) {
          console.error('Error sending email to user:', err);
        } else {
          console.log('User email sent:', info1.response);
        }})

    // Email Content
    const mailOptions = {
        from: 'cultureconnection01@gmail.com',
        to:'akshaylakhanpal0@gmail.com' ,
        subject: 'Booking Request',
        text: `Booking Details:
        - Email : ${email},
        - Phone : ${phone},
        - Destination: ${result.destination}
        - Check-in Date: ${result.checkin.toDateString()}
        - Check-out Date: ${result.checkout.toDateString()}
        - Rooms: ${result.rooms}
        - Adults: ${result.adults}
        - Children: ${result.children}`
        
      };

    // Send Email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
        return res.status(500).json({ message: 'Error occur in making booking request', error: err });
      }
      console.log('Email sent:', info.response);
      res.status(201).json({ message: 'Booking Request sent to the Provider and also check your email for further process!', booking: result });
    });
  } catch (err) {
    res.status(500).json({ message: 'Error saving booking', error: err });
  }
});

// Start the Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
