const express = require('express');
const Tickets = require('../model/Tickets');
const Register = require('../model/Register');
const isAdmin = require('../middleware/IsAdmin')
const session = require('express-session')


const TicketsRounter = express.Router();

// completed
TicketsRounter.post('/tickets-input', async (req, res) => {
    try {
        // Check if the user is logged in
        const usersession = req.session.profile; // Use optional chaining to avoid errors if session is undefined
        if (!usersession) {
            return res.status(401).json({ success: false, message: "Access denied. Please log in to continue." });
        }

        const userid = usersession.Id;
        const username = usersession.Name
        const usercontact = usersession.Contact
        const useremil = usersession.Email
        const userrole = usersession.Role


        // Extract formData from the request body
        const { formData } = req.body;
        if (!formData || !formData.issue) {
            return res.status(400).json({
                success: false,
                message: "Issue description is required.",
            });
        }

        // Fetch the last ticket's ID and calculate the new ID
        const lastTicket = await Tickets.findOne().sort({ Id: -1 });
        const id = lastTicket ? lastTicket.Id + 1 : 1;

        // Create a new ticket
        const newTicket = new Tickets({
            Id: id,
            UserId: userid,
            RaisedBy: username,
            Contact: usercontact,
            Email: useremil,
            Role: userrole,
            Description: formData.issue,
            Status: 'Open',
        });

        // Save the ticket to the database
        await newTicket.save();

        return res.status(201).json({
            success: true,
            message: "Your Complaint has been successfully created.",
            ticket: newTicket,
        });
    } catch (err) {
        console.error("Error creating Complaint:", err);
        res.status(500).json({ success: false, message: "Unexpected error occurred. Please try again later." });
    }
});


// complete
TicketsRounter.get('/fetch-tickets', isAdmin, async (req, res) => {
    try {
        let tickets;
        const userRole = req.session.profile.Role

        if (!userRole) {
            return res.send({ success: false, message: "User role not detected. Please contact support." })
        }

        if (userRole === "Admin") {
            tickets = await Tickets.find({})
        }
        else {
            tickets = await Tickets.find({ UserId: req.session.profile.Id })
        }

        if (!tickets) {
            return res.send({ success: false, message: "No Complaint found." })
        }

        return res.send({ success: true, message: "Complaint retrieved successfully.", data: tickets })
    }
    catch (err) {

        console.error("Error creating Complaint:", err);
        res.status(500).json({ success: false, message: "An unexpected error occurred while fetching Complaint. Please try again later." });

    }
})


// complete
TicketsRounter.put("/tickets-update", isAdmin, async (req, res) => {
    try {
        const { Status, Id } = req.body;
        const updatedTicket = await Tickets.findOneAndUpdate(
            { Id: Id },
            { Status: Status },
            { new: true }
        );
        if (!updatedTicket) {
            return res.json({ success: false, message: "No Complaint found with the provided ID." });
        }
        else {
            return res.json({ success: true, message: "Complaint status updated successfully.", data: updatedTicket })
        }
    } catch (err) {

        console.error("Error creating ticket:", err);
        return res.json({ success: false, message: "An unexpected error occurred while updating the Complaint. Please try again later." });

    }
});


module.exports = TicketsRounter;
