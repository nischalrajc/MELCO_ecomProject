const express=require('express');
const router=express.Router();
const usercontroller=require('../controller/usercontroller');
const userMiddleware=require('../middleware/userMiddleware')

router.get('/',usercontroller.homePage)
router.get('/login',usercontroller.getLogin)
router.post('/login',usercontroller.postLogin)
router.get('/signUp',usercontroller.getSignup)
router.post('/signUp',usercontroller.postSignup)
router.get('/otpvalidation',usercontroller.getOtp)
router.post('/otpvalidation',usercontroller.otpValidate)

router.get('/men',usercontroller.getMenCategory)
router.get('/women',usercontroller.getWomenCategory)
router.get('/kids',usercontroller.getKidCategory)
router.get('/product_details/:id',usercontroller.getProductDetails)

router.get('/cart',userMiddleware.cartValidation,usercontroller.getCart)
router.get('/add_Cart',userMiddleware.userValidate,usercontroller.getAdd_Cart)
router.put('/cart',userMiddleware.userValidate,usercontroller.deletFromCart)
router.post('/quantity',usercontroller.postQuantityManagemant)

router.get('/checkout',userMiddleware.userValidate,usercontroller.getCheckOut)
router.post('/checkout',userMiddleware.userValidate,usercontroller.postCheckOut)
router.get('/paymentSuccess',userMiddleware.userValidate,usercontroller.Paypalsuccess)
router.get('/cancel',userMiddleware.userValidate,usercontroller.PaypalCancel)

router.post('/verify-payment',userMiddleware.userValidate,usercontroller.verifypayment)
router.post('/insertAddress',userMiddleware.userValidate,usercontroller.insertAddress)
router.get('/success',userMiddleware.paymentValidate,usercontroller.getSuccess)
router.get('/payMentFail',userMiddleware.paymentValidate,usercontroller.getFailPage)
router.get('/editAddress/:id',userMiddleware.userValidate,usercontroller.addressEdit)
router.post('/editAddress/:id',userMiddleware.userValidate,usercontroller.postAddressEdit)


router.get('/profile',userMiddleware.userValidate,usercontroller.getProfile)
router.post('/profile',userMiddleware.userValidate,usercontroller.postProfile)
router.get('/orderDetails/:id',userMiddleware.userValidate,usercontroller.getOrderDetails)
router.get('/addAddress',userMiddleware.userValidate,usercontroller.addAddress)
router.post('/addAddress',userMiddleware.userValidate,usercontroller.postAddAddress)
router.put('/removeAddress',userMiddleware.userValidate,usercontroller.removeAddress)
router.post('/profile/:id',userMiddleware.userValidate,usercontroller.editAddress)

router.get('/otpLogin',usercontroller.otpLogin)
router.post('/otpLogin',usercontroller.postOtpLogin)
router.get('/loginOtp',usercontroller.getLoginOtp)
router.post('/loginOtp',usercontroller.postloginOtp)
router.post('/resendOtp',usercontroller.resendOtp)

router.get('/add_wishlist',userMiddleware.userValidate,usercontroller.addToWishList)
router.get('/wishlist',userMiddleware.wishListValidation,usercontroller.getWishList)
router.put('/wishlist',userMiddleware.wishListValidation,usercontroller.removeWishList)

router.get('/logout',userMiddleware.userValidate,usercontroller.logOut)

router.post('/applyCoupon',userMiddleware.userValidate,usercontroller.applyCoupon)

router.get('/cancelOrder',userMiddleware.userValidate,usercontroller.OrderCancel)
router.get('/returnOrder',userMiddleware.userValidate,usercontroller.returnOrder)

router.get('/contact',usercontroller.getContact)



module.exports=router