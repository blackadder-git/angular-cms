import { EventEmitter, Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Contact } from './contact.model';
//import { MOCKCONTACTS } from './MOCKCONTACTS';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contacts: Contact[] = [];
  contactSelectedEvent = new EventEmitter<Contact>();
  //contactChangedEvent = new EventEmitter<Contact[]>();
  contactListChangedEvent = new Subject<Contact[]>();
  maxContactId: number = 0;

  constructor(private http: HttpClient) {
    // this.contacts = MOCKCONTACTS;
    this.initializeData();
  }

  // ********************************
  // load contacts
  // ********************************
  initializeData() {
    this.queryData().subscribe(contacts => {
      this.contacts = contacts;

      // generate largest id
      this.maxContactId = this.getMaxId();
    });    
  }

  // ********************************
  // Get max contact id
  // ********************************
  getMaxId(): number {
    let maxId = 0;

    this.contacts.forEach((contact) => {
      let currentId = parseInt(contact.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    });

    return maxId
  }

  // ********************************
  // Get contacts from Firebase
  // ********************************
  queryData(): Observable<Contact[]> {
    return this.http.get<{ [id: string]: Contact }>(
      "https://angular-contacts-cms-default-rtdb.europe-west1.firebasedatabase.app/contacts.json")
      .pipe(map(responseData => {
        // Convert JSON object to JavaScript object
        const firebaseContacts: Contact[] = [];
        for (const key in responseData) {
          firebaseContacts.push({ ...responseData[key], id: key })
        }

        // console.log("all docs", firebaseContacts);
        this.contactListChangedEvent.next(firebaseContacts); // pass event to any subscribers
        return firebaseContacts;
      }));
  }

  // ********************************
  // Update contacts in Firebase
  // ********************************
  storeContacts() {
    const contactStringData = JSON.stringify(this.contacts);
    this.http.put(
      "https://angular-contacts-cms-default-rtdb.europe-west1.firebasedatabase.app/contacts.json", 
      contactStringData,
      {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }
    ).subscribe(responseData => {
      console.log(responseData);
      let contactsListClone = this.contacts.slice();
      this.contactListChangedEvent.next(contactsListClone); // pass event to any subscribers      
    });
  }

  // ********************************
  // Return all contacts
  // ********************************
  getContacts() {
    return this.contacts.slice();
  }

  // ********************************
  // Return contact object matching id or, if not found, return null
  // ********************************
  getContact(id: String) {
    console.log("Contact Lookup: ", id)
    
    // Using return inside a forEach loop exits the loop, not the function
    // Instead, use find to return the contact or null if not found
    return this.contacts.find(contact => contact.id === id);
  }

  // ********************************
  // Add a new contact to contacts
  // ********************************
  addContact(newContact: Contact) {
    if (!newContact) {
      // Abort if contact wasn't passed
      return;
    }

    // Push a new contact onto the list and emit change
    this.maxContactId++;
    newContact.id = "" + this.maxContactId;
    this.contacts.push(newContact);
    
    // Save changes to Firebase
    this.storeContacts();
    // let contactsListClone = this.contacts.slice();
    // this.contactListChangedEvent.next(contactsListClone); // pass event to any subscribers
  }

  // ********************************
  // Replace an existing contact in contacts
  // ********************************
  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      // Abort if either contact is undefined
      return;
    }

    let pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      // Abort if original contact can't be found
      return;
    }

    // Set id of new contact and replace in list
    newContact.id = originalContact.id;

    console.log("UPDATED CONTACT", newContact);

    this.contacts[pos] = newContact;

    // Save changes to Firebase
    this.storeContacts();
    // let contactsListClone = this.contacts.slice();
    // this.contactListChangedEvent.next(contactsListClone); // pass event to any subscribers
  }

  // ********************************
  // Delete a contact from contacts
  // ********************************
  deleteContact(contact: Contact) {
    if (!contact) {
      // Abort if contact wasn't passed
      return;
    }

    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      // Abort if contact doesn't exist
      return;
    }

    // Remove contact from list
    this.contacts.splice(pos, 1);
    //this.contactChangedEvent.emit(this.contacts.slice());
    
    // Save changes to Firebase
    this.storeContacts();
    // let contactsListClone = this.contacts.slice();
    // this.contactListChangedEvent.next(contactsListClone); // pass event to any subscribers
    // vs this.contactListChangedEvent.next(this.contacts.slice()); // pass event to any subscribers
  }
}