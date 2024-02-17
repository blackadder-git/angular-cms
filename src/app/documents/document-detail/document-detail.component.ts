import { Component, OnInit } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { WinRefService } from '../../win-ref.service';

@Component({
  selector: 'cms-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrl: './document-detail.component.css'
})
export class DocumentDetailComponent implements OnInit {
  document: Document;
  id: string;
  nativeWindow: any;

  constructor(private documentService: DocumentService, 
              private router: Router, 
              private route: ActivatedRoute,
              private winRefService: WinRefService) {

    this.nativeWindow = this.winRefService.getNativeWindow();
  }

  ngOnInit(): void {
    this.route.params
      .subscribe((params: Params) => {
        this.document = this.documentService.getDocument(params["id"]);
      });
  }

  onView() {
    console.log(this.document.url);

    if (this.document.url) {
      this.nativeWindow.open(this.document.url);
    }
  }

  onDelete() {
    this.documentService.deleteDocument(this.document);
    this.router.navigate(["/documents"]);
  }
}