import { Component, ElementRef, EventEmitter, ViewChild, Output } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.css'
})
export class MessageEditComponent {
  currentSender = "JC"
  @ViewChild("subject") subject: ElementRef;
  @ViewChild("msgText") msgText: ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>();

  onSendMessage() {
    const message = new Message("32", this.subject.nativeElement.value, this.msgText.nativeElement.value, this.currentSender);
    this.addMessageEvent.emit(message);
  }

  onClear() {
    this.subject.nativeElement.value = "";
    this.msgText.nativeElement.value = "";
  }
}
