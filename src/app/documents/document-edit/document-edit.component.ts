import { Component, OnInit } from '@angular/core'; 
import { NgForm } from '@angular/forms';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrl: './document-edit.component.css'
})
export class DocumentEditComponent implements OnInit {

  originalDocument: Document;
  document: Document;
  editMode: boolean = false;

  constructor(private documentService: DocumentService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params
      .subscribe ((params: Params) => {
        // Get the id from the currently active route
        const id = params["id"];
        if (id === undefined || id === null) {
          // No id was found therefore a new document is being added
          this.editMode = false;
          return;
        }

        // Get existing document
        this.originalDocument = this.documentService.getDocument(id);

        if (this.originalDocument === undefined || this.originalDocument === null) {
          // The requested document does not exist
          return;
        }

        // Document was found and is set to edit
        this.editMode = true;
        // Clone an object: https://www.freecodecamp.org/news/clone-an-object-in-javascript/
        // this.document = { ...this.originalDocument }
        this.document = JSON.parse(JSON.stringify(this.originalDocument));
    });
  }

  onCancel() {
    this.router.navigate(["/documents"]);
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
    let value = form.value;
    let newDocument = new Document("", value.name, value.description, value.url );

    if (this.editMode == true) {
      // Update takes care of assigning the new id
      this.documentService.updateDocument(this.originalDocument, newDocument);
    }
    else {
      // Add a new document
      this.documentService.addDocument(newDocument)
    }

    this.router.navigate(["/documents"]);
  }
}