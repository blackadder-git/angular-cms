import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl } from '@angular/forms';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrl: './contact-edit.component.css'
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact;
  contact: Contact;
  groupContacts: Contact[];
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
    let newContact = new Contact("", value.name, value.email, value.phone, value.imageUrl);

    if (this.editMode == true) {
      // Update takes care of assigning the new id
      this.contactService.updateContact(this.originalContact, newContact);
    }
    else {
      // Add a new contact
      this.contactService.addContact(newContact)
    }

    this.router.navigate(["/contacts"]);
  }

  addToGroup(event: any): void {
    console.log("addToGroup", event.item.data);

    const selectedContact: Contact = event.item.data;
    const invalidGroupContact = this.isInvalidContact(selectedContact);
    if (invalidGroupContact){
       return;
    }
    this.groupContacts.push(selectedContact);

  }


  // Make sure contact is not already in the list
  isInvalidContact(newContact: Contact) {
    console.log("newContact", newContact);
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

}