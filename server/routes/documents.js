var express = require('express');
const sequenceGenerator = require('./sequenceGenerator');
const Document = require('../models/document');

var router = express.Router();

console.log("In routes/documents.js");

// GET
router.get('/', (req, res) => {
   console.log("In routes/documents.js get()");

   Document.find()
   .then(
      documents => {
         //console.log(documents);
         res.status(200).json({
            message: "Documents fetched successfully!",
            documents: documents
         })
      })
   .catch(error => {
      console.error('Error fetching documents:', error);
      res.status(500).json({
         message: "Error fetching documents",
         error: error.message
      });
   });
});

// POST
router.post("/", async (req, res) => {
   console.log("In routes/documents.js post()");

   const maxDocumentId = await sequenceGenerator.nextId("documents");
   console.log("Next Document ID", maxDocumentId);

   const document = new Document({
      id: "" + maxDocumentId,
      name: req.body.name,
      description: req.body.description,
      url: req.body.url
   });
   console.log("New Document", document);


   document.save()
   .then(
      res.status(201).json({
         message: 'Document added successfully',
         document: document
      })
   )
   .catch(error => {
      console.error('Error fetching documents:', error);
      res.status(500).json({
         error: error.message
      });
   });
});

// PUT
router.put('/:id', (req, res) => {
   console.log("In routes/documents.js put()", req.params.id);

   Document.findOne({ id: req.params.id })
   .then(document => {
      document.name = req.body.name;
      document.description = req.body.description;
      document.url = req.body.url;
 
      Document.updateOne({ id: req.params.id }, document)
      .then(result => {
           res.status(204).json({
             message: 'Document updated successfully'
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
         message: 'Document not found.',
         error: { document: 'Document not found'}
      });
   });
});


// DELETE
router.delete("/:id", (req, res) => {
   console.log("In routes/documents.js delete()");

   Document.findOne({ id: req.params.id })
   .then(document => {
      Document.deleteOne({ id: req.params.id })
      .then(result => {
         res.status(204).json({
            message: "Document deleted successfully"
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
         message: 'Document not found.',
         error: { document: 'Document not found'}
       });
   });
});


module.exports = router; 