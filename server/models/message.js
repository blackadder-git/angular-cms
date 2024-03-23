const mongoose = require('mongoose');

// Schema holds blueprint which is based on the Angular Message model
// The _id property is automatically generated and added to the JSON object when a new message is inserted into the collection. 
// It is the primary surrogate key that uniquely identifies each object in the collection.
const messageSchema = mongoose.Schema({
   id: { type: String, required: true },
   subject: { type: String },
   msgText: { type: String },
   sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact'}
});

// Build an object based on the blueprint above
module.exports = mongoose.model('Message', messageSchema);