import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  navbar = false
  sidebar = false
  ngOnInit(): void {
    if(!location.href.includes('login')){
      this.navbar = true
    }
    console.log(location.href)
  }
}
