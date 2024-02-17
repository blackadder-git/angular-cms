import { Component, Input, OnInit } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'cms-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.css'
})
export class ContactDetailComponent implements OnInit {
  contact: Contact;

  constructor(private contactService: ContactService, 
              private router: Router, 
              private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.route.params
      .subscribe((params: Params) => {
        this.contact = this.contactService.getContact(params["id"]);
      });
  }

  onDelete() {
    this.contactService.deleteContact(this.contact);
    this.router.navigateByUrl("/contacts");
  }
}