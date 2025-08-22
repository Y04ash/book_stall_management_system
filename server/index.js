// server.js

const express = require('express');
const connectDB = require('./db.js');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
// const User = require('./model/User.js'); // Import the User model


const app = express();
app.use(express.json());

connectDB();
require('dotenv').config();
app.use(cookieParser()); // To parse cookies
// const userTable = require('./model/userTable.js');
const campaignTable = require('./model/campaignTable.js'); 
const customerTable = require('./model/customerTable.js');
const purchaseTable = require('./model/purchaseTable.js');
const warehouseTable = require('./model/warehouseTable.js');
const memberTable = require('./model/memberTable.js')
const Warehouse = require('./model/warehouseTable.js');
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`app is running on ${port}`);
});

app.set('trust proxy', 1);
const allowed = (process.env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true); // allow Postman/cURL
    return cb(null, allowed.includes(origin));
  },
  credentials: true
}));
// Middleware for authentication
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
// new auth
const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
  
    // console.log("token is ",token)
    if (!token) {
        // console.log("inside auth token undef")
        return res.redirect('/unauth')// Redirect if token is missing
    }
 
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your actual secret
        req.user = decoded;
        // console.log("inside auth",req.body)
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid',redirect: `${BASE_URL}/` }); // Redirect if token is invalid
    }
};

// User Registration Route
app.post('/register', async (req, res) => {
    const { email, password, first_name,last_name,address,city, phoneNo,gender,state } = req.body;

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
            password: hashedPassword,
            gender,
            state,
        });
        // console.log("New user object before save:", newUser);
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


// User Login Route
app.post('/login', async (req, res) => {
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
// Enhanced /home route with comprehensive analytics
app.get('/home', auth, async (req, res) => {
  const userId = req.user?.userId;
  // console.log("userId in /home", userId);

  if (!userId) {
    return res.json({ message: "need to log in" });
  }

  try {
    // console.log("inside the /home");
    const user = await memberTable.findOne({ userId });
    // 1. Recent 3 campaigns
const recentCampaigns = await campaignTable.find({ userId })
  .sort({ startDate: -1 }) // descending order (newest → oldest)
  .limit(3);


    const campaigns = await campaignTable.find({ userId }).sort({ createdAt: -1 });
    const campaignIds = campaigns.map(c => c.campaignId);

    // --------------------------
    // Enhanced Analytics Aggregations
    // --------------------------

    // Total revenue across all user campaigns
    const totalRevenueResult = await purchaseTable.aggregate([
      { $match: { campaignId: { $in: campaignIds } } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
    ]);

    // Total products sold across all campaigns
    const totalProductsSoldResult = await purchaseTable.aggregate([
      { $match: { campaignId: { $in: campaignIds } } },
      { $unwind: "$products" },
      { $group: { _id: null, totalProductsSold: { $sum: "$products.order" } } }
    ]);

    // Total unique customers engaged across all campaigns
    const totalCustomersResult = await purchaseTable.aggregate([
      { $match: { campaignId: { $in: campaignIds } } },
      { $group: { _id: "$customerId" } },
      { $count: "totalCustomers" }
    ]);

    // Campaign-wise revenue for growth calculation
    const campaignWiseRevenue = await purchaseTable.aggregate([
      { $match: { campaignId: { $in: campaignIds } } },
      { $group: { _id: "$campaignId", revenue: { $sum: "$totalAmount" } } }
    ]);

    // Campaign-wise sales
    const campaignWiseSales = await purchaseTable.aggregate([
      { $match: { campaignId: { $in: campaignIds } } },
      { $unwind: "$products" },
      { $group: { _id: "$campaignId", productsSold: { $sum: "$products.order" } } }
    ]);

    // Category-wise analytics
    const categoryAnalytics = await purchaseTable.aggregate([
      { $match: { campaignId: { $in: campaignIds } } },
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.category",
          totalRevenue: { $sum: { $multiply: ["$products.price", "$products.order"] } },
          totalProductsSold: { $sum: "$products.order" },
          averagePrice: { $avg: "$products.price" }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    // Sub-category analytics
    const subCategoryAnalytics = await purchaseTable.aggregate([
      { $match: { campaignId: { $in: campaignIds } } },
      { $unwind: "$products" },
      {
        $group: {
          _id: {
            category: "$products.category",
            subCategory: "$products.subCategory"
          },
          totalRevenue: { $sum: { $multiply: ["$products.price", "$products.order"] } },
          totalProductsSold: { $sum: "$products.order" }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 } // Top 10 sub-categories
    ]);

    // Monthly sales trend (last 12 months)
    const monthlyTrends = await purchaseTable.aggregate([
      { $match: { campaignId: { $in: campaignIds } } },
      {
        $group: {
          _id: {
            year: { $year: "$purchaseDate" },
            month: { $month: "$purchaseDate" }
          },
          revenue: { $sum: "$totalAmount" },
          productsSold: { $sum: "$products.order" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 }
    ]);

    // Top performing products
    const topProducts = await purchaseTable.aggregate([
      { $match: { campaignId: { $in: campaignIds } } },
      { $unwind: "$products" },
      {
        $group: {
          _id: {
            productId: "$products.productId",
            name: "$products.name"
          },
          totalSold: { $sum: "$products.order" },
          revenue: { $sum: { $multiply: ["$products.price", "$products.order"] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);
    // console.log(topProducts)

    // Calculate sales growth 
    let salesGrowth = null;
    let salesGrowthPercentage = 0;
    
    if (campaigns.length >= 2) {
      const latestCampaign = campaigns[0];
      const previousCampaign = campaigns[1];
      
      const latestRevenue = campaignWiseRevenue.find(r => r._id === latestCampaign.campaignId)?.revenue || 0;
      const previousRevenue = campaignWiseRevenue.find(r => r._id === previousCampaign.campaignId)?.revenue || 0;
      
      if (previousRevenue > 0) {
        salesGrowthPercentage = ((latestRevenue - previousRevenue) / previousRevenue) * 100;
        salesGrowth = {
          latest: latestRevenue,
          previous: previousRevenue,
          percentage: salesGrowthPercentage,
          isPositive: salesGrowthPercentage >= 0
        };
      }
    }

    // Map campaign data for charts in reverse order
// Sort after processing with JS
const campaignData = campaigns.map(c => {
  const revenueObj = campaignWiseRevenue.find(r => r._id === c.campaignId);
  const salesObj   = campaignWiseSales.find(s => s._id === c.campaignId);

  return {
    campaignId: c.campaignId,
    campaignName: c.campaignName,
    revenue: revenueObj?.revenue || 0,
    productsSold: salesObj?.productsSold || 0,
    location: c.location,
    startDate: c.startDate,
    isEnded: c.camp_ended
  };
}).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    // Count ongoing/ended
    const ongoingCampaigns = campaigns.filter(c => c.camp_ended === false).length;
    const endedCampaigns = campaigns.filter(c => c.camp_ended === true).length;

    // Format monthly trends for frontend
    const formattedMonthlyTrends = monthlyTrends.map(trend => ({
      month: `${trend._id.year}-${String(trend._id.month).padStart(2, '0')}`,
      revenue: trend.revenue,
      productsSold: trend.productsSold
    }));

    // Format category data for charts
    const categoryChartData = categoryAnalytics.map(cat => ({
      category: cat._id || 'Uncategorized',
      revenue: cat.totalRevenue,
      productsSold: cat.totalProductsSold,
      averagePrice: Math.round(cat.averagePrice * 100) / 100
    }));

    // Format sub-category data
    const subCategoryChartData = subCategoryAnalytics.map(subCat => ({
      name: `${subCat._id.category} - ${subCat._id.subCategory}`,
      category: subCat._id.category,
      subCategory: subCat._id.subCategory,
      revenue: subCat.totalRevenue,
      productsSold: subCat.totalProductsSold
    }));

    // Format top products data
const topProductsData = topProducts.map(product => ({
  title: product._id.name || `Product ID: ${product._id.productId}`,
  productId: product._id.productId,
  totalSold: product.totalSold,
  revenue: product.revenue
}));


    // --------------------------
    // Final Enhanced Response
    // --------------------------
    // console.log("cam data ",campaignData)
    res.json({
      status: "ok",
      recentCampaigns,
      name:user.first_name,
      data: {
        // Basic metrics
        totalRevenue: totalRevenueResult[0]?.totalRevenue || 0,
        totalProductsSold: totalProductsSoldResult[0]?.totalProductsSold || 0,
        totalCustomers: totalCustomersResult[0]?.totalCustomers || 0,
        ongoingCampaigns,
        endedCampaigns,
        
        // Growth metrics
        salesGrowth,
        
        // Chart data
        campaignData,
        categoryAnalytics: categoryChartData,
        subCategoryAnalytics: subCategoryChartData,
        monthlyTrends: formattedMonthlyTrends,
        topProducts: topProductsData,

        // Additional insights
        totalCampaigns: campaigns.length,
        averageRevenuePerCampaign: campaigns.length > 0 ? 
          Math.round((totalRevenueResult[0]?.totalRevenue || 0) / campaigns.length) : 0,
        averageProductsPerCampaign: campaigns.length > 0 ? 
          Math.round((totalProductsSoldResult[0]?.totalProductsSold || 0) / campaigns.length) : 0
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// get individual analytics

// Analytics endpoint
// app.get("/campaign/:campaignId/analytics", async (req, res) => {
//   try {
//     const { campaignId } = req.params;
//     const numericCampaignId = parseInt(campaignId); // Ensure correct type

//     // -------- TOTAL SALES for this campaign --------
//     const totalSalesAgg = await purchaseTable.aggregate([
//       { $match: { campaignId: numericCampaignId } },
//       { $group: { _id: null, total: { $sum: "$totalAmount" } } }
//     ]);
//     const totalSales = totalSalesAgg.length > 0 ? totalSalesAgg[0].total : 0;

//     // -------- TOTAL BOOKS SOLD in this campaign --------
//     const totalBooksSoldAgg = await purchaseTable.aggregate([
//       { $match: { campaignId: numericCampaignId } },
//       { $unwind: "$books" },
//       { $group: { _id: null, totalBooks: { $sum: "$books.order" } } }
//     ]);
//     const totalBooksSold = totalBooksSoldAgg.length > 0 ? totalBooksSoldAgg[0].totalBooks : 0;

//     // -------- TOTAL CUSTOMERS for this campaign (distinct customers) --------
//     const totalCustomers = await purchaseTable.distinct("customerId", { campaignId: numericCampaignId });
//     const totalCustomerCount = totalCustomers.length;

//     // -------- ACTIVE CAMPAIGNS (not just this one) --------
//     const activeCampaigns = await campaignTable.countDocuments({ camp_ended: false });

//     // -------- RECENT PURCHASES for this campaign --------
//     const recentPurchases = await purchaseTable.find({ campaignId: numericCampaignId })
//       .sort({ purchaseDate: -1 })
//       .limit(5)
//       .populate("customerId");

//     // -------- RECENT CAMPAIGNS across system --------
//     const recentCampaigns = await campaignTable.find()
//       .sort({ startDate: -1 })
//       .limit(5);

//     res.json({
//       campaignId: numericCampaignId,
//       totalSales,
//       totalBooksSold,
//       totalCustomers: totalCustomerCount,
//       activeCampaigns,
//       recentPurchases,
//       recentCampaigns,
//       status: "ok"
//     });
//   } catch (err) {
//     console.error("Error fetching analytics:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });
app.get("/campaign/:campaignId/analytics", async (req, res) => {
  try {
    const { campaignId } = req.params;
    const numericCampaignId = parseInt(campaignId);

    // -------- Totals --------
    const purchases = await purchaseTable.find({ campaignId: numericCampaignId });

    const totalProducts = purchases.reduce((acc, p) => {
      return acc + p.products.reduce((sum, b) => sum + (b.order || 0), 0);
    }, 0);

    const productMap = {};
    const categoryMap = {};
    const subCategorySet = new Set();
    let totalRevenue = 0;

    purchases.forEach(p => {
      totalRevenue += p.totalAmount;

      p.products.forEach(b => {
        // Top Products
        const key = b.productId;
        if (!productMap[key]) {
          productMap[key] = { ...b, totalSold: 0, revenue: 0 };
        }
        productMap[key].totalSold += b.order || 0;
        productMap[key].revenue += (b.price || 0) * (b.order || 0);

        // Category-wise
        if (b.category) {
          if (!categoryMap[b.category]) {
            categoryMap[b.category] = { category: b.category, productsSold: 0, revenue: 0 };
          }
          categoryMap[b.category].productsSold += b.order || 0;
          categoryMap[b.category].revenue += (b.price || 0) * (b.order || 0);
        }

        // Subcategories
        if (b.subCategory) {
          subCategorySet.add(b.subCategory);
        }
      });
    });

    const uniqueTitles = Object.keys(productMap).length;
    const categories = Object.values(categoryMap);
    const subcategories = subCategorySet.size;



    // -------- Top Products --------
    const topProducts = Object.values(productMap).sort((a, b) => b.totalSold - a.totalSold);

    // -------- Total Customers --------
    const customerIds = new Set(purchases.map(p => p.customerId));
    const totalCustomers = customerIds.size;

    res.json({
      totals: {
        totalProducts,
        uniqueTitles,
        categories: categories.length,
        subcategories,
        totalRevenue,
        totalCustomers
      },
      topProducts,
      categoryWise: categories,
      status: "ok"
    });
  } catch (err) {
    console.error("Error fetching analytics:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});




// Get all books data for adding a campaign
app.get('/Add-campaign', auth,async (req, res) => {
  try {
      const userId = req.user.userId; 
      const warehouse = await warehouseTable.findOne({userId})
        const products = warehouse.products || [];
        res.json({ status: 'ok', data: products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Post request to add a campaign
app.post('/Add-campaign',auth, async (req, res) => {
  try {
      const userId = req.user.userId; 
      const { products, ...camp } = req.body;
      // console.log("userId in post add camp ",userId)
        // Update inventory based on products
        const warehouse = await warehouseTable.findOne({ userId });
        for (const { productId, quantity } of products) {
          const pro = warehouse.products.find((p) => p.productId === productId);
          if (pro) {
              pro.stockQuantity -= quantity;
              await warehouse.save();
          } 
        }
        const updatedCamp = {
            ...camp, products
        }
        const campWithUserId = {...updatedCamp,userId:userId}
        // console.log(campWithUserId)
        const newCamp = new campaignTable(campWithUserId);
        // console.log("new camp ", newCamp);
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
app.get('/campaign/:campaignId',auth, async (req, res) => {
    try {
        const { campaignId } = req.params;
const userId = req.user.userId;
        const campaign = await campaignTable.findOne({ campaignId: Number(campaignId),userId });
        // console.log(campaignId)
        // console.log("campaign is ",campaign)
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        const customer = await customerTable.find({}).sort({ _id: -1 });
        const purchase = await purchaseTable.find({campaignId: campaignId}).sort({ _id: -1 });
        // console.log("init ", result.data.campaign);
        res.json({ status: 'ok', data: { campaign, customer, purchase } });
    } catch (error) {
        res.status(500).json({ message: 'Error occurred', error: error.message });
    }
});

// Post request for individual campaign purchases
app.post('/Campaign/:campaignId',auth, async (req, res) => {
    const { name, phone, custAdd, mail, products, totalAmount } = req.body;
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
            products,
            totalAmount,
        });
        await purchase.save({ session });

        // Update the campaign inventory
        const campaign = await campaignTable.findOne({ campaignId }).session(session);
        if (campaign) {
            products.forEach((product) => {
                const productInCampaign = campaign.products.find((item) => item.productId === product.productId);
                if (productInCampaign) {
                    productInCampaign.quantity -= product.order;
                    if (productInCampaign.quantity < 0) productInCampaign.quantity = 0; // Ensure non-negative quantity
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

// delete purchase
app.delete('/purchase/:purchaseId', auth, async (req, res) => {
  const { purchaseId } = req.params;
  try {
    // Find the purchase record
    const purchase = await purchaseTable.findOne({ purchaseId: Number(purchaseId) });
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    // For each product in the purchase, increment its quantity in the campaign's inventory
    for (const product of purchase.products) {
      await campaignTable.updateOne(
        { campaignId: purchase.campaignId, "products.productId": product.productId },
        { $inc: { "products.$.quantity": product.order } }
      );
    }

    // Delete the purchase record
    await purchaseTable.deleteOne({ purchaseId: Number(purchaseId) });

    res.json({ status: "ok", message: "Purchase deleted and inventory updated" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting purchase", error: error.message });
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
    const { first_name, last_name, phoneNo, address, city, email, new_password, gender } = req.body;

    try {
      const updateFields = { first_name, last_name, phoneNo, address, city, email, gender };

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

  // Create warehouse (with products)
// Create or update warehouse
// app.post("/createWarehouse",auth, async (req, res) => {
//   try {
//     const userId = req.user.userId; // assuming JWT middleware
//     const { warehouseName, products } = req.body;
//     // console.log(products)

//     let warehouse = await Warehouse.findOne({userId:userId});

//     if (!warehouse) {
//       // Create new warehouse
//       warehouse = new Warehouse({
//         userId,
//         warehouseName,
//         products
//       });
//       await warehouse.save();
//       return res.status(201).json({ message: "Warehouse created successfully", warehouse });
//     }

//     // Update case → merge product updates
//     products.forEach(p => {
//       const existing = warehouse.products.find(prod => prod.productName === p.productName);
//       if (existing) {
//         // Update quantity only
//         if (p.quantity) existing.quantity = p.quantity;
//         if(p.price) existing.price = p.price
//         if(p.description) existing.description = p.description;
//         if(p.subcategory) existing.subcategory = p.subcategory;
//         if(p.category) existing.category = p.category;
//         if(p.tags) existing.tags = p.tags;
//       } else {
//         // Add new product
//         warehouse.products.push(p);
//       }
//     });

//     await warehouse.save();
//     res.status(200).json({ message: "Warehouse updated successfully", warehouse, status: "ok" });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// });
// app.post('/createWarehouse', auth, async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const {  products } = req.body;

//     let warehouse = await Warehouse.findOne({ userId });

//     if (!warehouse) {
//       // First time → just insert, auto-increment will handle productId
//       warehouse = new Warehouse({
//         userId,
//         // warehouseName,
//         products
//       });
//     } else {
//       // Merge case
//       let currentCount = warehouse.products.length;
//       products.forEach((p, idx) => {
//       p.productId = currentCount + idx + 1;
//       warehouse.products.push(p);
//       console.log("New product added:", p);
//       // Existing product → update
//       // const existing = warehouse.products.find(prod => prod.productId === p.productId);
//     });
      
//     }

//     await warehouse.save();

//     res.status(201).json({ message: "Warehouse saved successfully", warehouse,status:"ok" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// });
app.post('/createWarehouse', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { products } = req.body;

    let warehouse = await Warehouse.findOne({ userId });

    if (!warehouse) {
      // First insert → assign sequential productIds starting from 1
      warehouse = new Warehouse({
        userId,
        products: products.map((p, idx) => ({
          ...p,
          productId: idx + 1
        }))
      });
    } else {
      // Merge case
      let lastProductId = warehouse.products.length > 0
        ? warehouse.products[warehouse.products.length - 1].productId
        : 0;

      // Existing product names (case-insensitive)
      const existingNames = warehouse.products.map(p => p.name.toLowerCase());

      products.forEach((p) => {
        if (!existingNames.includes(p.name.toLowerCase())) {
          lastProductId += 1;   // ✅ use last id + 1
          p.productId = lastProductId;
          warehouse.products.push(p);
          // console.log("New product added:", p);
        } else {
          // console.log("Skipped duplicate:", p.name);
        }
      });
    }

    await warehouse.save();

    res.status(201).json({
      message: "Warehouse saved successfully",
      warehouse,
      status: "ok"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});


app.delete('/deleteProduct/:productId',auth, async (req, res) => {
  try {
        const userId = req.user.userId;
        const { productId } = req.params;


    let warehouse = await Warehouse.findOne({ userId });

    // const warehouse = await Warehouse.findById(warehouseId);

    if (!warehouse) return res.status(404).json({ message: "Warehouse not found" });

    warehouse.products = warehouse.products.filter(p => p.productId !== Number(productId));

    await warehouse.save();
    res.json({ message: "Product deleted", warehouse });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});
// ✅ Update a product inside a warehouse
app.put('/updateProduct/:productId', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;
    const updateData = req.body;

    const warehouse = await Warehouse.findOne({ userId });
    if (!warehouse) {
      return res.status(404).json({ status: "error", message: "Warehouse not found" });
    }

    const product = warehouse.products.find(p => p.productId === Number(productId));
    // console.log("product ",warehouse.products)
    if (!product) {
      return res.status(404).json({ status: "error", message: "Product not found" });
    }

    // Update product fields
    Object.assign(product, updateData);

    await warehouse.save();
    res.json({ status: "ok", message: "Product updated", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server Error", error: err.message });
  }
});

// Get warehouse for user
app.get('/getWarehouse', auth,async (req, res) => {
  try {
    const userId = req.user.userId;
    // console.log(userId)
    const warehouse = await Warehouse.findOne({userId:userId});
    // console.log(warehouse)
    if (!warehouse) {
      return res.json({message: "No warehouse found for this user", status: "not found" });
    }

    res.json({data:warehouse, status: "ok"});
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});
app.post('/logout',auth,async(req,res)=>{
    res.clearCookie('token'); // Replace 'token' with the name of your cookie
  res.json({ message: 'Logged out successfully' ,status:'ok'});
})