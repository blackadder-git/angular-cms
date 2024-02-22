import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documents: Document[] = [];
  documentSelectedEvent = new EventEmitter<Document>();
  //documentChangedEvent = new EventEmitter<Document[]>();
  documentListChangedEvent = new Subject<Document[]>();
  maxDocumentId: number = 0;

  constructor() { 
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
  }

  // ********************************
  // Get max document id
  // ********************************
  getMaxId(): number {
    let maxId = 0;

    this.documents.forEach((document) => {
      let currentId = parseInt(document.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    });

    return maxId
  }

  // ********************************
  // Return all documents
  // ********************************
  getDocuments() {
    return this.documents.slice();
  }

  // ********************************
  // Return document object matching id or, if not found, return null
  // ********************************
  getDocument(id: string) {
    console.log("Document Lookup: ", id)
    
    // Using return inside a forEach loop exits the loop, not the function
    // Instead, use find to return the document or null if not found
    return this.documents.find(document => document.id === id);
  }

  // ********************************
  // Add a new document to documents
  // ********************************
  addDocument(newDocument: Document) {
    if (!newDocument) {
      // Abort if document wasn't passed
      return;
    }

    // Push a new document onto the list and emit change
    this.maxDocumentId++;
    newDocument.id = "" + this.maxDocumentId;
    this.documents.push(newDocument);
    let documentsListClone = this.documents.slice();
    this.documentListChangedEvent.next(documentsListClone);
  }

  // ********************************
  // Replace an existing document in documents
  // ********************************
  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      // Abort if either document is undefined
      return;
    }

    let pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      // Abort if original document can't be found
      return;
    }

    // Set id of new document and replace in list
    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    let documentsListClone = this.documents.slice();
    this.documentListChangedEvent.next(documentsListClone);
  }

  // ********************************
  // Delete a document from documents
  // ********************************
  deleteDocument(document: Document) {
    if (!document) {
      // Abort if document wasn't passed
      return;
    }
 
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      // Abort if document doesn't exist
      return;
    }

    // Remove document from list
    this.documents.splice(pos, 1);
    //this.documentChangedEvent.emit(this.documents.slice()); 
    let documentsListClone = this.documents.slice();
    this.documentListChangedEvent.next(documentsListClone);

    //this.documentListChangedEvent.next(this.documents.slice());
  }
}