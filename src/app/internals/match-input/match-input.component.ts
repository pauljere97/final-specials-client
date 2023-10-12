import { Component, OnInit } from '@angular/core';
import { ShowMatchComponent } from 'src/app/dialogs/show-match/show-match.component';
import { ApiService } from 'src/app/utils/api.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-match-input',
  templateUrl: './match-input.component.html',
  styleUrls: ['./match-input.component.scss']
})
export class MatchInputComponent implements OnInit {
  data = []
  selected_row = 0

  day: any = new Date().getDate();
  month: any = new Date().getMonth() + 1;
  year: any = new Date().getFullYear();
  date = ""

  constructor(private api: ApiService, private dialog: MatDialog,) {
    if (this.month < 10) this.month = "0" + this.month;
    if (this.day < 10) this.day = "0" + this.day;

    this.date = this.year + "-" + this.month + "-" + this.day
  }

  ngOnInit(): void {
    this.fetchMatches()
  }

  fetchMatches(date = this.date): void {
    this.api.get('get_day_matches?date=' + date).then((res: any) => {
      this.data = res.filter((element: any) => {
        element['complete'] = element['ht_result'] && element['ht_result']
        console.log(element)
        return true
      }).sort((a: any, b: any) => (a.start_time > b.start_time) ? 1 : ((b.start_time > a.start_time) ? -1 : 0))
    }).catch(e => {
      console.log(e)
    })
  }

  showMatch(match: any) {
    if (this.selected_row == match['id']) {
      this.selected_row = 0
      this.ht_result = "0"
      this.ft_result = "0"
      return
    }

    this.ht_result = match['ht_result']
    this.ft_result = match['ft_result']
    this.selected_row = match['id']
    const dialogRef = this.dialog.open(ShowMatchComponent, {
      width: "700px",
      data: match['url']
    });
    dialogRef.afterClosed().subscribe((res: any) => { });
  }

  ht_result = "0"
  ft_result = "0"
  save_result(match: any) {
    match['ht_result'] = this.ht_result
    match['ft_result'] = this.ft_result

    this.api.put('update_matches', [match]).then((res: any) => {
      this.ngOnInit()
      this.ht_result = "0"
      this.ft_result = "0"
    }).catch((e: any) => {
      console.log(e)
    })
  }

  jsonFile = null
  readJSON(e: any): void {

    const file = e.files[0];
    if (!file) {
      alert("Date or JSON missing")
      return;
    }
    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const data = JSON.parse(e.target.result);
        this.saveData(this.cleanData(data.matches))

      } catch (error) {
        console.error('Error parsing JSON file:', error);
      }
    };
    reader.readAsText(file);
  }

  cleanData(data: any): void {
    data = data.filter((e: any) => e['home_odds'])
    let result: any = []
    data.forEach((element: any) => {
      let obj: any = {}
      obj['url'] = element['url']
      obj['date'] = this.date
      obj['start_time'] = element['start_time']
      if (element['finshed']) obj['start_time'] = element['finshed']
      obj['away_team'] = element['away_team']
      obj['home_team'] = element['home_team']
      obj['ft_result'] = ""
      obj['ht_result'] = ""
      if (element['home_score']) {
        if (element['home_score'] > element['away_score']) obj['ft_result'] = "1"
        if (element['home_score'] < element['away_score']) obj['ft_result'] = "2"
        if (element['home_score'] === element['away_score']) obj['ft_result'] = "X"
      }

      obj['home_odds'] = element['home_odds']
      obj['draw_odds'] = element['draw_odds']
      obj['away_odds'] = element['away_odds']


      if (+element['home_odds'] >= 2 && +element['home_odds'] < 3 && +element['away_odds'] >= 2 && +element['away_odds']) result.push(obj)
      else if (+element['home_odds'] <= 1.6) result.push(obj)
      else if (+element['away_odds'] <= 1.7) result.push(obj)
    });
    return result
  }

  saveData(data: any):void {
    let to_update_ids:any = []
    let new_records:any = []
    data.forEach((element:any) => {
      let record = data.find((e:any) => element['away_team'] === e['away_team'] && element['home_team'] === e['home_team'] && this.date === e['date'])
      if (record) {
        if (!element['start_time'] && element['ft_result']) {
          record['ft_result'] = element['ft_result']
          element = record
          if (!to_update_ids.includes(element['id'])) {
            to_update_ids.push(element['id'])
          }
        }
      } else {
        new_records.push(element)
      }
    })

    if (new_records.length) {
      this.api.post('save_matches', new_records).then(data => {
        this.fetchMatches(this.date)
      }).catch((error:any) => { console.log(error) })
    }

    let update_records = data.filter((e:any) => to_update_ids.includes(e['id']))
    if (update_records.length) {
      this.api.put('update_matches', update_records).then(data => {
        this.fetchMatches(this.date)
      }).catch((error:any) => { console.log(error) })
    }

  }




}