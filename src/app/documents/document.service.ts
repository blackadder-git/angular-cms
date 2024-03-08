import { EventEmitter, Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Document } from './document.model';
// import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

// https://console.firebase.google.com/project/angular-contacts-cms/database/angular-contacts-cms-default-rtdb/data
// https://www.youtube.com/watch?v=iF2sv5E3SvE

export class DocumentService {
  private documents: Document[] = [];
  documentSelectedEvent = new EventEmitter<Document>();
  //documentChangedEvent = new EventEmitter<Document[]>();
  documentListChangedEvent = new Subject<Document[]>();
  maxDocumentId: number = 0;

  constructor(private http: HttpClient) { 
    // this.documents = MOCKDOCUMENTS;
    this.initializeData();
  }

  // ********************************
  // load documents
  // ********************************
  initializeData() {
    this.queryData().subscribe(docs => {
      this.documents = docs;

      // Generate largest id    
      this.maxDocumentId = this.getMaxId();
    });    
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
  // Get documents from Firebase
  // ********************************
  queryData(): Observable<Document[]> {
    return this.http.get<{ [id: string]: Document }>(
      "https://angular-contacts-cms-default-rtdb.europe-west1.firebasedatabase.app/documents.json")
      .pipe(map(responseData => {
        // Convert JSON object to JavaScript object
        const firebaseDocs: Document[] = [];
        for (const key in responseData) {
          firebaseDocs.push({ ...responseData[key], id: key })
        }

        // Sort documents
        firebaseDocs.sort((doc1, doc2)  => {
          if (doc1.name < doc2.name) {
            return -1;
          }
          else if (doc1.name > doc2.name) {
            return 1
          }
          else {
            return 0;
          }
        });

        // console.log("all docs", firebaseDocs);
        this.documentListChangedEvent.next(firebaseDocs); // pass event to any subscribers
        return firebaseDocs;
      }));
  }

  // ********************************
  // Update documents in Firebase
  // ********************************
  storeDocuments() {
    const documentStringData = JSON.stringify(this.documents);
    this.http.put(
      "https://angular-contacts-cms-default-rtdb.europe-west1.firebasedatabase.app/documents.json", 
      documentStringData,
      {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }
    ).subscribe(responseData => {
      console.log(responseData);
      let documentsListClone = this.documents.slice();
      this.documentListChangedEvent.next(documentsListClone); // pass event to any subscribers      
    });
  }

  // ********************************
  // Return all documents
  // ********************************
  getDocuments() {
    console.log("getDocuments", this.documents);
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

    // Save changes to Firebase
    this.storeDocuments();
    // let documentsListClone = this.documents.slice();
    // this.documentListChangedEvent.next(documentsListClone); // pass event to any subscribers
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

    // Save changes to Firebase
    this.storeDocuments();
    // let documentsListClone = this.documents.slice();
    // this.documentListChangedEvent.next(documentsListClone); // pass event to any subscribers
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

    // Save changes to Firebase
    this.storeDocuments();
    // let documentsListClone = this.documents.slice();
    // this.documentListChangedEvent.next(documentsListClone); // pass event to any subscribers
    // vs this.documentListChangedEvent.next(this.documents.slice()); // pass event to any subscribers
  }
}