const mongoose = require('mongoose');
const JWT = require('jsonwebtoken');

const screma = new mongoose.Schema({
    fullname:{type:String,
    required:true,
    trim:true,
     minlength:[3,"fullname must be at least 3 characters"]

    },
       cart:[
        {
      type: mongoose.Schema.Types.ObjectId,
      ref:"product",
           
       }
    ],
   tablbook:[
        {
      type: mongoose.Schema.Types.ObjectId,
      ref:"TableBooking",
           
       }
    ],
    Orderr:[
        {
      type: mongoose.Schema.Types.ObjectId,
      ref:"product",
           
       }
    ],
    email:{
      type:String,
    required:true,
     minlength:[5,"email must be at least 5 characters"]


    },
    password:{type:String,
    required:true,
    trim:true,
     minlength:[8,"password must be at least 8 characters"],
     select:true
    }
})

screma.methods.generateAuthToken = function() {
    const token = JWT.sign(
      { _id: this._id, email: this.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    return token;
}

const User = mongoose.model('Usermodels',screma)
module.exports=User
