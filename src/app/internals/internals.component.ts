import { Component } from '@angular/core';

@Component({
  selector: 'app-internals',
  templateUrl: './internals.component.html',
  styleUrls: ['./internals.component.scss']
})
export class InternalsComponent {
  ngOnInit(): void {
    console.log("HERE LANDED")
  }
}
