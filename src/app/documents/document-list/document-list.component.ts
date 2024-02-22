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

  constructor(private documentService: DocumentService) {
    this.documents = this.documentService.getDocuments(); // load MOCKDOCUMENTS
  }

  ngOnInit(): void {
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