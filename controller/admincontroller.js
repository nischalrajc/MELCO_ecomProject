const User=require("../model/userinfo")
const products=require("../model/products")
const category=require('../model/category')
const Banner=require('../model/banner')
const adminhelper=require('../helpers/adminhelper')
const multer = require('multer');
const order = require("../model/orders");
const { json } = require("express");
const sharp = require('sharp');
const Coupon = require("../model/coupons");
const { getOrderDetails } = require("./usercontroller");
const Wallet = require("../model/wallet");
const moment = require('moment');



const allowedFileTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = function(req, file, cb) {
  
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {

    cb(new Error('Invalid file type. Only JPEG and PNG files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});


let message=false

const adminLogin=(req,res)=>{
    res.render('admin/login',{message})
    message=false;
}


const loginAdmin=async(req,res)=>{
    const validate=await adminhelper.validation(req.body)
    if(validate){
        req.session.admin=true
        res.redirect('/admin/user_datails')
    }else{
        message=true;
        res.redirect('/admin')
    }
}


const getUserdetail=async (req,res)=>{
    try{
        const userinfo=await User.find();
        res.render('admin/userdetail', { admin: true,userinfo });
    }catch(err){
        console.log("error",err);
    }
}

const blockUser=async(req,res)=>{
    try{
        const id=req.body.id
        await User.updateOne({_id:id},{blocked:true})
        res.json({status:true})
        console.log("user blocked successfully")
    }catch(err){
        console.log("unable to find the data");
    }
}

const unblockUser=async (req,res)=>{
    try{
        const id=req.body.id;
        await User.updateOne({_id:id},{blocked:false})
        res.json({status:true})
    }catch(err){
        console.log("err:",err);
    }
}

const getProductInfo=async (req,res)=>{
    const product=await products.find({delete:false})
    res.render('admin/productinfo',{admin:true,product})
}

const getAddproducts=async(req,res)=>{
    const Category=await category.find()
    res.render('admin/addproducts',{admin:true,Category})
}

const postAddproducts = (req, res) => {
  upload.fields([
    { name: 'image', maxCount: 3 },
    { name: 'coverImage', maxCount: 1 }
  ])(req, res, async (err) => {
    if (err) {
      console.log(err);
      return next(err);
    }

    try {
      const newProduct = new products({
        productname: req.body.product_name,
        description: req.body.description,
        price: req.body.price,
        offerprice: req.body.offer_price,
        stock: req.body.stock,
        category: req.body.category,
        images: req.files['image'].map(file => file.filename),
        coverImage: req.files['coverImage'][0].filename
      });

      await products.create(newProduct);
      res.redirect('/admin/product_info');
    } catch (error) {
      console.log(error);
    }
  });
};


const getEditproducts=async (req,res)=>{
    const id=req.params.id;
    const product=await products.findOne({_id:id})
    const Category=await category.find()
    res.render('admin/editproducts',{admin:true,product,Category})
}
  

const postEditProduct = async (req, res) => {
  const id = req.params.id;
  upload.fields([{ name: 'image', maxCount: 3 }, { name: 'coverImage', maxCount: 1 }])(req, res, async (err) => {
    try {
      const updateObject = {};
      if (req.body.product_name) {
        updateObject.productname = req.body.product_name;
      }
      if (req.body.description) {
        updateObject.description = req.body.description;
      }
      if (req.body.price) {
        updateObject.price = req.body.price;
      }
      if (req.body.offer_price) {
        updateObject.offerprice = req.body.offer_price;
      }
      if (req.body.stock) {
        updateObject.stock = req.body.stock;
      }
      if (req.body.category) {
        updateObject.category = req.body.category;
      }
      if (req.files && req.files.image && req.files.image.length > 0) {
        updateObject.images = req.files.image.map(file => file.filename);
      }
      if (req.files && req.files.coverImage && req.files.coverImage.length > 0) {
        updateObject.coverImage = req.files.coverImage[0].filename;
      }
      await products.updateOne({ _id: id }, updateObject);
      res.redirect('/admin/product_info');
    } catch (err) {
      console.log("error:", err);
    }
  });
};



const putSoftDelete=async(req,res)=>{
    try{
        const id=req.body.id
        const product=await products.updateOne({_id:id},{delete:true})
        res.json({status:true})
    }catch(err){
        console.log("error:",err)
    }
}


const getAddCategory=async(req,res)=>{
     const Category=await category.find()
    res.render('admin/category',{admin:true,Category,message})
    message=false;
}


const postAddCategory=async(req,res)=>{
    try{
        const existingcategory=await adminhelper.categoryvalidate(req.body)
        if(existingcategory){
            message=true
            res.redirect('/admin/add_category')
        }else{
            const categories=req.body.categoryname.toUpperCase()
            const Category=new category({
            name:categories
        })
            await Category.save()
            res.redirect('/admin/add_category')
        }
    }catch(error){
        console.log("error:",error)
    }
}


const getOrders=async (req,res)=>{
  try{
    const orders=await order.find().sort({ orderDate: -1 });
    console.log(orders)
    res.render('admin/orders',{admin:true,orders})
  }catch(err){
    console.log("error:",err)
  }
}


const cancelOrders=async(req,res)=>{
  try{
    const id=req.body.id
    await order.updateOne({_id:id},{deliveryStatus:"cancelled"})
    res.json({status:true})
  }catch(err){
    console.log("error:",err)
  }
}

const getOderDetail=async(req,res)=>{
  try{
    const orderId=req.params.id;

    let deliveryProducts=await adminhelper.deliveryProductsDetails(orderId)
  
   deliveryProducts=deliveryProducts[0]
    res.render('admin/orderDetails',{admin:true,deliveryProducts})
  }catch(err){
    console.log("error:",err)
  }
}

const permitOrder=async(req,res)=>{
  try{
    const orderId=req.query.id
    await order.findOneAndUpdate({_id:orderId},{$set:{deliveryStatus:"Pending"}})

    res.json({status:true})
  }catch(err){
    console.log("error:",err)
  }
}

const updateDeliveryStatus=async(req,res)=>{
  try{
     const {status,orderId}=req.body;
     await order.findOneAndUpdate({_id:orderId},{deliveryStatus:status})
     res.json({status:true})
  }catch(err){
    console.log("error:",err)
  }
}


// -----------Dashboard-------------//

const getdashboard=async (req,res)=>{
  try{
    const revenue=await adminhelper.revenue()
    const orderCount = await order.countDocuments();
    const monthlyOrder=await adminhelper.monthlyOrder()
    const productCount=await products.countDocuments();
    const monthlyRevenue=await adminhelper.monthlyRevenue()
    const weeklyRevenue=await adminhelper.calculateCurrentWeekRevenue();
    const cancelledOrder=await adminhelper.cancelledOrder();
    const cashOnDeliveryMonth=await adminhelper.cashOnDeliveryMonth();
    const payPalPerMonth=await adminhelper.payPalPerMonth();
    const  razoPayPerMonth=await adminhelper.razoPayPerMonth();
    const PayPalMonthlyRevenue= await adminhelper.calculatePayPalMonthlyRevenue()
    const razorPayMonthlyRevenue= await adminhelper.calculaterazorPayMonthlyRevenue()
    const CODMonthlyRevenue= await adminhelper.calculateCODMonthlyRevenue()

    

    res.render('admin/dashboard',{admin:true,
                                  revenue,
                                  weeklyRevenue,
                                  orderCount,
                                  productCount,
                                  monthlyRevenue: JSON.stringify(monthlyRevenue),
                                  PayPalMonthlyRevenue:JSON.stringify(PayPalMonthlyRevenue),
                                  razorPayMonthlyRevenue:JSON.stringify(razorPayMonthlyRevenue),
                                  CODMonthlyRevenue:JSON.stringify(CODMonthlyRevenue),
                                  monthlyOrder: JSON.stringify(monthlyOrder),
                                  payPalPerMonth:JSON.stringify(payPalPerMonth),
                                  razoPayPerMonth:JSON.stringify(razoPayPerMonth),
                                  cashOnDeliveryMonth: JSON.stringify(cashOnDeliveryMonth),
                                  cancelledOrder: JSON.stringify(cancelledOrder)})

  }catch(err){
    console.log("error:",err)
  }
}

// --------------Coupon----------------//

const getCoupon=async(req,res)=>{
  try{
    const coupons=await Coupon.find()
    res.render('admin/coupon',{admin:true,coupons})
  }catch(err){
    console.log("error:",err)
  }
}

const addCoupon=async(req,res)=>{
  try{
    const existingCoupon=await adminhelper.existingCouponvalidate(req.body)
        if(existingCoupon){
            message=true
            res.redirect('/admin/coupon')
        }else{
            const coupon=new Coupon({
              couponCode:req.body.couponCode,
              minLimit:req.body.minLimit,
              discountPercentage:req.body.discountPercentage,
              expireDate:req.body.expireDate,
        })
            await coupon.save()
            res.redirect('/admin/coupons')
        }

  }catch(err){
    console.log("error:",err)
  }
}

const removeCoupon=async(req,res)=>{
  try{
    const id=req.body.id
    await Coupon.findByIdAndDelete(id)
    res.json({status:true})
  }catch(err){
    console.log("error:",err)
  }
}

const editCoupon=async(req,res)=>{
  try{
    const id=req.params.id
    const coupon=await Coupon.findOne({_id:id})
    res.render('admin/editCoupon',{admin:true,coupon})
  }catch(err){
    console.log("error:",err)
  }
}

const postEditCoupon=async(req,res)=>{
  try{
   const updateCoupon=await adminhelper.updateCoupon(req.params.id,req.body)
   if(updateCoupon){
    res.redirect('/admin/coupons')
   }
  }catch(err){
    console.log("error:",err)
  }
}


const getReturnRequest=async (req,res)=>{
  try{
    let returnOrder = await order.find({ deliveryStatus: { $in: ["returning", "Returned","Ignored"] } });
    
    res.render('admin/returnRequest',{admin:true,returnOrder})
  }catch(err){
    console.log("error:",err)
  }
}


const returnRequest=async(req,res)=>{
  try{
    const { orderId } = req.body; 

    await order.findOneAndUpdate(
      { _id: orderId },
      { deliveryStatus: 'returning' },
      { new: true })
      
      res.json({status:true})

  }catch(err){
    console.log("error:",err)
  }
}

const acceptReturnRequest=async(req,res)=>{
  try{
    const orderId=req.query.id
    const orderReturn=await order.findOneAndUpdate({_id:orderId},{$set:{deliveryStatus:"Returned"}})
    console.log(orderReturn)

    const userId=orderReturn.user

    const updateWallet=await adminhelper.updateWallet(userId,orderReturn.totalamount)
    if(updateWallet){
      res.json({status:true})
    }
    
  }catch(err){
    console.log("error:",err)
  }
}

const cancelReturnRequest=async(req,res)=>{
  try{
    const orderId=req.query.id
    const orderReturn=await order.findOneAndUpdate({_id:orderId},{$set:{deliveryStatus:"Ignored"}})

    res.json({status:true})
    
  }catch(err){
    console.log("error:",err)
  }
}

const salesReport=async(req,res)=>{
  try{
    const dailyReport=await order.find({deliveryStatus:"Delivered"})
    const dailyReportTotal=await adminhelper.dailyReportTotal(dailyReport)
    const monthlyReport=await adminhelper.monthlyReport()
    const monthlyReportTotal=await adminhelper.monthlyReportTotal(monthlyReport)
    const yearlyReport=await adminhelper.yearlyReport()
    const yearlyReportTotal=await adminhelper.yearlyReportTotal(yearlyReport)
    
    res.render('admin/salesReport',{admin:true,
                                    dailyReport,
                                    dailyReportTotal,
                                    monthlyReport,
                                    monthlyReportTotal,
                                    yearlyReport,
                                    yearlyReportTotal})
  }catch(err){
    console.log("error:",err)
  }
}

const filterSales=async (req,res)=>{
  try{
    const {startDate,endDate}=req.body

    const formattedStartDate = new Date(startDate).toISOString();
      
    const parsedEndDate = new Date(endDate);
    parsedEndDate.setHours(23, 59, 59, 999);
    const formattedEndDate = parsedEndDate.toISOString();

     const orders = await order.find({
      orderDate: {
        $gte: formattedStartDate, 
        $lte: formattedEndDate, 
      },
      deliveryStatus: "Delivered", 
    });

    let overallTotal = 0;
    orders.forEach((order) => {
      overallTotal += order.totalamount;
    });

    if(orders){
      res.json({ status: true, orders: orders,overallTotal: overallTotal});
    }else{
      res.json({status:false})
    }

  }catch(err){
    console.log("error:",err)
  }
}




const banners=async(req,res)=>{
  try{
    const banner=await Banner.find()
    res.render('admin/banners',{admin:true,banner})
  }catch(err){
    console.log("error:",err)
  }
}

const addBanner=async(req,res)=>{
  try{
    res.render('admin/addBanner',{admin:true})
  }catch(err){
    console.log("error:",err)
  }
}


const postAddBanner=async(req,res)=>{
  upload.single("bannerImage")(req, res, async (err) => {
    if (err) {
      console.log(err);
      return next(err);
    }

    try {
      const body=req.body
      console.log(body)

      const banner = new Banner({
        banner_tittle:body.banner_tittle,
        description:body.description,
        images: req.file.filename
      });

      await banner.save()
      res.redirect('/admin/banners')
    } catch (error) {
      console.log(error);
    }
  });
}

const editBanner=async(req,res)=>{
  try{
    const id=req.params.id
    
    const banner=await Banner.findOne({_id:id})
    console.log(banner)
    res.render('admin/editBanner',{admin:true,banner})

  }catch(err){
    console.log("error:",err)
  }
}

const postEditBanner=(req,res)=>{
  const id = req.params.id;
  upload.single("bannerImage")(req, res, async (err) => {
    if (err) {
      console.log(err);
      return next(err);
    }

    try {
      const { banner_tittle, description } = req.body;

      const updateFields = {};

      if (banner_tittle) {
        updateFields.banner_tittle = banner_tittle;
      }

      if (description) {
        updateFields.description = description;
      }

      if (req.file) {
        updateFields.images = req.file.filename;
      }

      await Banner.findOneAndUpdate({ _id: id }, updateFields);

      res.redirect('/admin/banners');
    } catch (error) {
      console.log(error);
    }
  });
}

const removeBanner=async(req,res)=>{
  try{
    const id=req.body.id
    await Banner.findOneAndDelete({_id:id})
    res.json({status:true})
  }catch(err){
    console.log("error:",err)
  }
}

module.exports={
    adminLogin,
    loginAdmin,
    getUserdetail,
    blockUser,
    unblockUser,
    getProductInfo,
    getAddproducts,
    postAddproducts,
    getEditproducts,
    postEditProduct,
    putSoftDelete,
    getAddCategory,
    postAddCategory,
    getOrders,
    cancelOrders,
    getOderDetail,
    permitOrder,
    updateDeliveryStatus,
    getdashboard,
    getCoupon,
    addCoupon,
    removeCoupon,
    editCoupon,
    postEditCoupon,
    getReturnRequest,
    returnRequest,
    acceptReturnRequest,
    cancelReturnRequest,
    salesReport,
    filterSales,
    banners,
    addBanner,
    postAddBanner,
    editBanner,
    postEditBanner,
    removeBanner
}