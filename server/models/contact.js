const mongoose = require('mongoose');

// Schema holds blueprint which is based on the Angular Contact model
// The _id property is automatically generated and added to the JSON object when a new message is inserted into the collection. 
// It is the primary surrogate key that uniquely identifies each object in the collection.
const contactSchema = mongoose.Schema({
   id: { type: String, required: true },
   name: { type: String, required: true },
   email: { type: String, required: true },
   phone: { type: String },
   imageUrl: { type: String },
   group: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }]
});

// Build an object based on the blueprint above
module.exports = mongoose.model('Contact', contactSchema);