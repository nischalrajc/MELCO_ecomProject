const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  banner_tittle: {
    type: String,
  },
  description: {
    type: String,
  },
  images: [{
    type:String
  }],
});

const Banner = mongoose.model('Banners', bannerSchema);
module.exports = Banner;
