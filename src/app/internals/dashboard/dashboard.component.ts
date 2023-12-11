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
  weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  selected_type: any = 1
  selected_day = moment().toDate().getDay()
  odds: any = []
  matches: any = []
  ngOnInit(): void {
    this.api.get('init_dashboard').then((res: any) => {
      this.odds = res['odds']
      this.matches = res['matches']
      this.render_chart('homes_graph', 'Homes', this.dayTotal(res['matches']['1'], res['odds']['homes']))
      this.render_chart('draws_graph', 'Draws', this.dayTotal(res['matches']['X'], res['odds']['draws']))
      this.render_chart('aways_graph', 'Aways', this.dayTotal(res['matches']['2'], res['odds']['aways']))
      this.get_dynamic_data(this.odds, this.matches)
    }).catch((e) => {
      console.log(e);
    });
  }

  dayTotal(matches: any, odds: any) {
    let result: any = {
      Sun: { odd1x: 0, odd11: 0, odd12: 0, oddxx: 0, oddx1: 0, oddx2: 0, odd2x: 0, odd21: 0, odd22: 0, total: 0 },
      Mon: { odd1x: 0, odd11: 0, odd12: 0, oddxx: 0, oddx1: 0, oddx2: 0, odd2x: 0, odd21: 0, odd22: 0, total: 0 },
      Tue: { odd1x: 0, odd11: 0, odd12: 0, oddxx: 0, oddx1: 0, oddx2: 0, odd2x: 0, odd21: 0, odd22: 0, total: 0 },
      Wed: { odd1x: 0, odd11: 0, odd12: 0, oddxx: 0, oddx1: 0, oddx2: 0, odd2x: 0, odd21: 0, odd22: 0, total: 0 },
      Thu: { odd1x: 0, odd11: 0, odd12: 0, oddxx: 0, oddx1: 0, oddx2: 0, odd2x: 0, odd21: 0, odd22: 0, total: 0 },
      Fri: { odd1x: 0, odd11: 0, odd12: 0, oddxx: 0, oddx1: 0, oddx2: 0, odd2x: 0, odd21: 0, odd22: 0, total: 0 },
      Sat: { odd1x: 0, odd11: 0, odd12: 0, oddxx: 0, oddx1: 0, oddx2: 0, odd2x: 0, odd21: 0, odd22: 0, total: 0 },
    }
    this.weekday.forEach(day => {
      matches.forEach((match: any) => {
        if (day == this.weekday[this.get_day_index(match['date'])]) {
          for (const key in result[day]) {
            if (Object.prototype.hasOwnProperty.call(result[day], key)) {
              if (key !== 'total') {
                result[day][key] += (+match[key])
                result[day]['total'] += (+match[key])
              }
            }
          }
        }
      });
      for (const key in odds) {
        if (Object.prototype.hasOwnProperty.call(result[day], key)) {
          let total = (result[day][key] * odds[key]) - result[day]['total']
          if (total < 0) total = 0
          result[day][key] = (total / result[day]['total']) * 100
        }
      }
    });
    return result
  }

  get_day_index(date: string) {
    return moment(date).toDate().getDay()
  }

  chart: any;
  render_chart(name: string, title: string, datasets: any) {
    this.chart = new Chart(name, {
      // type: 'bar',
      type: 'line',
      data: {
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [
          this.data_sets("1/1", "#0d6efd", datasets, 'odd11'),
          this.data_sets("1/X", "#6610f2", datasets, 'odd1x'),
          this.data_sets("1/2", "#dc3545", datasets, 'odd12'),
          this.data_sets("X/1", "#fd7e14", datasets, 'oddx1'),
          this.data_sets("X/X", "#198754", datasets, 'oddxx'),
          this.data_sets("X/2", "#ff0000", datasets, 'oddx2'),
          this.data_sets("2/1", "#ffc107", datasets, 'odd21'),
          this.data_sets("2/X", "#343a40", datasets, 'odd2x'),
          this.data_sets("2/2", "#0dcaf0", datasets, 'odd22'),
        ],
      },
      options: {
        responsive: true,
        aspectRatio: this.set_aspect_ratio(),
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: { usePointStyle: true }
          },
          title: { display: true, text: title },
        },
        scales: {
          y: {
            beginAtZero: true,
          }
        }
      },

    })
  }

  set_aspect_ratio() {
    return window.innerWidth > 720 ? 0 : 1 / 1
  }
  data_sets(label: string, color: string, data: any, field: string) {
    let dataset = []
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        dataset.push(data[key][field])
      }
    }
    return {
      data: dataset,
      borderColor: color,
      label: label,
      tension: 0.3,
      fill: true,
      backgroundColor: color + '10',
      // backgroundColor: color,
    }
  }

  get_dynamic_data(odds: any, matches: any) {
    let type_string = this.selected_type == 1 ? 'homes' : this.selected_type == 'X' ? 'draws' : 'aways'
    odds = odds[type_string]
    matches = matches[this.selected_type].filter((element: any) => {
      return this.get_day_index(element['date']) == this.selected_day
    });
    let labels = (matches.map((e: any) => e['date'])).sort()
    // labels = labels.map((e: any) => moment(e).toDate().toDateString().substring(4, 10))
    matches = matches.sort((a: any, b: any) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0));
    console.log(odds, matches)

    this.chart = new Chart('dynamic_graph', {
      // type: 'bar',
      type: 'line',
      data: {
        labels: labels.map((e: any) => moment(e).toDate().toDateString().substring(4, 10)),
        datasets:
          [
            this.dynamic_data("1/1", "#0d6efd", 'odd11', labels, matches, odds),
            this.dynamic_data("1/X", "#6610f2", 'odd1x', labels, matches, odds),
            this.dynamic_data("1/2", "#dc3545", 'odd12', labels, matches, odds),
            this.dynamic_data("X/1", "#fd7e14", 'oddx1', labels, matches, odds),
            this.dynamic_data("X/X", "#198754", 'oddxx', labels, matches, odds),
            this.dynamic_data("X/2", "#ff0000", 'oddx2', labels, matches, odds),
            this.dynamic_data("2/1", "#ffc107", 'odd21', labels, matches, odds),
            this.dynamic_data("2/X", "#343a40", 'odd2x', labels, matches, odds),
            this.dynamic_data("2/2", "#0dcaf0", 'odd22', labels, matches, odds),
          ],
      },
      options: {
        responsive: true,
        aspectRatio: this.set_aspect_ratio(),
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: { usePointStyle: true }
          },
          title: { display: false, text: 'dynamic_graph' },
        },
        scales: {
          y: {
            beginAtZero: true,
          }
        }
      },

    })

  }

  // "2/2", "#0dcaf0", 'odd22', labels, matches, odds)
  dynamic_data(title: any, color: any, odd: any, labels: any, matches: any, odds: any) {
    let values = matches.map((element: any) => {
      let day_total = 0
      for (const key in element) {
        if (Object.prototype.hasOwnProperty.call(element, key)) {
          const val = element[key];
          if (key.includes('odd')) {
            day_total += +val
          }
        }
      }

      let result = (element[odd] * odds[odd]) - day_total
      result = Math.ceil((result / day_total) * 100)
      return result
    });

    return {
      "data": values,
      "borderColor": color,
      "label": title,
      "tension": 0.3,
      "fill": true,
      "backgroundColor": color + "10"
    }
  }

  change_dynamic_graph() {
    const dymanic_wrapper = document.getElementById('dymanic_wrapper')
    if (dymanic_wrapper) {
      dymanic_wrapper.innerHTML = '<canvas id="dynamic_graph"></canvas>'
    }
    this.get_dynamic_data(this.odds, this.matches)

    console.log("XXXXX", this.selected_type)
  }

}
