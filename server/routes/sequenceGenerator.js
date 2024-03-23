var Sequence = require('../models/sequence');

var maxDocumentId;
var maxMessageId;
var maxContactId;
var sequenceId = null;
let sequence = null;
 
// Thank you Aaron Picker
const sequenceGenerator = {   // First, I restructured sequenceGenerator to be a variable containing the various methods.
  async init() {    // Make this init() function asynchronous
    try {
      sequence = await Sequence.findOne({}).exec();   // "exec()" here has to do with Mongoose and async functions. Not sure if it's entirely necessary, but it works with it in there. 
      if (!sequence) {
        throw new Error('Sequence not found');
      }
      console.log("Sequence object:", sequence);
      this.sequenceId = sequence._id;
      this.maxDocumentId = sequence.maxDocumentId;
      this.maxMessageId = sequence.maxMessageId;
      this.maxContactId = sequence.maxContactId;
      console.log("doc", this.maxDocumentId, "msg", this.maxMessageId, "con", this.maxContactId);
    } 
    catch (err) {
      console.error('Error initializing SequenceGenerator:', err);
      throw err;
    }
  },
  async nextId(collectionType) {

    //return 101;
    // Ensure the generator is initialized. If not, call the init() function above. 
    if (!this.sequenceId) {
      await this.init();
    }
    //..... // This function continues
    var updateObject = {};
    var nextId;
  
    switch (collectionType) {
      case 'documents':
        this.maxDocumentId++;
        updateObject = {maxDocumentId: this.maxDocumentId};
        //sequence.maxDocumentId = this.maxDocumentId;
        nextId = this.maxDocumentId;
        console.log("maxDocumentId", nextId);
        break;
      case 'messages':
        this.maxMessageId++;
        updateObject = {maxMessageId: this.maxMessageId};
        nextId = this.maxMessageId;
        console.log("maxMessageId", nextId);
        break;
      case 'contacts':
        this.maxContactId++;
        updateObject = {maxContactId: this.maxContactId};
        nextId = this.maxContactId;
        console.log("maxContactId", nextId);
        break;
      default:
        return -1;
    }
  
    /*
      _id: 65f9bce9a6b620fa0e83296c
 ObjectId('65f9bce9a6b620fa0e83296c')
      maxDocumentId: 100
      maxMessageId: 100
      maxContactId: 100
    */
    //const sequence = new Sequence();
    console.log("Update sequence _id", this.sequenceId, "set object", updateObject);
    //Sequence.updateOne({ _id: sequenceId }, { $set: updateObject }, function (err) {
    
    Sequence.updateOne({ _id: this.sequenceId}, {$set: updateObject})
    .then(result => {
      console.log('Sequence updated:', result);
    })
    .catch(error => {
      console.error('Error updating sequence:', error);
    }); 

    console.log("nextId:", nextId);
    return nextId;
  }  
}; // Close out the sequenceGenerator object.

module.exports = sequenceGenerator;