import { Component } from '@angular/core';
import Chart from 'chart.js/auto';
import * as moment from 'moment';
import { ApiService } from 'src/app/utils/api.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(private api: ApiService) { }
  homes: any = null
  draws: any = null
  aways: any = null
  weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  data_object: any = {}
  ngOnInit(): void {
    this.api.get('init_dashboard').then((res: any) => {
      this.render_chart('homes_graph', 'Homes', this.make_days(res['games']['homes']))
      this.render_chart('aways_graph', 'Aways', this.make_days(res['games']['aways']))
      this.render_chart('draws_graph', 'Draws', this.make_days(res['games']['draws']))
    }).catch((e) => {
      console.log(e);
    });

  }

  make_days(data: any) {
    let result = [
      this.get_day_values(data['odd11']),
      this.get_day_values(data['odd1x']),
      this.get_day_values(data['odd12']),
      this.get_day_values(data['oddx1']),
      this.get_day_values(data['oddxx']),
      this.get_day_values(data['oddx2']),
      this.get_day_values(data['odd21']),
      this.get_day_values(data['odd2x']),
      this.get_day_values(data['odd22']),
    ]
    return result
  }

  get_day_values(data: any) {
    let day_matches: any = [0, 0, 0, 0, 0, 0, 0]
    day_matches.forEach((e: any, index: number) => {
      day_matches[index] = (data.filter((e: any) => index == this.get_day_index(e['date']))).length
    });
    return day_matches
  }

  get_day_index(date: string) {
    return moment(date).toDate().getDay()
  }

  chart: any;
  render_chart(name: string, title: string, datasets: any) {
    this.chart = new Chart(name, {
      type: 'line',
      data: {
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [
          this.data_sets("1/1", "#0d6efd", datasets[0]),
          this.data_sets("1/X", "#6610f2", datasets[1]),
          this.data_sets("1/2", "#dc3545", datasets[2]),
          this.data_sets("X/1", "#fd7e14", datasets[3]),
          this.data_sets("X/X", "#198754", datasets[4]),
          this.data_sets("X/2", "#ff0000", datasets[5]),
          this.data_sets("2/1", "#ffc107", datasets[6]),
          this.data_sets("2/X", "#343a40", datasets[7]),
          this.data_sets("2/2", "#0dcaf0", datasets[8]),
        ],
      },
      options: {
        responsive: true,
        aspectRatio: this.set_aspect_ratio(),
        plugins: {
          legend: {
            display: true, position: 'bottom', labels: {
              usePointStyle: true,

            }
          },
          title: { display: true, text: title },
        },
      },
    })
  }

  set_aspect_ratio() {
    return window.innerWidth > 720 ? 0 : 1 / 1
  }




  data_sets(label: string, color: string, data: any) {
    return {
      data: data,
      borderColor: color,
      label: label,
      tension: 0.3,
      fill: true,
      backgroundColor: color + '10',
    }
  }
}
