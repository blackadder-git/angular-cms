import { Component, OnInit, OnDestroy } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent implements OnInit, OnDestroy {
  documents: Document[] = [];
  documentId: string = "";
  subscription: Subscription;

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    // load documents
    this.documents = this.documentService.getDocuments();

    // listen for the documentListChangedEvent, when it happens, get a list of documents
    this.subscription = this.documentService.documentListChangedEvent
      .subscribe(
        (documents: Document[]) => {
            this.documents = documents;
          }
        );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}