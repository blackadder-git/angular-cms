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
  messageSender: string;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    console.log("Message Sender:", this.message.sender);
    const contact: Contact = this.contactService.getContact(this.message.sender);
    console.log(contact)
    this.messageSender = contact.name;
  }
}
