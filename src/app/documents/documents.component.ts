import { Component, Input, OnInit } from '@angular/core';
import { Document } from './document.model';
import { DocumentService } from './document.service';

@Component({
  selector: 'cms-documents',
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css',
  providers: [DocumentService]
})
export class DocumentsComponent implements OnInit {
  selectedDocument: Document;

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    // listen for the documentSelectedEvent to happen
    // when it does, set selectedDocument to the document passed by the event
    this.documentService.documentSelectedEvent
      .subscribe(
        (document: Document) => {
          this.selectedDocument = document;
        }
      );
  }
}
