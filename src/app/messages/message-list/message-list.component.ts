import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent implements OnInit {
  messages : Message[] = [];
  
  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.messages = this.messageService.getMessages();
    //console.log(this.messages)
    // listen for the contactSelectedEvent to happen
    // when it happens set the selectedContact to contact
    this.messageService.messageChangedEvent
      .subscribe(
        (message: Message) => {
          this.messages = this.messageService.getMessages();
        }
      );

  }

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
