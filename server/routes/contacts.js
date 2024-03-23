var express = require('express');
const sequenceGenerator = require('./sequenceGenerator');
var router = express.Router();
const Contact = require('../models/contact');

console.log("In routes/contacts.js");

// GET
router.get('/', (req, res, next) => {
   console.log("In routes/contacts.js get()");
 
   Contact.find()
   .populate("group")
   .then(
      contacts => {
         //console.log(contacts);
         res.status(200).json({
            message: "Contacts fetched successfully!",
            contacts: contacts
      })
   })
   .catch(error => {
      console.error('Error fetching contacts:', error);
      res.status(500).json({
         error: error.message
      });
   });
});
 
// POST
router.post("/", async (req, res) => {
   console.log("In routes/contacts.js post()");

   const maxContactId = await sequenceGenerator.nextId("contacts");
   console.log("Next Contact ID", maxContactId);

   const contact = new Contact({
      id: "" + maxContactId,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      imageUrl: req.body.imageUrl,
      group: req.body.group
   });
   console.log("New Conctact", contact);

   contact.save()
   .then(
      res.status(201).json({
         message: 'Contact added successfully',
         contact: contact
      })
   )
   .catch(error => {
      console.error('Error fetching contacts:', error);
      res.status(500).json({
         message: "Error fetching contacts",
         error: error.message
      });
   });
});


// PUT
router.put('/:id', (req, res) => {
   console.log("In routes/contacts.js put()", req.params.id);

   Contact.findOne({ id: req.params.id })
   .then(contact => {
      contact.name = req.body.name;
      contact.email = req.body.email;
      contact.phone = req.body.phone;
      contact.imageUrl = req.body.imageUrl;
      contact.group = req.body.group;
 
      Contact.updateOne({ id: req.params.id }, contact)
      .then(result => {
           res.status(204).json({
             message: 'Contact updated successfully'
           })
      })
      .catch(error => {
            res.status(500).json({
            message: 'An error occurred',
            error: error
          });
      });
   })
   .catch(error => {
      res.status(500).json({
         message: 'Contact not found.',
         error: { document: 'Contact not found'}
      });
   });
});


// DELETE
router.delete("/:id", (req, res) => {
   console.log("In routes/contacts.js delete()");

   Contact.findOne({ id: req.params.id })
   .then(contact => {
      Contact.deleteOne({ id: req.params.id })
      .then(result => {
         res.status(204).json({
            message: "Contact deleted successfully"
         });
      })
      .catch(error => {
         res.status(500).json({
            message: 'An error occurred',
            error: error
         });
      })
   })
   .catch(error => {
      res.status(500).json({
         message: 'Contact not found.',
         error: { contact: 'contact not found'}
       });
   });
});


module.exports = router; 