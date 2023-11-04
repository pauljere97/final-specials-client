import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ApiService } from 'src/app/utils/api.service';
import { LoaderService } from 'src/app/utils/loader.service';

@Component({
    selector: 'app-match-summary',
    templateUrl: './match-summary.component.html',
    styleUrls: ['./match-summary.component.scss'],
})
export class MatchSummaryComponent {
    moment = moment;
    constructor(private api: ApiService, private router: Router) { }
    summary: any = [];
    ngOnInit(): void {
        this.api
            .get('match_summary')
            .then((res: any) => {
                this.summary = res['summary'];
                console.log(res['summary']);
            })
            .catch((e) => {
                console.log(e);
            });
    }

    redirect(date: string) {
        location.href = location.origin + '/#/inputs/' + date;
        window.location.reload();
    }
}
