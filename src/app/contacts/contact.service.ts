import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contacts: Contact[] = [];
  contactSelectedEvent = new EventEmitter<Contact>();
  //contactChangedEvent = new EventEmitter<Contact[]>();
  contactListChangedEvent = new Subject<Contact[]>();
  maxContactId: number = 0;

  constructor() {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
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
  // Return all conctacts
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
    let contactsListClone = this.contacts.slice();
    this.contactListChangedEvent.next(contactsListClone);
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
    this.contacts[pos] = newContact;
    let contactsListClone = this.contacts.slice();
    this.contactListChangedEvent.next(contactsListClone);
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
    let contactsListClone = this.contacts.slice();
    this.contactListChangedEvent.next(contactsListClone);

    //this.contactListChangedEvent.next(this.contacts.slice());  
  }
}