
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_SERVICE_SSID;
const client = require("twilio")(accountSid, authToken);
const bcrypt = require('bcrypt');

const { default: mongoose } = require('mongoose');

const userhelper = require('../helpers/userhelpers');
const products=require('../model/products');
const Cart=require('../model/cart');
const Address=require('../model/address');
const Order=require('../model/orders');
// const ObjectId = mongoose.Types.ObjectId
const Products = require("../model/products");
const order = require("../model/orders");
const User = require("../model/userinfo");
const wishList = require("../model/wishList");
const Coupon=require('../model/coupons')
var paypal = require('paypal-rest-sdk');
const Wallet = require("../model/wallet");
const Banner=require('../model/banner');


paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AVkI6FlNDClgi5gxVwMX7S6363uc6I9ZAydBJ5SH_Jn8zD1dS2NZ8Tc0jijgUTVm-dSClTulSgfWTj3N',
  'client_secret': 'EIbBwiV2mZ86YLwmlBYQs0-4zYg0b-LSYQvJ6hwKtiLbQmE2a272qLCnD3khgTST2T7xCLIgzBkrjKjA'
});



var passworderr=false;
var otperr=false;
var errmsg="";
var alertmsg=false;
var couponAmount=0;

const homePage = async (req, res) => {
  try{
    const banner=await Banner.find()
    let latest=await products.find({delete:false})
       latest = latest.reverse().slice(0, 4);
       console.log(banner)
       
    res.render('user/index', { user: true,logedin:req.session.logedin,banner,latest});
  }catch(err){
    console.log("error:",err)
  }
};

const getLogin = (req, res) => {
  try
  {
    res.render('user/login',{validate:req.session.blocked,passworderr});
    passworderr=false
  }catch(err){
    console.log("error:",err)
  }
};

const postLogin=async(req,res)=>{
  const {email,password}=req.body;
  try {
    const existingUser=await User.findOne({email:email});
    if(existingUser){
      console.log(existingUser)
      const passwordMatch = await bcrypt.compare(password, existingUser.password);
      if(passwordMatch){
        if (existingUser.blocked) {
          req.session.blocked=true;
          res.redirect('/login')
        } else {
          req.session.logedin = true;
          req.session.user=existingUser;
          
          const userwallet=await Wallet.findOne({user:req.session.user._id})
          if(!userwallet){
            const wallet=new Wallet({
              user:req.session.user._id,
              amount:0
            })
            await wallet.save()
          }
          
          res.redirect('/');
        }
      }else{
        passworderr=true;
        res.redirect('/login');
      }
    }
  } catch(err){
    console.log("error:",err)
  }
}

const getSignup = (req, res) => {
  try{
    res.render('user/signup',{alertmsg,errmsg});
    errmsg=""
    alertmsg=false;
  }catch(err){
    console.log("error:",err)
  }
};

const postSignup = async (req, res) => {
    let error = userhelper.validation(req.body);
      if (error.length > 0) {
      console.log("Validation error:", error);
      errmsg=error;
      res.redirect('/signup')
      } else {
      const existingUser = await User.findOne({ email: req.body.email });
      if(existingUser){
        console.log("email already exist")
        alertmsg=true
        res.redirect('/signUp')
      }else{
       try {
        req.session.user=req.body
        const mob = req.body.phonenumber;
        console.log(req.session);
        await client.verify.v2.services(verifySid).verifications.create({
          to: `+91${mob}`,
          channel: "sms"
        });
        res.redirect('/otpvalidation')
      } catch (e) {
        console.log("error:", e);
      }
      } 
    }
  };
  
  const getOtp=(req,res)=>{
    try{
      res.render('user/otpvalidation',{otperr})
      otperr=false;
    }catch(err){
      console.log("error:",err)
    }
  }

  const otpValidate= async (req,res)=>{
    const otp=req.body.otp;
    try{
      const mob=req.session.user.phonenumber;
      let response = await client.verify.v2.services(verifySid ).verificationChecks.create({ to: `+91${mob}`, code: otp })
      if(response.status==='approved'){
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(req.session.user.password, salt);

          const user=new User({
          name:req.session.user.name,
          email:req.session.user.email,
          phone_number:req.session.user.phonenumber,
          password:hashedPassword,
          blocked:false
        });
        await user.save();  

        req.session.logedin=true;
        res.redirect('/')
      }else{
        console.log("otp validation failed")
        otperr=true
        res.redirect('/otpvalidation')
      }
    }catch(e){
      res.send("validation failed")
    }
  }


  const getMenCategory=async(req,res)=>{
    try{
      const product=await products.aggregate([{$match:{category:"MEN",delete:false}}])
      res.render('user/menpage',{user:true,logedin:req.session.logedin,product})
      console.log(product,"hhhhhhhh")
    }catch(err){
      console.log("Error:",err)
    }
  }


  const getWomenCategory=async (req,res)=>{
    try{
      const product=await products.aggregate([{$match:{category:"WOMEN",delete:false}}])
      console.log(product)
      res.render('user/womenpage',{user:true,logedin:req.session.logedin,product})
    }catch(err){
      console.log("error:",err)
    }
  }


  const getKidCategory=async (req,res)=>{
    try{
      const product=await products.aggregate([{$match:{category:"KIDS",delete:false}}])
      res.render('user/kidspage',{user:true,logedin:req.session.logedin,product})
    }catch(err){
      console.log("error:",err)
    }
  }


  const getProductDetails=async (req,res)=>{
    try{
      const id=req.params.id
      const product=await products.findOne({_id:id})
      console.log(product)
      res.render('user/product_details',{user:true,logedin:req.session.logedin,product})
    }catch(err){
      console.log("error:",err)
    }
  }


  const getCart=async (req,res)=>{
    try{
      const cartDetails=await userhelper.getCartProducts(req.session.user._id)
      const cartTotal=await userhelper.getCartTotal(req.session.user._id)

      if(cartDetails){
        res.render('user/cart',{cartDetails,cartTotal,user:true,logedin:req.session.logedin})
      }
    }catch(err){
      console.log("error:",err)
    }
  }
  


  const getAdd_Cart = async (req, res) => {
    try {
      const id = req.query.id;

      if(req.session.logedin){
        const userId = req.session.user._id;
      const Product=await Products.findOne({_id:id})
  
      const cartExist = await Cart.findOne({ user: userId });
      if (cartExist) {
        const existingProduct = cartExist.products.find(
          (product) => product.productId == id
        );
        if (existingProduct) {
          existingProduct.quantity += 1;
        } else {
          cartExist.products.push({
            productId: id,
            quantity: 1,
            offerprice:Product.offerprice
          });
        }
        await cartExist.save();

      } else {
        const newCart = new Cart({
          products: [{
            productId: id,
            quantity: 1,
            offerprice:Product.offerprice
          }],
          user: userId
        });
        await newCart.save();
      }
      res.json({ status: true });

      }else{
        res.json({status:false})
      }
      
    } catch (err) {
      console.log("Error:", err);
      res.json({ status: false, error: err });
    }
  };


  const deletFromCart=async (req,res)=>{
    try{
      const id=req.body.id
      const userId=req.session.user._id;
      
      const updatedCart = await Cart.findOneAndUpdate(
        { user: userId },
        { $pull: { products: { productId:id} } },
        { new: true }
      );

      if(updatedCart){
        res.json({ status: true });
      }
    }catch(err){
      console.log("error:",err)
    }
  }  
  
  const postQuantityManagemant=async (req,res)=>{
    try{
      const productId=req.body.id;
      let count=req.body.count;
      count=parseInt(count);
      const userId=req.session.user._id
      const cart=await Cart.findOne({user:userId})

      const product = cart.products.find(
      (item) => item.productId.toString() === productId
      );

      if (product) {
        const producDetails=await products.findOne({_id:productId})
        const stock=producDetails.stock
        if(product.quantity + count >= 1 && product.quantity + count <= stock){
          product.quantity += count;
        }
      }
      let quantity=product.quantity
      await cart.save();
      let totalamount=await userhelper.getCartTotal(req.session.user._id)
      
      res.json({status:true,quantity,totalamount});

    }catch(err){
      console.log("error:",err)
    }
  }


  const getCheckOut=async (req,res)=>{
    try{
      const userId=req.session.user._id
      const address=await Address.findOne({user:userId})
      const Total=await userhelper.getCartTotal(req.session.user._id)
      const cartDetails=await userhelper.getCartProducts(req.session.user._id)
      
      const coupon=await Coupon.find()
      
      const cartTotal=Total-couponAmount;
      const walletamount=await Wallet.findOne({user:userId})

      res.render('user/checkOut',{cartTotal,logedin:req.session.logedin,address,walletamount,coupon,cartDetails})
      couponAmount=0;
    }catch(err){
      console.log("error:",err)
    }
  }


  const postCheckOut=async (req,res)=>{
    try{
      const userId= req.session.user._id
      
      const {addressId,payment_methode}=req.body
      const address=await Address.findOne({user:req.session.user._id})
      const deliverAddress = address.address.find(item => item._id == addressId);

      let total=await userhelper.getCartTotal(req.session.user._id)
      const couponApplied=await userhelper.isCouponApplied(req.session.user._id)
      if(couponApplied){
        total=total-couponApplied
      }

      if(payment_methode=='wallet'){
        const userWallet=await Wallet.findOne({user:userId})
        if(total<=userWallet.amount){
          userWallet.amount -=total
          userWallet.save()
          const orderplace=await userhelper.orderplace(deliverAddress,req.session.user._id,total,payment_methode)
          req.session.user.orderplace=orderplace
          res.json({wallet:true})
        }else{
          res.json({wallet:false})
        }
      }

      const orderplace=await userhelper.orderplace(deliverAddress,req.session.user._id,total,payment_methode)
      req.session.user.orderplace=orderplace

      if(payment_methode=="Cash On Delivery"){
         await userhelper.orderStockManagement(userId)
         await Cart.findOneAndDelete({user:req.session.user._id})
         res.json({COD:true})
      }

      if(payment_methode=="Razor Pay"){
        const order=await userhelper.generateRazorPay(orderplace._id,total)
        res.json({order})
      }

      if(payment_methode=="Paypal"){
        try {
          const create_payment_json = {
            "intent": "sale",
            "payer": {
              "payment_method": "paypal"
            },
            "redirect_urls": {
              "return_url": "http://localhost:3000/paymentSuccess",
              "cancel_url": "http://localhost:3000/cancel"
            },
            "transactions": [{
              "item_list": {
                "items": [{
                  "name": "item",
                  "sku": "item",
                  "price": total,
                  "currency": "USD",
                  "quantity": 1
                }]
              },
              "amount": {
                "currency": "USD",
                "total": total
              },
              "description": "This is the payment description."
            }]
          };
      
            paypal.payment.create(create_payment_json, function (error, payment) {
              if (error) {
                  throw error;
              } else {
                  console.log("Create Payment Response");
                  console.log(payment);
                  for(let i=0;i<payment.links.length;i++){
                        if(payment.links[i].rel==='approval_url'){
                          res.json({ approvalUrl: payment.links[i].href });
                        }
                      }
              }
            });

          console.log("Create Payment Response");
        } catch (err) {
          console.log("error:", err);
        }
      }

    }catch(err){
      console.log("error:",err)
    }
  }

  const Paypalsuccess=(req,res)=>{
    try{
      const paymentId = req.query.paymentId;
      const payerId = req.query.PayerID;

     paypal.payment.execute(paymentId, { payer_id: payerId }, function (error, payment) {
      if (error) {
        console.log(error);
        res.redirect('/paymentFailure');
      } else {
        console.log('Payment executed successfully');
        console.log(payment);
        userhelper.orderStockManagement(req.session.user._id)
        res.send("success")
      }
     });
      }catch(err){
      console.log("error:",err)
    }
  }

  const PaypalCancel=(req,rea)=>{
    try{
      res.send("cancelled")
    }catch(err){
      console.log("error:",err)
    }
  }

  const getSuccess=async (req,res)=>{
    try{
      const deliveryDetails= req.session.user.orderplace
      delete req.session.user.orderplace;
      res.render('user/orderConfirmation', {logedin:true, deliveryDetails});
    }catch(err){
      console.log("error:",err)
    }
  }

  const getFailPage=(req,res)=>{
    try{
      res.render('user/failedPayment',{logedin:true})
    }catch(err){
      console.log("error:",err)
    }
  }


const verifypayment =(req,res)=>{
    userhelper.verifyPayment(req.body).then( ()=>{
        userhelper.updateOrder(req.body['order[receipt]']).then(async()=>{
           userhelper.orderStockManagement(req.session.user._id)
           await Cart.findOneAndDelete({user:req.session.user._id})
          res.json({ status: true })    
        });
           
    }).catch(async ()=>{
      console.log("payment failedddddddd");
      const cancelRazorPay=userhelper.cancelRazorPay(req.body['order[receipt]'])
      if(cancelRazorPay){
       res.json({status:false})
      }
 })
}


  const insertAddress=async(req,res)=>{
    try{
      console.log(req.body)
      const address=await Address.findOne({user:req.session.user._id})
      if(address){
        const pushAddress=await userhelper.pushAddress(req.body,address)
      }else{
        const address=new Address({
          user:req.session.user._id,
          address: [{
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            address:req.body.address,
            place:req.body.place,
            city:req.body.city,
            district:req.body.district,
            state:req.body.state,
            pincode:req.body.pincode,
            phone:req.body.phone,
          }]
        }); 
       await address.save();
      }
      res.redirect('/checkout')

    }catch(err){
      console.log("error:",err)
    }
  }

//  ---------User Profile--------//

  const getProfile=async(req,res)=>{
    try{
      const userId=req.session.user._id
      const Orders = await Order.find({ user: userId }).sort({ orderDate: -1 });
      console.log(Orders,"uuuuuuuu")
      const userDetail=await User.findOne({_id:userId})
      const cartCount=await userhelper.cartCount(userId)
      const orderCount=await userhelper.OrderCount(userId)
      const address=await userhelper.userAddress(userId)
      const wallet=await Wallet.findOne({user:userId})
      res.render('user/profile',{logedin:true,Orders,userDetail,cartCount,orderCount,address,wallet})
    }catch(err){
      console.log("error:",err)
    }
  }

  const postProfile=async (req,res)=>{
    try{
      const user=await userhelper.userUpdate(req.session.user._id,req.body)
      if(user){
        res.redirect('/profile')
      }
    }catch(err){
      console.log("error:",err)
    }
  }


  const OrderCancel=async(req,res)=>{
    try{
      const id=req.query.id
      await order.updateOne({_id:id},{deliveryStatus:"cancelled"})
      const stockUpdate=userhelper.stockUpdate(id)
      res.json({status:true})
    }catch(err){
      console.log("error:",err)
    }
  }

  // ----------Address----------//
  const addAddress=(req,res)=>{
    try{
      res.render('user/address',{logedin:req.session.user})
    }catch(err){
      console.log("error:",err)
    }
  }

  const postAddAddress=async(req,res)=>{
    try{
      const addAddress=await userhelper.addAddress(req.session.user._id,req.body)
      console.log(addAddress)
      res.redirect('/profile')
    }catch(err){
      console.log("error:",err)
    }
  }

  const editAddress=async(req,res)=>{
    try{
      const addresId=req.params.id
      const addressUpdate=await userhelper.addressUpdate(addresId,req.body,req.session.user._id)
      if(addressUpdate){
        res.redirect('/profile')
      }else{
        console.log("address not updated")
      }
    }catch(err){
      console.log("error:",err)
    }
  }

  const removeAddress=async (req,res)=>{
    try{
      const addressId=req.body.id
      const deleteAddress=await userhelper.deleteAddress(addressId,req.session.user._id)
      if(deleteAddress){
        res.json({status:true})
      }else{
        console.log("failed")
      }
    }catch(err){
      console.log("error:",err)
    }
  }


  // ----------OTP Login---------//

  const otpLogin=(req,res)=>{
    try{
      let validate
      res.render('user/otpLogin',{validate})
      validate=false;
    }catch(err){
      console.log("error:",err)
    }
  }


  const getLoginOtp=(req,res)=>{
    try{
      res.render("user/loginOtpValidate")
      otperr=false;
    }catch(err){
      console.log("error:",err)
    }
  }

  const postloginOtp=async(req,res)=>{
    try{
      const otp=req.body.otp;
      console.log(req.session.user)
      const mob=req.session.user.phone_number;
      let response = await client.verify.v2.services(verifySid ).verificationChecks.create({ to: `+91${mob}`, code: otp })
      if(response.status=='approved'){
        req.session.logedin=true;
        res.redirect('/')
      }else{
        otperr=true
        res.redirect('/loginOtp')
      }
    }catch(err){
      console.log("error:",err)
    }
  }


  const postOtpLogin = async (req, res) => {
    try {
        const phone = req.body.phone;
        req.session.phone_number=phone
       
        const user = await User.findOne({ phone_number: phone });
        if (user) {
            req.session.user = user;
            await client.verify.v2.services(verifySid).verifications.create({
                to: `+91${phone}`,
                channel: "sms"
            });
            res.redirect('/loginOtp');
        } else {
            validate = true;
            res.redirect('/otpLogin');
        }
    } catch (err) {
        console.log("error:", err);
    }
};

const resendOtp = async (req, res) => {
    try {
        const phone =  req.session.phone_number;
        await client.verify.v2.services(verifySid).verifications.create({
            to: `+91${phone}`,
            channel: "sms"
        });
        console.log("otp resended")
    } catch (err) {
        console.log("error:", err);
        res.status(500).json({ error: "Failed to resend OTP." });
    }
};



// ---------WishList----------//
  const addToWishList=async (req,res)=>{
    try{
      const productId=req.query.id
      const wishList=await userhelper.wishList(productId,req.session.user._id)
      if(wishList){
        res.json({status:true})
      }else{
        console.log("error")
      }
    }catch(err){
      console.log("error:",err)
    }    
  }


  const getWishList=async(req,res)=>{
    try{
      const userWishlist=await wishList.findOne({user:req.session.user._id})
      const List=userWishlist.products
  
      const productDetails = [];
     for (const productId of List) {
      const product = await Products.findOne({_id:productId.productId});
      productDetails.push(product);
     }

      res.render('user/wishList',{user:true,logedin:true,productDetails})
    }catch(err){
      console.log("error:",err)
    }
  }

  const removeWishList=async(req,res)=>{
    try{
      const id=req.body.id
      const userId=req.session.user._id

      const updatedWishList = await wishList.findOneAndUpdate(
        { user: userId },
        { $pull: { products: { productId:id} } },
        { new: true }
      );

      if(updatedWishList){
        res.json({ status: true });
      }

    }catch(err){
      console.log("error:",err)
    }
  }


  const logOut=(req,res)=>{
    try{
      req.session.logedin=false
      req.session.user=null
      res.redirect('/')
    }catch(err){
      console.log("error:",err)
    }
  }

  const addressEdit=async (req,res)=>{
    try{
      const addresId=req.params.id
      const userAddress=await Address.findOne({user:req.session.user._id})
      const address = userAddress.address.find((item) => item.id == addresId);
      res.render('user/editAddress',{user:true,logedin:true,address})
    }catch(err){
      console.log("error:",err)
    }
  }

  const postAddressEdit=async(req,res)=>{
    try{
      const body=req.body
      const addresId=req.params.id
      const userId=req.session.user._id
      const editAddress=await userhelper.addressUpdate(addresId,body,userId)
      console.log(editAddress,"asdfghjk,l")
      res.redirect('/checkout')
    }catch(Err){
      console.log("error:",Err)
    }
  }

  const applyCoupon=async(req,res)=>{
    try{
      const appliedCoupon=req.body.couponCode;
      const coupon=await Coupon.findOne({couponCode:appliedCoupon})
      const cartTotal=await userhelper.getCartTotal(req.session.user._id)
      if(coupon){
        if(cartTotal>=coupon.minLimit){
          couponAmount=(cartTotal/100)*coupon.discountPercentage
          await Cart.findOneAndUpdate({user:req.session.user._id},{
            $set:{Discount:couponAmount}
          })
          res.json({status:true})
        }else{
          res.json({status:false,minLimit:true,minimumPurchase:coupon.minLimit})
        }
      }
      else{
        res.json({status:false})
      }

    }catch(err){
      console.log("error:",err)
    }
  }


  const getOrderDetails=async(req,res)=>{
    try{
      const orderId=req.params.id;
      
      let deliveryProducts=await userhelper.deliveryProductsDetails(orderId)
      deliveryProducts=deliveryProducts[0]
      res.render('user/orderDetails',{logedin:true,deliveryProducts})
    }catch(err){
      console.log("error:",err)
    }
  }


  const returnOrder=async(req,res)=>{
    try{
      const orderId=req.query.id
      const userOrder=await Order.findOne({_id:orderId})
  
      // Make an HTTP request to the admin-side endpoint
    const response = await fetch('http://localhost:3000/admin/return-order', {
      method: 'POST', // or 'PUT', 'DELETE', etc. depending on your API
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId }), // pass the orderId in the request body
    });

    if(response){
      res.json({status:true})
    }
      
    }catch(err){
      console.log("error:",err)
    }
  }


  const getContact=(req,res)=>{
    try{
      res.render('user/contactpage')
    }catch(err){
      console.log("error:",err)
    }
  }
  

  




module.exports = {
  homePage,
  getLogin,
  postLogin,
  getSignup,
  postSignup,
  getOtp,
  otpValidate,
  getMenCategory,
  getWomenCategory,
  getKidCategory,
  getProductDetails,
  getCart,
  getAdd_Cart,
  deletFromCart,
  postQuantityManagemant,
  getCheckOut,
  postCheckOut,
  Paypalsuccess,
  PaypalCancel,
  getSuccess,
  getFailPage,
  verifypayment,
  insertAddress,
  getProfile,
  postProfile,
  OrderCancel,
  addAddress,
  postAddAddress,
  editAddress,
  removeAddress,
  otpLogin,
  postOtpLogin,
  getLoginOtp,
  postloginOtp,
  addToWishList,
  getWishList,
  removeWishList,
  logOut,
  addressEdit,
  postAddressEdit,
  resendOtp,
  applyCoupon,
  getOrderDetails,
  returnOrder,
  getContact
};
