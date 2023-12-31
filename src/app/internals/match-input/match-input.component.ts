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
    data: any = [];
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
    total = 0
    fetchMatches(date = this.date): void {
        this.api
            .get('get_day_matches?date=' + date)
            .then((res: any) => {
                this.total = res['total']
                this.data = res['matches'].filter((element: any) => {
                    element['complete'] = element['ht_result'] && element['ft_result'] ? 1 : 0;
                    return true;
                });
                this.data.sort((a: any, b: any) =>
                    a.start_time > b.start_time ? 1 : b.start_time > a.start_time ? -1 : 0
                );
                // this.data.sort((a: any, b: any) =>
                //     a.complete > b.complete ? 1 : b.complete > a.complete ? -1 : 0
                // );
                this.unsaved_matches = 0
                this.complete = this.data.filter((e: any) => e.complete).length;
            })
            .catch((e) => {
                // this.router.navigateByUrl('/login');
                console.log(e);
            });
    }

    showMatch(match: any) {
        match['unsaved_matches'] = this.unsaved_matches
        const dialogRef = this.dialog.open(ShowMatchComponent, {
            width: '1200px',
            data: match,
        });
        dialogRef.afterClosed().subscribe((res: any) => {
            if (res == 'DELETE') {
                this.ngOnInit()
            } else if (res) {
                let index = this.data.indexOf(match)
                this.data[index]['complete'] = 2
                this.data[index]['ht_result'] = match['ht_result']
                this.data[index]['ft_result'] = match['ft_result']
                this.unsaved_update()

            }
        });
    }

    unsaved_matches = 0
    unsaved_update() {
        this.unsaved_matches = this.data.filter((e: any) => e['complete'] == 2).length
    }


    // this.api
    //     .put('update_match', {
    //         id: match['id'],
    //         ft_result: match['ft_result'],
    //         ht_result: match['ht_result'],
    //     })
    //     .then((res: any) => {
    //         this.dialogRef.close(true);
    //     })
    //     .catch((e: any) => {
    //         console.log(e);
    //     });


    save_result() {
        let payload = {
            matches: this.data.filter((e: any) => e['complete'] == 2)
        }

        this.api
            .put('update_matches', payload)
            .then((res: any) => {
                this.ngOnInit();
            })
            .catch((e: any) => {
                console.log(e);
                // this.router.navigateByUrl('/login');
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

        // let update_records = data.filter((e: any) => to_update_ids.includes(e['id']));
        // if (update_records.length) {
        //     this.api
        //         .put('update_matches', { matches: update_records })
        //         .then((data) => {
        //             this.fetchMatches(this.date);
        //         })
        //         .catch((error: any) => {
        //             console.log(error);
        //         });
        // }
    }

    raw_data = ""
    scrape_data() {
        let splits1 = this.raw_data.split('</tr>')
        let results: any = []
        splits1.forEach(element => {
            let obj: any = {}
            let split2 = element.split('</td><td>')
            if (split2[0] && split2[1] && split2[2] && split2[3] && split2[5]) {
                obj['start_time'] = split2[0].split('<td>')[1]
                obj['url'] = split2[5]
                obj['away_team'] = split2[3]
                obj['home_team'] = split2[2]
                obj['home_odds'] = split2[1].split(' ')[0]
                obj['draw_odds'] = split2[1].split(' ')[1]
                obj['away_odds'] = split2[1].split(' ')[2]
                results.push(obj)
            }
        });
        this.saveData(this.cleanData(results));
    }
}
