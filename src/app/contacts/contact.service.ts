import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contacts: Contact[] = [];
  contactSelectedEvent = new EventEmitter<Contact>();

  constructor() {
    this.contacts = MOCKCONTACTS;
  }

  getContacts() {
    return this.contacts.slice();
  }

  // Return contact object matching id or, if not found, return null
  getContact(id: String) {
    console.log("Contact Lookup: ", id)
    
    // Using return inside a forEach loop exits the loop, not the function
    // Instead, use find to return the contact or null if not found
    return this.contacts.find(contact => contact.id === id);
  }
}
