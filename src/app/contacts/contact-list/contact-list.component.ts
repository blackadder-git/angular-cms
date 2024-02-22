import { Component, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent implements OnInit, OnDestroy {
  contacts: Contact[] = [];
  subscription: Subscription;

  constructor(private contactService: ContactService) {
    this.contacts = this.contactService.getContacts();  // load MOCKCONTACTS
  }

  // get list of contacts from service
  ngOnInit(): void {
    this.subscription = this.contactService.contactListChangedEvent
      .subscribe(
        (contacts: Contact[]) => {
            this.contacts = contacts;
          }
        );    
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}