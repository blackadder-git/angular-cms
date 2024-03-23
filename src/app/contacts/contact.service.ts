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
  conURI = "http://localhost:3000/contacts/";

  constructor(private http: HttpClient) {
    // this.contacts = MOCKCONTACTS;
    this.initializeData();
  }

  // ********************************
  // load contacts
  // ********************************
  initializeData() {
    console.log("get contacts from MongoDB in init ...");

    // send get request to Express
    this.http.get<{message: string, contacts: Contact[]}>(this.conURI)
      .subscribe((contactData) => {
        this.contacts = contactData.contacts;
        // pass a copy of contacts
        this.contactListChangedEvent.next([...this.contacts]);
      });    
    /*
    this.http.get<{message: string, contacts: Contact[]}>('/contacts')
      .subscribe((contactData) => {
        this.contacts = contactData.contacts;
        // pass a copy of contacts
        this.contactListChangedEvent.next([...this.contacts]);

        // generate largest id
        this.maxContactId = this.getMaxId();        
      });*/
    
    /*  
    this.queryData().subscribe(contacts => {
      console.log("init", contacts);
      this.contacts = contacts;

      // alert subscribes to change
      this.contactListChangedEvent.next(this.contacts.slice());

      // generate largest id
      this.maxContactId = this.getMaxId();
    });*/
        
  }

  // ********************************
  // Get max contact id
  // ********************************
  /*
  getMaxId(): number {
    let maxId = 0;

    this.contacts.forEach((contact) => {
      let currentId = parseInt(contact.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    });

    return maxId
  }*/

  // ********************************
  // Get contacts from Firebase
  // ********************************
  /*
  queryData(): Observable<Contact[]> {
    return this.http.get<{ [id: string]: Contact }>(
      "/contacts").pipe(
        map((response) => Object.values(response))
      );

/*      
      return this.http.get<{ [id: string]: Contact }>(
        "https://angular-contacts-cms-default-rtdb.europe-west1.firebasedatabase.app/contacts.json").pipe(
          map((response) => Object.values(response))
        );
*/  
  //}

  // ********************************
  // Update contacts in Firebase
  // ********************************
  /*
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
  }*/

  // ********************************
  // Return all contacts
  // ********************************
  getContacts() {
    console.log("get contacts from MongoDB in services ...");
    console.log("getContacts", this.contacts.slice());
    //return this.contacts.slice();

    this.initializeData();

    /*
    this.http.get<{message: string, contacts: Contact[]}>('/contacts')
      .subscribe((contactData) => {
        this.contacts = contactData.contacts;
        // pass a copy of contacts
        this.contactListChangedEvent.next([...this.contacts]);

        // generate largest id
        this.maxContactId = this.getMaxId();        
      });
      */
  }

  // ********************************
  // Return contact object matching id or, if not found, return null
  // ********************************
  getContact(id: String) {
    console.log("getContact: ", id)
    
    // Using return inside a forEach loop exits the loop, not the function
    // Instead, use find to return the contact or null if not found
    let contact = this.contacts.find(con => con.id === id); // loop each contacts, compare id to the id passed to getContact
    console.log("getContact from services", contact);
    return contact;
  }

  // ********************************
  // Add a new contact to contacts
  // ********************************
  addContact(newContact: Contact) {
    console.log("Request new contact in services:", newContact.name);
    if (!newContact) {
      // Abort if contact wasn't passed
      return;
    }

    // make sure new Contact id is empty
    newContact.id = '';

    // send post request to Express
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.post<{ message: string, contact: Contact }>(this.conURI, newContact, { headers: headers })
      .subscribe(
        (responseData) => {
          // add new contact to contacts
          this.contacts.push(responseData.contact);
          this.contactListChangedEvent.next(this.contacts.slice()); // pass event to any subscribers
        }
      );

    // Push a new contact onto the list and emit change
    /*this.maxContactId++;
    newContact.id = "" + this.maxContactId;
    this.contacts.push(newContact);
    */
    
    // Save changes to Firebase
    // this.storeContacts();
    // let contactsListClone = this.contacts.slice();
    // this.contactListChangedEvent.next(contactsListClone); // pass event to any subscribers
  }

  // ********************************
  // Replace an existing contact in contacts
  // ********************************
  updateContact(originalContact: Contact, newContact: Contact) {
    console.log("Update existing contact:", originalContact.id, originalContact.name);

    if (!originalContact || !newContact) {
      // Abort if either contact is undefined
      return;
    }

    let pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      // Abort if original contact can't be found
      return;
    }

    // send update request to Express
    const headers = new HttpHeaders({'Content-Type': 'application/json'});    
    this.http.put(this.conURI + originalContact.id, newContact, { headers: headers })
      .subscribe(
        (responseData) => {
          // replace updated contact in contacts
          this.contacts[pos] = newContact;
          this.contactListChangedEvent.next(this.contacts.slice()); // pass event to any subscribers
        }
      );

    // Set id of new contact and replace in list
    // newContact.id = originalContact.id;
    // this.contacts[pos] = newContact;

    // Save changes to Firebase
    // this.storeContacts();
    // let contactsListClone = this.contacts.slice();
    // this.contactListChangedEvent.next(contactsListClone); // pass event to any subscribers
  }

  // ********************************
  // Delete a contact from contacts
  // ********************************
  deleteContact(contact: Contact) {
    console.log("Delete existing contact:", contact.id, contact.name);

    if (!contact) {
      // Abort if contact wasn't passed
      return;
    }

    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      // Abort if contact doesn't exist
      return;
    }

    // send delete request to Express
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.delete(this.conURI + contact.id, { headers: headers })
      .subscribe(
        (responseData) => {
          // Remove contact from list
          this.contacts.splice(pos, 1);
          this.contactListChangedEvent.next(this.contacts.slice()); // pass event to any subscribers
        }
      );

    // Remove contact from list
    // this.contacts.splice(pos, 1);
    // this.contactChangedEvent.emit(this.contacts.slice());
    
    // Save changes to Firebase
    // this.storeContacts();
    // let contactsListClone = this.contacts.slice();
    // this.contactListChangedEvent.next(contactsListClone); // pass event to any subscribers
    // vs this.contactListChangedEvent.next(this.contacts.slice()); // pass event to any subscribers
  }
}