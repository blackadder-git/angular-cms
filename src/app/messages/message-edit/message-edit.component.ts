import { Component, ElementRef, EventEmitter, ViewChild, Output } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.css'
})
export class MessageEditComponent {
  currentSender = '0'; // uses contact id now to get contact object later
  @ViewChild("subject") subject: ElementRef;
  @ViewChild("msgText") msgText: ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>();

  constructor(private messageService: MessageService) {}

  onSendMessage() {
    const message = new Message(
      this.messageService.getNextMessageId(), // will break if messags are deleted since duplicate ids may occur
      this.subject.nativeElement.value, 
      this.msgText.nativeElement.value, 
      this.currentSender);
    this.messageService.addMessage(message); // add to messages array
    
    console.log("New Message id", message.id);
  }

  onClear() {
    this.subject.nativeElement.value = "";
    this.msgText.nativeElement.value = "";
  }
}
