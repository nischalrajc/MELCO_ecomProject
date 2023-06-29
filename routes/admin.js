const express=require('express');
const router=express.Router();
const admincontroller=require('../controller/admincontroller');
const middleware=require('../middleware/adminMiddleware')

router.get('/',admincontroller.adminLogin)
router.post('/',admincontroller.loginAdmin)

router.get('/user_datails',middleware.varifyAdmin,admincontroller.getUserdetail)
router.put('/blockuser',admincontroller.blockUser)
router.put('/unblockuser',admincontroller.unblockUser)

router.get('/product_info',middleware.varifyAdmin,admincontroller.getProductInfo)
router.get('/addproducts',middleware.varifyAdmin,admincontroller.getAddproducts)
router.post('/addproducts',admincontroller.postAddproducts)
router.get('/editproducts/:id',middleware.varifyAdmin,admincontroller.getEditproducts)
router.post('/editproduct/:id',admincontroller.postEditProduct)
router.put('/deleteitem',admincontroller.putSoftDelete)

router.get('/add_category',middleware.varifyAdmin,admincontroller.getAddCategory)
router.post('/add_category',admincontroller.postAddCategory)

router.get('/orders',middleware.varifyAdmin,admincontroller.getOrders)
router.put('/orderCancel',admincontroller.cancelOrders)
router.get('/orderDetails/:id',middleware.varifyAdmin,admincontroller.getOderDetail)
router.get('/orderPlaceAdmin',middleware.varifyAdmin,admincontroller.permitOrder)
router.post('/updateDeliverStatus',middleware.varifyAdmin,admincontroller.updateDeliveryStatus)

router.get('/dashboard',middleware.varifyAdmin,admincontroller.getdashboard)

router.get('/coupons',middleware.varifyAdmin,admincontroller.getCoupon)
router.post('/add_coupons',middleware.varifyAdmin,admincontroller.addCoupon)
router.get('/editCoupon/:id',middleware.varifyAdmin,admincontroller.editCoupon)
router.post('/editCoupon/:id',admincontroller.postEditCoupon)
router.put('/removeCoupon',middleware.varifyAdmin,admincontroller.removeCoupon)

router.get('/returnRequest',middleware.varifyAdmin,admincontroller.getReturnRequest)
router.post('/return-order',admincontroller.returnRequest)
router.get('/acceptReturnRequest',middleware.varifyAdmin,admincontroller.acceptReturnRequest)
router.get('/cancelReturnRequest',middleware.varifyAdmin,admincontroller.cancelReturnRequest)

router.get('/salesReport',middleware.varifyAdmin,admincontroller.salesReport)
router.put('/salesReport',middleware.varifyAdmin,admincontroller.filterSales)

router.get('/banners',middleware.varifyAdmin,admincontroller.banners)
router.get('/addbanner',middleware.varifyAdmin,admincontroller.addBanner)
router.post('/addbanner',middleware.varifyAdmin,admincontroller.postAddBanner)
router.get('/editBanner/:id',middleware.varifyAdmin,admincontroller.editBanner)
router.post('/editBanner/:id',middleware.varifyAdmin,admincontroller.postEditBanner)
router.post('/removeBanner',middleware.varifyAdmin,admincontroller.removeBanner)



module.exports=router;