import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from 'src/app/utils/api.service';

@Component({
    selector: 'app-show-match',
    templateUrl: './show-match.component.html',
    styleUrls: ['./show-match.component.scss'],
})
export class ShowMatchComponent {
    constructor(
        public dialogRef: MatDialogRef<ShowMatchComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private sanitizer: DomSanitizer,
        private api: ApiService
    ) { }

    iframe_link = this.sanitizer.bypassSecurityTrustResourceUrl(this.data['url']);

    ht_result = '0';
    ft_result = '0';

    ngOnInit(): void {
        this.ht_result = this.data['ht_result'];
        this.ft_result = this.data['ft_result'];
        setTimeout(() => {
            const element = document.getElementById('modal');
            if (element) {
                console.log('SCROLLS');
                element.scrollTop = 0;
            }
        }, 1000);
    }

    save_result(match: any) {
        match['ht_result'] = this.ht_result;
        match['ft_result'] = this.ft_result;
        if (this.ft_result || this.ht_result) {
            this.dialogRef.close(match);
        } else {
            alert("No Result Selected")
        }
    }
    delete_result(id: any) {
        if (this.data['unsaved_matches'] > 0) {
            alert("First Save Unsaved Matches")
            return
        }
        this.api
            .put('delete_match', {
                id: id,
            })
            .then((res: any) => {
                this.dialogRef.close("DELETE");
            })
            .catch((e: any) => {
                console.log(e);
            });
    }
}
