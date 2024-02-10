import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messages: Message[] = [];
  messageChangedEvent = new EventEmitter<Message>();

  constructor() {
    this.messages = MOCKMESSAGES;
   }

   getMessages() {
    return this.messages.slice();
   }

   // Return message object matching id or, if not found, return null
   getMessage(id: string) {
    console.log("Message Lookup: ", id)
    
    // Using return inside a forEach loop exits the loop, not the function
    // Instead, use find to return the message or null if not found
    return this.messages.find(message => message.id === id);
   }

   addMessage(message: Message) {
    this.messages.push(message);
    this.messageChangedEvent.emit(message);
   }

   getNextMessageId(): string {
    /*
    if (this.messages.length > 1) {
      // increment last message id to avoid problems if messages are deleted
      return '' + (Number(this.messages[this.messages.length - 1].id) + 1);
    }
    return '0';
    */
    return (this.messages.length > 1) ? '' + (Number(this.messages[this.messages.length - 1].id) + 1) : '0';
   }
}
