import { Component } from '@angular/core';
import { MessageService } from './message.service';
import { ContactService } from '../contacts/contact.service';

@Component({
  selector: 'cms-messages',
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
  providers: [MessageService, ContactService]
})
export class MessagesComponent {

}
