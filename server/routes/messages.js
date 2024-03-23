var express = require('express');
const sequenceGenerator = require('./sequenceGenerator');
const Message = require('../models/message');

var router = express.Router();

console.log("In routes/messages.js");

// GET
router.get('/', (req, res) => {
   console.log("In routes/messages.js get()");
 
   Message.find()
   .populate('sender')
   .then(
      messages => {
         //console.log(messages);
         res.status(200).json({
            message: "Messages fetched successfully!",
            messages: messages
         })
      })
   .catch(error => {
      console.error('Error fetching messages:', error);
      res.status(500).json({
         message: "Error fetching messages",
         error: error.message
      });
   });
});
 

// POST
router.post("/", async (req, res) => {
   console.log("In routes/messages.js post()");
 
   const maxMessageId = await sequenceGenerator.nextId("messages");
   console.log("Next Message ID", maxMessageId);
   console.log("Sender id", req.body.sender);
 
   const message = new Message({
      id: "" + maxMessageId,
      subject: req.body.subject,
      msgText: req.body.msgText,
      sender: req.body.sender
   });
   console.log("New Message", message);

   message.save()
   .then(
      res.status(201).json({
         message: 'Message added successfully',
         message: message
      })
   )
   .catch(error => {
      console.error('Error fetching messages:', error);
      res.status(500).json({
         error: error.message
      });
   });
});


module.exports = router; 