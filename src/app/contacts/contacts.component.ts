import { Component, Input, OnInit } from '@angular/core';
import { Contact } from './contact.model';
import { ContactService } from './contact.service';

@Component({
  selector: 'cms-contacts',
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css',
  providers: [ContactService]
})
export class ContactsComponent implements OnInit {
  selectedContact: Contact;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    // listen for the contactSelectedEvent to happen
    // when it happens set the selectedContact to contact
    this.contactService.contactSelectedEvent
      .subscribe(
        (contact: Contact) => {
          this.selectedContact = contact;
        }
      );
  }
}
