import { Component } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent {
  messages : Message[] = []; // new Message("1", "subject", "message", "sender"),
  
  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
