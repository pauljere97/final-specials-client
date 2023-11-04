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
    if (!location.href.includes('login')) {
      this.navbar = true
    }
    console.log(location.href)
  }

  logout() {
    sessionStorage.removeItem("UID")
    location.href = location.origin + '/#/login'
    window.location.reload()
  }

  redirect(link: string) {
    this.sidebar = false
    location.href = location.origin + '/#/' + link
    window.location.reload()
  }

  closeSide() {
    this.sidebar = false
  }
}
