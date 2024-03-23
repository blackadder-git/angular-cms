import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { Contact } from '../../contacts/contact.model'
import { ContactService } from '../../contacts/contact.service';

@Component({
  selector: 'cms-message-item',
  templateUrl: './message-item.component.html',
  styleUrl: './message-item.component.css'
})
export class MessageItemComponent implements OnInit {
  @Input() message: Message;
  messageSender: string = "";

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    const sender = this.message.sender;
    console.log("Message Sender:", sender['id']);
    if (sender) {
      const contact: Contact = this.contactService.getContact(sender['id']);
      console.log("Contact object", contact);
      if (contact) {
        this.messageSender = contact.name;
      }
      else {
        console.log("Undefined contact");
      }
    }
    else {
      console.log("Undefined sender");
    }
  }
}
