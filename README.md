# Melco E-commerce Website

Led the development of a user-friendly e-commerce website dedicated to fashion apparel. Utilized Node.js, Express.js, and MongoDB to create a seamless shopping experience with secure user authentication. Integrated Twilio for secure OTP validation during user registration. Developed an intuitive admin panel for streamlined product management, order tracking, and analytics. Seamlessly integrated Razorpay and PayPal for secure online transactions. Introduced a wallet feature, enabling quick and hassle-free payments. Hosted on Amazon EC2 for reliability and scalability. Configured NGINX and Route53 for efficient traffic management and domain resolution.

## Key Features

* **User Authentication:** Secure user authentication with OTP validation using Twilio.
* **Admin Panel:** Intuitive admin panel for product management, order tracking, and analytics.
* **Payment Integration:** Integration of Razorpay, PayPal, and Cash on Delivery for secure transactions.
* **Wallet Feature:** Introduction of a wallet feature for quick and hassle-free payments.
* **Address Management:** Users can manage their addresses for easy delivery during checkout.
* **Responsive Design:** Website is fully responsive, ensuring optimal user experience across devices.
* **Product Wishlist:** Users can add products to their wishlist for future purchase consideration.
* **Shopping Cart:** Seamless shopping cart functionality for easy management of selected products.
* **Order Return:** Easy process for users to return products after purchase, enhancing customer satisfaction.
* **User Profile Management:** Users can manage their profiles, including addresses and order history.
* **Secure Transactions:** SSL encryption ensures secure transactions and protects user data.

## Technologies Used

* **Backend:** Node.js, Express.js, MongoDB
* **Frontend:** HTML, CSS, JavaScript
* **Payment Gateways:** Razorpay, PayPal
* **Other Technologies:** Twilio, Amazon EC2, NGINX, Route53

## Live Demo

Explore the live demo of the website [here](https://melco.cloud/).


## Dependencies

- **@zeitiger/elevatezoom**: Used for image zoom functionality.
- **bcrypt**: Used for password hashing.
- **dotenv**: Used for loading environment variables from a .env file.
- **express**: Web application framework for Node.js.
- **express-handlebars**: Handlebars view engine for Express.js.
- **express-handlebars-layouts**: Handlebars layouts for Express.js.
- **express-hbs**: Handlebars view engine for Express.js with support for layouts.
- **express-layouts**: Layout support for Express.js.
- **express-session**: Session middleware for Express.js.
- **handlebars**: Handlebars template engine.
- **hbs**: Express.js view engine with support for Handlebars.
- **jquery**: JavaScript library for DOM manipulation.
- **jquery-zoom**: Plugin for image zoom functionality.
- **moment**: JavaScript library for parsing, validating, manipulating, and formatting dates.
- **mongoose**: MongoDB object modeling tool.
- **morgan**: HTTP request logger middleware for Node.js.
- **multer**: Middleware for handling multipart/form-data.
- **nocache**: Middleware for adding Cache-Control headers to express responses.
- **path**: Module for working with file paths.
- **paypal-rest-sdk**: PayPal REST API SDK.
- **razorpay**: Payment gateway integration for processing online transactions securely.
- **session**: Lightweight session middleware for Express.js.
- **sharp**: High-performance image processing library.
- **twilio**: Communication API for integrating SMS and voice capabilities.

  ## Model-View-Controller (MVC) Architecture

This project follows the MVC architecture pattern, which separates the application into three interconnected components:

- **Model**: Responsible for managing the data and business logic of the application. In this project, MongoDB is used as the database to store and manage application data.

- **View**: Responsible for presenting the data to the user and handling user interactions. HTML, CSS, and JavaScript are used to create the user interface and render dynamic content.

- **Controller**: Acts as an intermediary between the Model and the View, handling user input and updating the Model accordingly. In this project, Express.js is used to define routes and handle HTTP requests, while also controlling the flow of data between the Model and the View.

This architecture promotes modularity, scalability, and code organization, making it easier to manage and maintain the application codebase.


## Installation

1. Clone the repository:

```bash
git clone git clone https://github.com/nischalrajc/MELCO_ecomProject.git
```


2. Navigate to the project directory:

```bash
cd fashion-apparel-ecommerce
```


3. nstall dependencies:

```bash
npm install
```


4. Set up environment variables:
   
   
    PORT=3000
    
    MONGODB_URI=your_mongodb_uri
  
    TWILIO_ACCOUNT_SID=your_twilio_account_sid
    
    TWILIO_AUTH_TOKEN=your_twilio_auth_token
    
    TWILIO_PHONE_NUMBER=your_twilio_phone_number
    
    RAZORPAY_KEY_ID=your_razorpay_key_id
    
    RAZORPAY_KEY_SECRET=your_razorpay_key_secret
    
    PAYPAL_CLIENT_ID=your_paypal_client_id
    
    PAYPAL_CLIENT_SECRET=your_paypal_client_secret


6. Start the server:

```bash
npm start
```

6. Open your web browser and navigate to http://localhost:3000 to view the website.


