import { Component } from '@angular/core';
import { ApiService } from 'src/app/utils/api.service';

@Component({
  selector: 'app-odds-input',
  templateUrl: './odds-input.component.html',
  styleUrls: ['./odds-input.component.scss']
})
export class OddsInputComponent {
  aways: any = {
    odd11: 0,
    odd1x: 0,
    odd12: 0,
    oddx1: 0,
    oddxx: 0,
    oddx2: 0,
    odd21: 0,
    odd2x: 0,
    odd22: 0,
  }
  draws: any = {
    odd11: 0,
    odd1x: 0,
    odd12: 0,
    oddx1: 0,
    oddxx: 0,
    oddx2: 0,
    odd21: 0,
    odd2x: 0,
    odd22: 0,
  }
  homes: any = {
    odd11: 0,
    odd1x: 0,
    odd12: 0,
    oddx1: 0,
    oddxx: 0,
    oddx2: 0,
    odd21: 0,
    odd2x: 0,
    odd22: 0,
  }
  payload: any = {
    odd11: 0,
    odd1x: 0,
    odd12: 0,
    oddx1: 0,
    oddxx: 0,
    oddx2: 0,
    odd21: 0,
    odd2x: 0,
    odd22: 0,
    type: 1
  }

  constructor(private api: ApiService) { }
  ngOnInit(): void {
    this.api.get('get_match_odds').then((res: any) => {
      this.homes = res['homes']
      this.draws = res['draws']
      this.aways = res['aways']
    }).catch((e) => {
      console.log(e);
    });
  }

  save() {
    this.api.post('save_match_odds', { odds: this.payload }).then((res: any) => {
      this.ngOnInit()
      this.payload = {
        odd11: 0,
        odd1x: 0,
        odd12: 0,
        oddx1: 0,
        oddxx: 0,
        oddx2: 0,
        odd21: 0,
        odd2x: 0,
        odd22: 0,
        type: 1
      }
    }).catch((e) => {
      console.log(e);
    });
  }
}
