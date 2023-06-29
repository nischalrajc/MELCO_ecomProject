const mongoose  = require('mongoose');
// const cart = require('../model/cart');
const Cart=require('../model/cart');
const Products = require('../model/products');
const Address = require('../model/address');
const Order=require('../model/orders');
const User = require('../model/userinfo');
const wishList = require('../model/wishList');
const ObjectId = mongoose.Types.ObjectId
const Razorpay = require('razorpay');
const order = require('../model/orders');

// const order = require('../model/orders');
// const { default: orders } = require('razorpay/dist/types/orders');


var instance = new Razorpay({
  key_id: 'rzp_test_8ib5wDK4ebl9Uu',
  key_secret: '4cHDaifBOkKjUDaa7stoEjmz',
});


module.exports = {

    validation(body) {
      const { name, email, phonenumber, password, confirmpassword } = body;
      const errors = [];
  
      // Check if name is provided
      if (!name) {
        errors.push("Name is required.");
      }
  
      // Check if email is provided and valid
      if (!email) {
        errors.push("Email is required.");
      } else {
        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          errors.push("Invalid email format.");
        }
      }
  
      // Check if phonenumber is provided and valid
      if (!phonenumber) {
        errors.push("Phone number is required.");
      } else {
        // Basic phone number format validation
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phonenumber)) {
          errors.push("Invalid phone number format. (10 digits required)");
        }
      }
  
      // Check if password is provided and meets requirements
      if (!password) {
        errors.push("Password is required.");
      } else if (password.length < 6) {
        errors.push("Password must be at least 6 characters long.");
      }
  
      // Check if password and confirmpassword match
      if (password !== confirmpassword) {
        errors.push("Passwords do not match.");
        console.log("Password:", password);
        console.log("Confirm Password:", confirmpassword);
      }
  
      return errors;
    },
     
    async  getCartProducts(user) {
      try {
        const cart = await Cart.aggregate([
          {
            $match: { user: new ObjectId(user) }
          },
          {
            $unwind: "$products"
          },
          {
            $project:{
              quantity:"$products.quantity",
              productId: "$products.productId"
            }
          },
          {
            $lookup: {
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "productInfo"
            }
          },
          {
            $project: {
              quantity:1,
              productInfo: { $arrayElemAt: ["$productInfo", 0] }
            }
          }
        ]);
        console.log(cart)
        return cart;
      } catch (err) {
        console.log("error", err);
      }
    },

    async getCartTotal(user){
      try {
        const total = await Cart.aggregate([
          {
            $match: { user: new ObjectId(user) }
          },
          {
            $unwind: "$products"
          },
          {
            $project:{
              quantity:"$products.quantity",
              productId: "$products.productId"
            }
          },
          {
            $lookup: {
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "productInfo"
            }
          },
          {
            $project: {
              quantity:1,
              productInfo: { $arrayElemAt: ["$productInfo", 0] }
            }
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: { $multiply: ["$quantity", "$productInfo.offerprice"] }
              }
            }
          }
        ]);
        
        return total[0].total; ;
      } catch (err) {
        console.log("error", err);
      }
    },

    async isCouponApplied(userId){
      try{
        const cart = await Cart.findOne({ user: userId });
        if (cart && cart.Discount) {
          // Discount field has a value
          console.log("Discount applied in the cart.",cart.Discount);
          return cart.Discount;
        } else {
          // Discount field does not have a value
          console.log("Discount not applied in the cart.");
          return null;
        }
      }catch(err){
        console.log("error:",err)
      }
    },


    async  pushAddress(body, address) {
      const newAddress = {
        firstname: body.firstname,
        lastname: body.lastname,
        address: body.address,
        place: body.place,
        city: body.city,
        district: body.district,
        state: body.state,
        pincode: body.pincode,
        phone: body.phone,
      };
    
      address.address.push(newAddress);
      await address.save();
    
      return newAddress;
    },


    async orderplace(deliverAddress,user,total,payment_methode){
      try{
        const cart=await Cart.findOne({user:user})
        const order=new Order({
          user:user,
          deliveryDetails:{
            firstname:deliverAddress.firstname,
            lastname:deliverAddress.lastname,
            state:deliverAddress.state,
            district:deliverAddress.district,
            city:deliverAddress.city,
            place:deliverAddress.place,
            address:deliverAddress.address,
            phone:deliverAddress.phone,
        },
        paymentMethode:payment_methode,
        products:cart.products.map(product => ({
          productId: product.productId, 
          quantity: product.quantity,
          currentPrice:product.offerprice,
        })),
        paymentStatus:"success",
        deliveryStatus: 'Pending',
        totalamount:total,
        orderDate:Date.now()
        })
        await order.save()
        return order
      }catch(err){
        console.log("error:",err)
      }
    },

    async cartCount(userId){
      try{
      const userCart=await Cart.findOne({user:userId})
      if(userCart){
        const productCount = userCart.products.length;
        return productCount
      }else{
        return 0
      }
      }catch(err){
        console.log("error:",err)
      }
    },


    async OrderCount(userId){
      try{
        const userOrders=await Order.find({user:userId})
        const orderCount=userOrders.length;
        return orderCount
      }catch(err){
        console.log("error:",err)
      }
    },

    async orderStockManagement(userId){
      try{
        const userCart = await Cart.findOne({user:userId})
        const orderedProducts= userCart.products
        
        for (const product of orderedProducts){
          const productInDB = await Products.findById(product.productId);
          productInDB.stock -= product.quantity;
          await productInDB.save();
        }
      }catch(err){
        console.log("error:",err)
      }
    },

    async stockUpdate(id){
      try{
        const userorder=await Order.findOne({_id:id})
        const userorderProducts= userorder.products
        
        for(const product of userorderProducts){
          const productInDB = await Products.findById(product.productId);
          productInDB.stock += product.quantity;
          await productInDB.save();
        }
      }catch(err){
        console.log("error:",err)
      }
    },

    async userUpdate(userId,body){
      try{
        const userUpdate=await User.updateOne({_id:userId},
          {
          $set:
          {
            name:body.name,
            email:body.email,
            phone_number:body.phone
          }
          })
          return userUpdate
      }catch(err){
        console.log("error:",err)
      }
    },

    async userAddress(userId){
      try{
        const userAddress=await Address.findOne({user:userId})
        const address=userAddress.address
        console.log(address)
        return address
      }catch(err){
        console.log("error:",err)
      }
    },

    async addressUpdate(addresId,body,userId){
      try{
        const userAddress=await Address.findOne({user:userId})
        const address= userAddress.address.find((address) => address._id == addresId)

         // Update the address properties
         address.firstname = body.firstname;
         address.lastname = body.lastname;
         address.address = body.address;
         address.place = body.place;
         address.city = body.city;
         address.district = body.district;
         address.state = body.state;
         address.pincode = body.pincode;
         address.phone = body.phone;

        // Save the updated address
        await userAddress.save();
        return address
      }catch(err){
        console.log("error:",err)
      }
    },

    async deleteAddress(addressId,userId){
      try{
        const deleteAddress = await Address.findOneAndUpdate(
          { user: userId },
          { $pull: { address: { _id:addressId} } }
        );
        return deleteAddress
      }catch(err){
         console.log("error:",err)
      }
    },

    async addAddress(userId, body) {
      try {
        console.log(body);
        const newAddress = {
          firstname: body.firstname,
          lastname: body.lastname,
          address: body.address,
          place: body.place,
          city: body.city,
          district: body.district,
          state: body.state,
          pincode: body.pincode,
          phone: body.phone,
        };
    
        let addAddress;
    
        const existingUser = await Address.findOne({ user: userId });
    
        if (existingUser) {
          addAddress = await Address.findOneAndUpdate(
            { user: userId },
            { $push: { address: newAddress } },
            { new: true }
          );
        } else {
          
          addAddress = await Address.create({ user: userId, address: [newAddress] });
        }
    
        return addAddress;
      } catch (err) {
        console.log("error:", err);
      }
    },
    


    async wishList(productId,userId){
      try{
        const Product=await Products.findOne({_id:productId})
        const wishListExist = await wishList.findOne({ user: userId });
      if (wishListExist) {
        const existingProduct = wishListExist.products.find(
          (product) => product.productId == productId
        );
        if (existingProduct) {
          console.log("product already added in the wishlist")
        } else {
          wishListExist.products.push({
            productId: productId,
            offerprice:Product.offerprice
          });
        }
        await wishListExist.save();

      } else {
        const newWishList = new wishList({
          products: [{
            productId: productId,
            offerprice:Product.offerprice
          }],
          user: userId
        });
        await newWishList.save();
      }
        return true
      }catch(err){
        console.log("error:",err)
      }
    },

    async generateRazorPay(orderId,total){
      try{
        console.log(total,"jjjjjjjjjj")

        const amountInPaise = Math.round(total * 100); // Convert total to paise

        const order = await instance.orders.create({
          amount:amountInPaise,
          currency: "INR",
          receipt: ""+orderId,
          notes: {
            key1: "value3",
            key2: "value2"
          }
        })
        console.log(order,"yyyyyyyy")
        return order
        
      }catch(err){
        console.log("error:",err)
      }
    },

    async verifyPayment(body){
      return new Promise((resolve,reject)=>{
        const crypto = require('crypto');
        let hmac = crypto.createHmac('sha256', '4cHDaifBOkKjUDaa7stoEjmz')

        hmac.update(body['payment[razorpay_order_id]'] + '|' + body['payment[razorpay_payment_id]']);
        hmac = hmac.digest('hex')
        if (hmac == body['payment[razorpay_signature]']) {
            console.log('become equal tooooooooo');
            resolve()
        } else {
            console.log('entered to case not equalllllllllllllll');
            reject()
       }
      })
    },

    async updateOrder(orderId){
      try{
        const orderStatus=await Order.findOneAndUpdate(
          {_id:orderId},
          {$set:{paymentStatus:"success"}},
          {new:true}
        )
      }catch(err){
        console.log("error:",err)
      }
    },

    async cancelRazorPay(orderId){
      try{
        await order.findOneAndDelete({_id:orderId})
        return true
      }catch(err){
        console.log("error:",err)
      }
    },


    //------------PayPal-------------//

    // async generatePayPal(orderId,total){
    //   console.log("deep iside")
    //   try{
    //     const create_payment_json = {
    //       "intent": "sale",
    //       "payer": {
    //           "payment_method": "paypal"
    //       },
    //       "redirect_urls": {
    //           "return_url": "http://localhost:3000/success",
    //           "cancel_url": "http://localhost:3000/cancel"
    //       },
    //       "transactions": [{
    //           "item_list": {
    //               "items": [{
    //                   "name": "item",
    //                   "sku": "item",
    //                   "price": total,
    //                   "currency": "USD",
    //                   "quantity": 1
    //               }]
    //           },
    //           "amount": {
    //               "currency": "USD",
    //               "total": total
    //           },
    //           "description": "This is the payment description."
    //       }]
    //   };

       
    //     paypal.payment.create(create_payment_json, function (error, payment) {
    //       if (error) {
    //           throw error;
    //       } else {
    //           console.log("Create Payment Response");
    //           console.log(payment,"gggggggggg");
    //           return  payment
    //       }
    //     });
        
    //   }catch(err){
    //     console.log("error:",err)
    //   }
    // }

   


    async  generatePayPal(orderId, total) {
      try {
        const create_payment_json = {
          "intent": "sale",
          "payer": {
            "payment_method": "paypal"
          },
          "redirect_urls": {
            "return_url": "http://localhost:3000/success",
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
                        
                      }
                    }
            }
          });

        console.log("Create Payment Response");

        return payment;
      } catch (err) {
        console.log("error:", err);
      }
    },

    async  deliveryProductsDetails(orderId) {
      
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
    }
    
    
    
    
    
    
    
  };
  