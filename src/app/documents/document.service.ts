import { EventEmitter, Injectable } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documents: Document[] = [];
  documentSelectedEvent = new EventEmitter<Document>();

  constructor() { 
    this.documents = MOCKDOCUMENTS;
  }

  getDocuments() {
    return this.documents.slice();
  }

    // Return document object matching id or, if not found, return null
  getDocument(id: string) {
    console.log("Document Lookup: ", id)
    
    // Using return inside a forEach loop exits the loop, not the function
    // Instead, use find to return the document or null if not found
    return this.documents.find(document => document.id === id);
  }
}