import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-show-match',
  templateUrl: './show-match.component.html',
  styleUrls: ['./show-match.component.scss']
})
export class ShowMatchComponent {
  constructor(
    public dialogRef: MatDialogRef<ShowMatchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer,
  ) { }

  iframe_link = this.sanitizer.bypassSecurityTrustResourceUrl(this.data)
}
