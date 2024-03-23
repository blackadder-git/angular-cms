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
  docURI = "http://localhost:3000/documents";

  constructor(private http: HttpClient) { 
    // this.documents = MOCKDOCUMENTS;
    this.initializeData();
  }

  // ********************************
  // load documents
  // ********************************
  initializeData() {
    console.log("get documents from MongoDB in init ...");

    // send get request to Express
    this.http.get<{message: string, documents: Document[]}>(this.docURI)
      .subscribe((documentData) => {
        this.documents = documentData.documents;
        this.sortDocuments();
        // pass a copy of documents
        this.documentListChangedEvent.next([...this.documents]);
      });
  }

  // ********************************
  // Sort documents in ascending order by name (title)
  // ********************************
  sortDocuments() {
    // sort the data before saving
    this.documents.sort((doc1, doc2)  => {
      const lowerCase1 = doc1.name.toLowerCase();
      const lowerCase2 = doc2.name.toLowerCase();
      if (lowerCase1 < lowerCase2) {
        // console.log("sort -1");
        return -1;
      }
      else if (lowerCase1 > lowerCase2) {
        // console.log("sort 1");
        return 1
      }
      return 0;
    });

    // console.log("Sorted the docs: ", this.documents);
  }

  // ********************************
  // Get max document id
  // ********************************
  /*getMaxId(): number {
    let maxId = 0;

    this.documents.forEach((document) => {
      let currentId = parseInt(document.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    });

    return maxId
  }*/

  // ********************************
  // Get documents from Firebase
  // ********************************
  /*queryData(): Observable<Document[]> {
    return this.http.get<{ [id: string]: Document }>(
      "https://angular-contacts-cms-default-rtdb.europe-west1.firebasedatabase.app/documents.json").pipe(
        map((response) => Object.values(response))
      );
  }*/

  // ********************************
  // Update documents in Firebase
  // "https://angular-contacts-cms-default-rtdb.europe-west1.firebasedatabase.app/documents.json", 
  // ********************************
  /*storeDocuments() {
    console.log("In store documents, how did I get here?");
    this.sortDocuments();    
    const documentStringData = JSON.stringify(this.documents);
    this.http.put(
      "/documents", 
      documentStringData,
      {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }
    ).subscribe(responseData => {
      console.log(responseData);

      this.documentListChangedEvent.next(this.documents); // pass event to any subscribers
    });
  }*/

  // ********************************
  // Return all documents
  // ********************************
  getDocuments() {
    console.log("get documents from MongoDB in services ...");
    console.log("getDocuments", this.documents.slice());
    //return this.documents.slice();

    this.initializeData();
  }

  // ********************************
  // Return document object matching id or, if not found, return null
  // ********************************
  getDocument(id: string) {
    console.log("getDocument() Lookup: ", id)
    
    // Using return inside a forEach loop exits the loop, not the function
    // Instead, use find to return the document or null if not found
    return this.documents.find(document => document.id === id);
  }

  // ********************************
  // Add a new document to documents
  // ********************************
  addDocument(newDocument: Document) {
    console.log("Request new document in services:", newDocument.name);
    if (!newDocument) {
      // Abort if document wasn't passed
      return;
    }
    
    // make sure new Document id is empty
    newDocument.id = '';

    // send post request to Express
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.post<{ message: string, document: Document }>(this.docURI, newDocument, { headers: headers })
      .subscribe(
        (responseData) => {
          // add new document to documents
          this.documents.push(responseData.document);
          this.sortDocuments();
          this.documentListChangedEvent.next(this.documents.slice()); // pass event to any subscribers
        }
      );

    // Add _id
    // newDocument._id = "" + this.maxDocumentId + 5;

    // Push a new document onto the list and emit change
    // this.maxDocumentId++;
    // newDocument.id = "" + this.maxDocumentId;
    // this.documents.push(newDocument);

    // Save changes to Firebase
    // this.storeDocuments();
    // let documentsListClone = this.documents.slice();
    // this.documentListChangedEvent.next(documentsListClone); // pass event to any subscribers
  }

  // ********************************
  // Replace an existing document in documents
  // ********************************
  updateDocument(originalDocument: Document, newDocument: Document) {
    console.log("Update existing doc:", originalDocument.id, originalDocument.name);
    
    if (!originalDocument || !newDocument) {
      // Abort if either document is undefined
      return;
    }

    let pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      // Abort if original document can't be found
      return;
    }

    // send update request to Express
     const headers = new HttpHeaders({'Content-Type': 'application/json'});
     this.http.put(this.docURI + "/" + originalDocument.id, newDocument, { headers: headers })
      .subscribe(
        (responseData) => {
          // replace updated document in documents
          this.documents[pos] = newDocument;
          this.sortDocuments();
          this.documentListChangedEvent.next(this.documents.slice()); // pass event to any subscribers
        }
      );

    // Set id of new document and replace in list
    // newDocument.id = originalDocument.id;
    // this.documents[pos] = newDocument;

    // Save changes to Firebase
    // this.storeDocuments();
    // let documentsListClone = this.documents.slice();
    // this.documentListChangedEvent.next(documentsListClone); // pass event to any subscribers
  }

  // ********************************
  // Delete a document from documents
  // ********************************
  deleteDocument(document: Document) {
    console.log("Delete existing doc:", document.id, document.name);

    if (!document) {
      // Abort if document wasn't passed
      return;
    }
 
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      // Abort if document doesn't exist
      return;
    }

    // send delete request to Express
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.delete(this.docURI + "/" + document.id, { headers: headers })
      .subscribe(
        (responseData) => {
          // Remove document from list
          this.documents.splice(pos, 1);
          this.documentListChangedEvent.next(this.documents.slice()); // pass event to any subscribers
        }
      );

    // this.documentChangedEvent.emit(this.documents.slice()); 

    // Save changes to Firebase
    // this.storeDocuments();
    // let documentsListClone = this.documents.slice();
    // this.documentListChangedEvent.next(documentsListClone); // pass event to any subscribers
  }
}