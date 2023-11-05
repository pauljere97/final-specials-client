import { Component, OnInit } from '@angular/core';
import { ShowMatchComponent } from 'src/app/dialogs/show-match/show-match.component';
import { ApiService } from 'src/app/utils/api.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
    selector: 'app-match-input',
    templateUrl: './match-input.component.html',
    styleUrls: ['./match-input.component.scss'],
    // standalone: true,
    // imports: [
    //     MatFormFieldModule,
    //     MatInputModule,
    //     MatDatepickerModule,
    //     MatNativeDateModule,
    //     MatIconModule,
    //   ],
})
export class MatchInputComponent implements OnInit {
    data = [];
    selected_row = 0;

    day: any = new Date().getDate();
    month: any = new Date().getMonth() + 1;
    year: any = new Date().getFullYear();
    date: any = '';

    constructor(
        private api: ApiService,
        private dialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute
    ) {
        if (this.month < 10) this.month = '0' + this.month;
        if (this.day < 10) this.day = '0' + this.day;

        this.date = this.year + '-' + this.month + '-' + this.day;
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe((params: ParamMap) => {
            if (params.get('date')) {
                this.date = params.get('date');
            }
        });
        this.fetchMatches();
    }

    change_date() {
        console.log("Clicked")
        location.href = location.origin + '/#/inputs/' + this.date;
        window.location.reload();
    }
    complete = 0;
    fetchMatches(date = this.date): void {
        this.api
            .get('get_day_matches?date=' + date)
            .then((res: any) => {
                this.data = res['matches'].filter((element: any) => {
                    element['complete'] = element['ht_result'] && element['ft_result'] ? 1 : 0;
                    return true;
                });
                this.data.sort((a: any, b: any) =>
                    a.start_time > b.start_time ? 1 : b.start_time > a.start_time ? -1 : 0
                );
                this.data.sort((a: any, b: any) =>
                    a.complete > b.complete ? 1 : b.complete > a.complete ? -1 : 0
                );
                this.complete = this.data.filter((e: any) => e.complete).length;
            })
            .catch((e) => {
                this.router.navigateByUrl('/login');
                console.log(e);
            });
    }

    showMatch(match: any) {
        const dialogRef = this.dialog.open(ShowMatchComponent, {
            width: '700px',
            data: match,
        });
        dialogRef.afterClosed().subscribe((res: any) => {
            if (res) {
                this.ngOnInit();
            }
        });
    }

    ht_result = '0';
    ft_result = '0';
    save_result(match: any) {
        match['ht_result'] = this.ht_result;
        match['ft_result'] = this.ft_result;

        this.api
            .put('update_matches', [match])
            .then((res: any) => {
                this.ngOnInit();
                this.selected_row = 0;
                this.ht_result = '0';
                this.ft_result = '0';
            })
            .catch((e: any) => {
                console.log(e);
                this.router.navigateByUrl('/login');
            });
    }

    jsonFile = null;
    readJSON(e: any): void {
        const file = e.files[0];
        if (!file) {
            alert('Date or JSON missing');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e: any) => {
            try {
                const data = JSON.parse(e.target.result);
                this.saveData(this.cleanData(data.matches));
            } catch (error) {
                console.error('Error parsing JSON file:', error);
            }
        };
        reader.readAsText(file);
    }

    cleanData(data: any): void {
        data = data.filter((e: any) => e['home_odds']);
        let result: any = [];
        data.forEach((element: any) => {
            let obj: any = {};
            obj['url'] = element['url'];
            obj['date'] = this.date;
            obj['start_time'] = element['start_time'];
            if (element['finshed']) obj['start_time'] = element['finshed'];
            obj['away_team'] = element['away_team'];
            obj['home_team'] = element['home_team'];
            obj['ft_result'] = '';
            obj['ht_result'] = '';
            if (element['home_score']) {
                if (element['home_score'] > element['away_score']) obj['ft_result'] = '1';
                if (element['home_score'] < element['away_score']) obj['ft_result'] = '2';
                if (element['home_score'] === element['away_score']) obj['ft_result'] = 'X';
            }

            obj['home_odds'] = element['home_odds'];
            obj['draw_odds'] = element['draw_odds'];
            obj['away_odds'] = element['away_odds'];

            if (+element['home_odds'] >= 2 && +element['home_odds'] < 3 && +element['away_odds'] >= 2)
                result.push(obj);
            else if (+element['home_odds'] <= 1.6) result.push(obj);
            else if (+element['away_odds'] <= 1.7) result.push(obj);
        });
        return result;
    }

    saveData(data: any): void {
        let to_update_ids: any = [];
        let new_records: any = [];
        data.forEach((element: any) => {
            let record: any = this.data.find((e: any) => element['url'] === e['url'] && this.date === e['date']);
            if (record) {
                if (!element['start_time'] && element['ft_result']) {
                    record['ft_result'] = element['ft_result'];
                    element = record;
                    if (!to_update_ids.includes(element['id']) && element['id']) {
                        to_update_ids.push(element['id']);
                    }
                }
            } else {
                new_records.push(element);
            }
        });

        if (new_records.length) {
            this.api
                .post('save_matches', { matches: new_records })
                .then((data) => {
                    this.fetchMatches(this.date);
                })
                .catch((error: any) => {
                    console.log(error);
                });
        }

        let update_records = data.filter((e: any) => to_update_ids.includes(e['id']));
        if (update_records.length) {
            this.api
                .put('update_matches', { matches: update_records })
                .then((data) => {
                    this.fetchMatches(this.date);
                })
                .catch((error: any) => {
                    console.log(error);
                });
        }
    }
}
