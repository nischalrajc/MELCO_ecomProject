const Razorpay = require('razorpay');
const admin = require('../model/admininfo');
const category=require('../model/category');
const order = require('../model/orders');
const Coupon=require('../model/coupons');
const Products=require('../model/products');
const userhelpers = require('./userhelpers');
const Wallet = require('../model/wallet');
const { default: mongoose } = require('mongoose');
const ObjectId=mongoose.Types.ObjectId

module.exports={
    async validation(body){
        const Admin=await admin.findOne();
        try{
            if(Admin.email==body.email && Admin.password==body.password){
                return true;
            }
        }catch(err){
           return 
        }
    },


    async categoryvalidate(body){
        const categories=body.categoryname.toUpperCase()

        const valid=await category.findOne({name:categories})
        if(valid){
            return true
        }
        return 
    },

    async revenue(){
        try{
            const totalRevenue=await order.aggregate([
                {
                  $match: {
                    deliveryStatus: "Delivered" 
                  }
                },
                {
                    $group:{
                        _id:null,
                        total:{$sum:"$totalamount"}
                    }
                }
            ])
           return totalRevenue
        }catch(err){
            console.log("error:",err)
        }
    },


    async monthlyRevenue(){
          try {
            const monthlyRevenue = []; 
      
            for (let month = 1; month <= 12; month++) {
              const startDate = new Date(2023, month - 1, 1); 
              const endDate = new Date(2023, month, 0); 
      
              const orders = await order.find({
                orderDate: { $gte: startDate, $lte: endDate }
              });
      
              const revenue = orders.reduce((total, order) => {
                return total + order.totalamount;
              }, 0);
      
              monthlyRevenue.push(revenue);
            }
      
            return monthlyRevenue;
          } catch (err) {
            console.log("Error calculating monthly revenue:", err);
            throw err;
          }
      },
      
      async  calculateCurrentWeekRevenue() {
        try {
          const currentDate = new Date();
          const target = new Date(currentDate.valueOf());
          const firstThursday = new Date(currentDate.getFullYear(), 0, 4);
          firstThursday.setDate(firstThursday.getDate() - ((firstThursday.getDay() + 6) % 7) + 3);
          const currentWeek = Math.floor(1 + 0.5 + (target - firstThursday) / (1000 * 60 * 60 * 24 * 7));
      
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - startDate.getDay()); // Set the start date to the beginning of the current week
      
          const endDate = new Date();
          endDate.setDate(startDate.getDate() + 6); // Set the end date to the end of the current week
      
          const orders = await order.find({
            orderDate: { $gte: startDate, $lte: endDate },
            deliveryStatus: "Delivered" 
        });
      
          const revenue = orders.reduce((total, order) => {
            return total + order.totalamount;
          }, 0);
      
          return revenue;
        } catch (err) {
          console.log("Error calculating current week revenue:", err);
          throw err;
        }
      },
      

      async cancelledOrder(){
        try{
            const monthlyOrder = [];

            for (let month = 1; month <= 12; month++) {
                const startDate = new Date(2023, month - 1, 1); 
                const endDate = new Date(2023, month, 0); 

                const cancelledCount = await order.countDocuments({
                    orderDate: { $gte: startDate, $lt: endDate },
                    paymentStatus: "cancelled"
                });

                monthlyOrder.push(cancelledCount);
                }

          return monthlyOrder;

        }catch(err){
            console.log("error:",err)
        }
      },

      async monthlyOrder(){
        try {
            const monthlyOrder = []; 

            for (let month = 1; month <= 12; month++) {
              const startDate = new Date(2023, month - 1, 1); 
              const endDate = new Date(2023, month, 0); 

              const orderCount = await order.countDocuments({
                orderDate: { $gte: startDate, $lt: endDate }
              });
  
              monthlyOrder.push(orderCount);
            }
          
            return monthlyOrder;
          } catch (err) {
            console.log("Error calculating monthly order count:", err);
            throw err;
          }
          
          
      },

      async cashOnDeliveryMonth(){
        try{
          const cashOnDeliveryMonth = []; 
         
          for (let month = 1; month <= 12; month++) {
            const startDate = new Date(2023, month - 1, 1);
            const endDate = new Date(2023, month, 0);

             const cashOnDelivery= await order.countDocuments({
              orderDate: { $gte: startDate, $lt: endDate },
              paymentMethode: "Cash On Delivery"
             });

            cashOnDeliveryMonth.push(cashOnDelivery);
          }
          return cashOnDeliveryMonth;
        }catch(err){
          console.log("error:",err)
        }
      },

      async payPalPerMonth(){
        try{
          const payPalPerMonth = []; 
         
          for (let month = 1; month <= 12; month++) {
            const startDate = new Date(2023, month - 1, 1);
            const endDate = new Date(2023, month, 0);

             const paypal= await order.countDocuments({
              orderDate: { $gte: startDate, $lt: endDate },
              paymentMethode: "Paypal"
             });

             payPalPerMonth.push(paypal);
          }
          return payPalPerMonth;
        }catch(err){
          console.log("error:",err)
        }
      },

      async razoPayPerMonth(){
        try{
          const razorPayPerMonth = []; 
         
          for (let month = 1; month <= 12; month++) {
            const startDate = new Date(2023, month - 1, 1);
            const endDate = new Date(2023, month, 0);

             const razorPay= await order.countDocuments({
              orderDate: { $gte: startDate, $lt: endDate },
              paymentMethode: "Razor Pay"
             });

             razorPayPerMonth.push(razorPay);
          }
          return razorPayPerMonth;
        }catch(err){
          console.log("error:",err)
        }
      },


      async  calculatePayPalMonthlyRevenue() {
        try {
          const calculatePayPalMonthlyRevenue = []; // Array to store revenue data for each month
      
          // Loop through each month (assuming 1 to 12)
          for (let month = 1; month <= 12; month++) {
            // Calculate the start and end dates for the current month
            const startDate = new Date(2023, month - 1, 1); // Assuming 'year' is defined
            const endDate = new Date(2023, month, 0); // Assuming 'year' is defined
      
            // Find orders within the current month paid through PayPal
            const orders = await order.find({
              orderDate: { $gte: startDate, $lte: endDate },
              paymentMethode: 'Paypal' // Assuming 'paymentMethod' field stores the payment method
            });
      
            // Calculate the total revenue for the current month paid through PayPal
            const revenue = orders.reduce((total, order) => {
              return total + order.totalamount;
            }, 0);
      
            // Add the revenue to the monthlyRevenue array
            calculatePayPalMonthlyRevenue.push(revenue);
          }
      
          return calculatePayPalMonthlyRevenue;
        } catch (err) {
          console.log("Error calculating PayPal monthly revenue:", err);
          throw err;
        }
      },


      async calculaterazorPayMonthlyRevenue(){

        try {
          const calculaterazorPayMonthlyRevenue = []; // Array to store revenue data for each month
      
          // Loop through each month (assuming 1 to 12)
          for (let month = 1; month <= 12; month++) {
            // Calculate the start and end dates for the current month
            const startDate = new Date(2023, month - 1, 1); // Assuming 'year' is defined
            const endDate = new Date(2023, month, 0); // Assuming 'year' is defined
      
            // Find orders within the current month paid through PayPal
            const orders = await order.find({
              orderDate: { $gte: startDate, $lte: endDate },
              paymentMethode: 'Razor Pay' // Assuming 'paymentMethod' field stores the payment method
            });
      
            // Calculate the total revenue for the current month paid through PayPal
            const revenue = orders.reduce((total, order) => {
              return total + order.totalamount;
            }, 0);
      
            // Add the revenue to the monthlyRevenue array
            calculaterazorPayMonthlyRevenue.push(revenue);
          }
      
          return calculaterazorPayMonthlyRevenue;
        } catch (err) {
          console.log("Error calculating PayPal monthly revenue:", err);
          throw err;
        }
      },


      async calculateCODMonthlyRevenue(){

        try {
          const CODMonthlyRevenue = []; // Array to store revenue data for each month
      
          // Loop through each month (assuming 1 to 12)
          for (let month = 1; month <= 12; month++) {
            // Calculate the start and end dates for the current month
            const startDate = new Date(2023, month - 1, 1); // Assuming 'year' is defined
            const endDate = new Date(2023, month, 0); // Assuming 'year' is defined
      
            // Find orders within the current month paid through PayPal
            const orders = await order.find({
              orderDate: { $gte: startDate, $lte: endDate },
              paymentMethode: 'Cash On Delivery' // Assuming 'paymentMethod' field stores the payment method
            });
      
            // Calculate the total revenue for the current month paid through PayPal
            const revenue = orders.reduce((total, order) => {
              return total + order.totalamount;
            }, 0);
      
            // Add the revenue to the monthlyRevenue array
            CODMonthlyRevenue.push(revenue);
          }
      
          return CODMonthlyRevenue;
        } catch (err) {
          console.log("Error calculating PayPal monthly revenue:", err);
          throw err;
        }
      },


      async existingCouponvalidate(body){
        try{
          const valid=await Coupon.findOne({couponCode:body.couponCode})
          if(valid){
              return true
          }
          return 
        }catch(err){
          console.log("error:",err)
        }
      },

      async updateCoupon(id,body){
        try{
          await Coupon.findOneAndUpdate({_id:id},
            {$set:{
              couponCode:body.couponCode,
              minLimit:body.minLimit,
              discountPercentage:body.discountPercentage,
              expireDate:body.expireDate
            }})

            return true
        }catch(err){
          console.log("error:",err)
        }
      },


      async deliveryProductsDetails(orderId){
        orderId=new ObjectId(orderId)
        try{
          const orderDetails=await order.aggregate([
            {
            $match:{_id:orderId}
            },
            {
              $lookup:{
                from:"products",
                localField:"products.productId",
                foreignField:"_id",
                as:"productInfo"
              }
            },
            {
              $project:{
                _id:1,
                user:1,
                deliveryDetails:1,
                paymentMethode:1,
                paymentStatus:1,
                deliveryStatus:1,
                totalamount:1,
                orderDate:1,
                products:1,
                productInfo:1,
                productInfo:{
                  $map:{
                    input:"$productInfo",
                    as:"p",
                    in:{
                      _id:"$$p._id",
                      productname:"$$p.productname",
                      Image:"$$p.images",
                      quantity:{
                        $arrayElemAt:[
                          "$products.quantity",
                          {
                            $indexOfArray:["$products.productId","$$p._id"]
                          },
                        ],
                      },
                      currentPrice:{
                        $arrayElemAt:[
                          "$products.currentPrice",
                          {
                            $indexOfArray:["$products.productId","$$p._id"]
                          }
                        ]
                      }
                    }
                  }
                }
              }
            }
          ])

          return orderDetails
        }catch(err){
          console.log("eror:",err)
        }
      },

      async updateWallet(userId,amount){
        try{
          const userWallet=await Wallet.findOne({user:userId})
          userWallet.amount += amount;
          await userWallet.save();
          return true;
        }catch(err){
          console.log("error:",err)
        }
      },

      async dailyReportTotal(dailyReport){
        try{
          let total = 0;
          for (const report of dailyReport) {
            total += report.totalamount;
          }
          return total
        }catch(err){
          console.log("error:",err)
        }
      },

      async monthlyReport(){
        try {
          const monthlyReport = await order.aggregate([
            {
              $match:{deliveryStatus:"Delivered"}
            },
            {
              $group: {
                _id: {
                  year: { $year: "$orderDate" },
                  month: { $month: "$orderDate" }
                },
                total: { $sum: "$totalamount" }
              }
            },
            {
              $project: {
                _id: 0,
                year: "$_id.year",
                month: "$_id.month",
                total: 1
              }
            },
            {
              $sort: { year: 1, month: 1 }
            }
          ]);
      
          return monthlyReport
        } catch (err) {
          console.log("Error:", err);
        }
      },

      async monthlyReportTotal(monthlyReport){
        try{
          let totalAmount = 0;
          for (const monthData of monthlyReport) {
            totalAmount += monthData.total;
           return totalAmount
          }
        }catch(err){
          console.log("error:",err)
        }
      },

      async yearlyReport(){
        try {
          const yearlyReport = await order.aggregate([
            {
              $match:{deliveryStatus:"Delivered"}
            },
            {
              $group: {
                _id: { $year: "$orderDate" },
                total: { $sum: "$totalamount" }
              }
            },
            {
              $project: {
                _id: 0,
                year: "$_id",
                total: 1
              }
            },
            {
              $sort: { year: 1 }
            }
          ]);
      
          return yearlyReport
        } catch (err) {
          console.log("Error:", err);
        }
      },

      async yearlyReportTotal(yearlyReport){
        try {
          let yearlyTotal = 0;
          for (const yearData of yearlyReport) {
            yearlyTotal += yearData.total;
          }
          return yearlyTotal
        } catch (err) {
          console.log("Error:", err);
        }
      }
      
      
}