import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent implements OnInit {
  @Output() selectedContactEvent = new EventEmitter<Contact>();

  contacts: Contact[] = [];

  constructor(private contactService: ContactService) {

  }

  ngOnInit(): void {
    this.contacts = this.contactService.getContacts();
  }


  // when element is clicked, send event to parent
  onSelected(contact: Contact) {
    this.selectedContactEvent.emit(contact);
  }
}
