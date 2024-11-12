// server.js

const express = require('express');
const connectDB = require('./db.js');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
// const User = require('./model/User.js'); // Import the User model
const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  };

const app = express();
app.use(express.json());
app.use(cors(corsOptions));
connectDB();
require('dotenv').config();
app.use(cookieParser()); // To parse cookies
// const userTable = require('./model/userTable.js');
const campaignTable = require('./model/campaignTable.js'); 
const customerTable = require('./model/customerTable.js');
const purchaseTable = require('./model/purchaseTable.js');
const warehouseTable = require('./model/warehouseTable.js');
const memberTable = require('./model/memberTable.js')

const port = 5000;
app.listen(port, () => {
    console.log(`app is running on ${port}`);
});


// Middleware for authentication


// new auth
const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
  
    // console.log("token is ",token)
    if (!token) {
        console.log("inside auth token undef")
        return res.redirect('/unauth')// Redirect if token is missing
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your actual secret
        req.user = decoded;
        // console.log("inside auth",req.body)
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid',redirect:"http://localhost:5000/" });
    }
};

// User Registration Route
app.post('/register', async (req, res) => {
    const { email, password, first_name,last_name,address,city, phoneNo } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await memberTable.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user without userId, which will be auto-generated
        const newUser = new memberTable({
            first_name,
            last_name,
            address,
            city,
            phoneNo,
            email,
            password: hashedPassword
        });
        console.log("New user object before save:", newUser);
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


// User Login Route
app.post('/', async (req, res) => {
    const { email, password } = req.body;
    // console.log(email,password)
    try {
        // Find the user by email
        const user = await memberTable.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
        // console.log(token)
        res.cookie('token', token, {  secure: false, maxAge: 24*3600000 ,sameSite: 'lax', // Ensures cookie is accessible in same-site requests
            path: '/', // Ensures it's available across routes
        }); // Secure should be true in production
        // Respond with a success message or user data
        res.json({ status:'ok',message: 'Login successful' , redirectTo: '/home'}); // Redirecting should typically be handled on the client side
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    } 
});

// Get recent campaign details
app.get('/home', auth, async (req, res) => {
    const userId = req.user?.userId;
    console.log(userId)
    if (!userId || req.status == 304) {
        // Redirect to '/' if userId is not present (user is not logged in)
        res.json({message:"need to log in"})
    }
    try {
        console.log("inside the /home")
        const allData = await campaignTable.find({userId:userId}).sort({ createdAt: -1 }).limit(3);
        res.json({ status: 'ok', data: allData });
        
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all books data for adding a campaign
app.get('/Add-campaign', auth,async (req, res) => {
    const userId = req.user.userId; 
    if(!userId)
    {
        return res.redirect('http://localhost:5000/')
    }

    try {
        const allData = await warehouseTable.find({});
        res.json({ status: 'ok', data: allData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Post request to add a campaign
app.post('/Add-campaign',auth, async (req, res) => {
    const userId = req.user.userId; 
    const { books, ...camp } = req.body;
    console.log("userId in post add camp ",userId)
    try {
        // Update inventory based on books
        for (const { bookId, quantity } of books) {
            const book = await warehouseTable.findOne({ bookId });
            if (book) {
                book.stockQuantity -= quantity;
                await book.save();
            } else {
                console.log(`Book with ID ${bookId} not found`);
            }
        }
        const updatedCamp = {
            ...camp, books
        }
        const campWithUserId = {...updatedCamp,userId:userId}
        // console.log(campWithUserId)
        const newCamp = new campaignTable(campWithUserId);
        await newCamp.save();
        res.json({ message: 'Inventory updated successfully', status: 'ok' });
    } catch (error) {
        res.status(500).json({ message: 'Error occurred', error: error.message });
    }
});

// Get all campaigns
app.get('/Campaign', auth,async (req, res) => {
    try {
        const userId = req.user.userId;
        const allData = await campaignTable.find({userId:userId}).sort({ createdAt: -1 });
        res.json({ status: 'ok', data: allData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get individual campaign details
app.get('/Campaign/:campaignId',auth, async (req, res) => {
    try {
        const { campaignId } = req.params;
        const campaign = await campaignTable.findOne({ campaignId });

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        const customer = await customerTable.find({});
        const purchase = await purchaseTable.find({});
        res.json({ status: 'ok', data: { campaign, customer, purchase } });
    } catch (error) {
        res.status(500).json({ message: 'Error occurred', error: error.message });
    }
});

// Post request for individual campaign purchases
app.post('/Campaign/:campaignId',auth, async (req, res) => {
    const { name, phone, custAdd, mail, books, totalAmount } = req.body;
    const campaignId = Number(req.params.campaignId);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Check if the customer exists or create a new one
        let existingCustomer = await customerTable.findOne({ phoneNumber: phone }).session(session);
        if (!existingCustomer) {
            existingCustomer = new customerTable({ name, email: mail, address: custAdd, phoneNumber: phone });
            await existingCustomer.save({ session });
        }

        // Create a new purchase entry
        const purchase = new purchaseTable({
            customerId: existingCustomer.customerId,
            campaignId,
            books,
            totalAmount,
        });
        await purchase.save({ session });

        // Update the campaign inventory
        const campaign = await campaignTable.findOne({ campaignId }).session(session);
        if (campaign) {
            books.forEach((book) => {
                const bookInCampaign = campaign.books.find((item) => item.bookId === book.bookId);
                if (bookInCampaign) {
                    bookInCampaign.quantity -= book.order;
                    if (bookInCampaign.quantity < 0) bookInCampaign.quantity = 0; // Ensure non-negative quantity
                }
            });
            await campaign.save({ session });
        } else {
            throw new Error('Campaign not found');
        }

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: 'Purchase recorded successfully', purchase });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: 'Failed to record purchase', error: error.message });
    }
});

// put req for updating camp sales, revenue, camp_ended
app.put('/Campaign/:campaignId',auth, async (req, res) => {
    const {totalSale,revenue} = req.body;
    const campaignId = Number(req.params.campaignId);
    try {
        // Update the campaign inventory
        const campaign = await campaignTable.findOne({ campaignId })
        if (campaign) {
           campaign.totalSales=revenue
           campaign.totalBooksSold=totalSale
           campaign.camp_ended=true
            await campaign.save();

            res.json({status:'ok',message:"camp updated"})
        } else {
            res.status(404).json({ status: 'error', message: 'Campaign not found' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
})
app.get('/profile',auth,async(req,res)=>{
    try {
        const userId = req.user.userId;
        const allData = await memberTable.findOne({userId:userId});
        res.json({ status: 'ok', data: allData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.post('/profile', auth, async (req, res) => {
    const userId = req.user.userId;
    const { first_name, last_name, phoneNo, address, city, email, new_password } = req.body;
  
    try {
      const updateFields = { first_name, last_name, phoneNo, address, city, email };
  
      // Hash the new password if provided
      if (new_password) {
        const hashedPassword = await bcrypt.hash(new_password, 10);
        updateFields.password = hashedPassword;
      }
  
      // Update the user in the database
      const updatedUser = await memberTable.findOneAndUpdate(
        { userId: userId },
        { $set: updateFields },
        { new: true }
      );
  
      res.json({ status: 'ok', message: 'Profile updated successfully', data: updatedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  });

  
app.post('/logout',auth,async(req,res)=>{
    res.clearCookie('token'); // Replace 'token' with the name of your cookie
  res.json({ message: 'Logged out successfully' ,status:'ok'});
})