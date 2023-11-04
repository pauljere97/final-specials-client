import { Component } from '@angular/core';
import { LoaderService } from './utils/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'final-specials-client';


  constructor(private loaderService: LoaderService) { }
  showLoader$ = this.loaderService.loadingAction$
}
