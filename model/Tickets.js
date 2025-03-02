const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema(
  {
    Id: { type: Number, required: true, unique: true },
    UserId: { type: Number, required: true },
    RaisedBy: { type: String, required: true }, // Changed to String for name
    Role: { type: String, required: true },
    Contact: { type: Number },
    Email: { type: String, required: true },
    Description: { type: String, required: true },
    Status: {
      type: String,
      default: "Open",
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

const TicketModel = mongoose.model("Ticket", TicketSchema);

module.exports = TicketModel;
