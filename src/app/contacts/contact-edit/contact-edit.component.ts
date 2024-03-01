import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl } from '@angular/forms';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrl: './contact-edit.component.css'
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact;
  contact: Contact;
  groupContacts: Contact[] = [];
  editMode: boolean = false;

  constructor(private contactService: ContactService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params
      .subscribe ((params: Params) => {
        // Get the id from the currently active route
        const id = params["id"];
        if (id === undefined || id === null) {
          // No id was found therefore a new contact is being added
          this.editMode = false;
          return;
        }

        // Get existing contact
        this.originalContact = this.contactService.getContact(id);

        if (this.originalContact === undefined || this.originalContact === null) {
          // The requested contact does not exist
          return;
        }

        // Contact was found and is set to edit
        this.editMode = true;
        // Clone an object: https://www.freecodecamp.org/news/clone-an-object-in-javascript/
        // this.document = { ...this.originalContact }
        this.contact = JSON.parse(JSON.stringify(this.originalContact));

        if (this.originalContact.group != null) {
          this.groupContacts = JSON.parse(JSON.stringify(this.originalContact.group));
        }
    });
  }

  onCancel() {
    this.router.navigate(["/contacts"]);
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
    let value = form.value;
    console.log("GROUP CONTACTS", value.groupContacts);
    let newContact = new Contact("", value.name, value.email, value.phone, value.imageUrl, this.groupContacts);

    if (this.editMode == true) {
      console.log("Update contact");
      // Update takes care of assigning the new id
      this.contactService.updateContact(this.originalContact, newContact);
    }
    else {
      console.log("Add new contact");
      // Add a new contact
      this.contactService.addContact(newContact)
    }

    this.router.navigate(["/contacts"]);
  }

  addToGroup(event: CdkDragDrop<Contact[]>): void {
    // console.log("previousContainer.data", event.previousContainer.data);
    // console.log("container.data", event.container.data);
    // console.log("previousIndex", event.previousIndex);
    // console.log("currentIndex", event.currentIndex);

    // console.log(event.previousContainer.data[event.previousIndex])

    /*
    transferArrayItem (
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    )*/
  
    const selectedContact: Contact = event.previousContainer.data[event.previousIndex];
    const invalidGroupContact = this.isInvalidContact(selectedContact);
    if (invalidGroupContact){
       return;
    }
    this.groupContacts.push(selectedContact);

    console.log("CONTACTS", this.groupContacts);
  }


  // Make sure contact is not already in the list
  isInvalidContact(newContact: Contact) {
    console.log("validateContact", newContact);
    if (!newContact) {// newContact has no value
      return true;
    }
    if (this.contact && newContact.id === this.contact.id) {
      return true;
    }
    for (let i = 0; i < this.groupContacts.length; i++){
      if (newContact.id === this.groupContacts[i].id) {
        return true;
      }
    }
    return false;
  }


  onRemoveItem(index: number) {
    if (index < 0 || index >= this.groupContacts.length) {
      return;
    }
    this.groupContacts.splice(index, 1);
 }

}