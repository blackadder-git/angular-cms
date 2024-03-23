import { Component, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { Subscription } from 'rxjs';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent implements OnInit, OnDestroy {
  contacts: Contact[] = [];
  subscription: Subscription;
  term: string = "";

  constructor(private contactService: ContactService) {}

  // get list of contacts from service
  ngOnInit(): void {
    // load contacts
    this.contactService.getContacts();

    // listen for the contactListChangedEvent, when it happens, get a list of contacts
    this.subscription = this.contactService.contactListChangedEvent
      .subscribe(
        (contacts: Contact[]) => {
            this.contacts = contacts;
            console.log("All Contacts in list", this.contacts);
          }
        );    
  }

  search(value: string) {
    this.term = value;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}