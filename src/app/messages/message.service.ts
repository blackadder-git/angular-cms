import { EventEmitter, Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Message } from './message.model';
//import { MOCKMESSAGES } from './MOCKMESSAGES';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ContactService } from '../contacts/contact.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messages: Message[] = [];
  //messageChangedEvent = new EventEmitter<Message>();
  messageListChangedEvent = new Subject<Message[]>();
  maxMessageId: number = 0;
  msgURI = "http://localhost:3000/messages";

  constructor(private http: HttpClient, private contact: ContactService) {
    // this.messages = MOCKMESSAGES;
    console.log("get messages from MongoDB in constructor ...");
    this.initializeData();
   }

  // ********************************
  // load messages
  // ********************************
  initializeData() {
    console.log("get messages from MongoDB in init ...");

    // send get request to Express
    this.http.get<{message: string, messages: Message[]}>(this.msgURI)
      .subscribe((messageData) => {
        this.messages = messageData.messages;
        // pass a copy of messages
        this.messageListChangedEvent.next([...this.messages]);
      });

    /*
    this.queryData().subscribe(messages => {
      this.messages = messages;

      // alert subscribes to change
      this.messageListChangedEvent.next(this.messages.slice());

      // generate largest id
      this.maxMessageId = this.getMaxId();
    });*/    
  }

  // ********************************
  // Get messages from Firebase
  // ********************************
  /*
  queryData(): Observable<Message[]> {
    return this.http.get<{ [id: string]: Message }>(
      "https://angular-contacts-cms-default-rtdb.europe-west1.firebasedatabase.app/messages.json").pipe(
        map((response) => Object.values(response))
      );
  }*/

  // ********************************
  // Update messages in Firebase
  // ********************************
  /*storeMessages() {
    const messageStringData = JSON.stringify(this.messages);
    this.http.put(
      "https://angular-contacts-cms-default-rtdb.europe-west1.firebasedatabase.app/messages.json", 
      messageStringData,
      {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }
    ).subscribe(responseData => {
      console.log(responseData);
      let messagesListClone = this.messages.slice();
      this.messageListChangedEvent.next(messagesListClone); // pass event to any subscribers      
    });
  }*/

  // ********************************
  // Get max message id
  // ********************************
  /*getMaxId(): number {
    let maxId = 0;

    this.messages.forEach((message) => {
      let currentId = parseInt(message.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    });

    return maxId
  }*/

  // ********************************
  // Return all messages
  // ********************************
  getMessages() {
    console.log("get messages from MongoDB in services ...");
    console.log("getMessages", this.messages.slice());

    this.initializeData();
  }

  // Return message object matching id or, if not found, return null
  getMessage(id: string) {
    console.log("Message Lookup: ", id)
    
    // Using return inside a forEach loop exits the loop, not the function
    // Instead, use find to return the message or null if not found
    return this.messages.find(message => message.id === id);
  }

  addMessage(newMessage: Message) {
    console.log("Request new message in services:", newMessage.subject);
    if (!newMessage) {
      // Abort if message wasn't passed
      return;
    }

    // make sure new Message id is empty
    newMessage.id = '';

    // send post request to Express
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.post<{ message: string, messageObject: Message }>(this.msgURI, newMessage, { headers: headers })
      .subscribe(
        (responseData) => {
          // add new message to messages
          console.log("message sent in response", responseData.messageObject);
          console.log("message added to array", newMessage);
          //newMessage['sender'] = "0";//this.contact.getContact("0");

          //this.messages.push({});
          this.initializeData();
          //this.messageListChangedEvent.next(this.messages.slice()); // pass event to any subscribers
        }
      );

    //this.messages.push(message);
    //this.messageChangedEvent.emit(message);

    // Push a new contact onto the list and emit change
    // this.maxMessageId++;
    // message.id = "" + this.maxMessageId;
    // this.messages.push(message);
    
    // Save changes to Firebase
    // this.storeMessages();
  }

  // NO LONGER NEED THIS FUNCTION
  /*
  getNextMessageId(): string {
    /*
    if (this.messages.length > 1) {
      // increment last message id to avoid problems if messages are deleted
      return '' + (Number(this.messages[this.messages.length - 1].id) + 1);
    }
    return '0';
    * /
    // turn number into a string
    // return '' + this.getMaxId();
    // return (this.messages.length > 1) ? '' + (Number(this.messages[this.messages.length - 1].id) + 1) : '0';
  }*/
}
