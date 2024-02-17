import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];

  constructor(private contactService: ContactService) {
    this.contacts = this.contactService.getContacts();  // load MOCKCONTACTS
  }

  // get list of contacts from service
  ngOnInit(): void {
    this.contactService.contactChangedEvent
      .subscribe(
        (contacts: Contact[]) => {
            this.contacts = contacts;
          }
        );    
  }
}