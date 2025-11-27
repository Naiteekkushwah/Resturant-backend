// src/models/reservation.model.js
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usermodels',
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String, // आप चाहें तो Date object भी रख सकते हैं
      required: true,
    },
    guests: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const TableBooking = mongoose.model('TableBooking', reservationSchema);
module.exports = TableBooking;
