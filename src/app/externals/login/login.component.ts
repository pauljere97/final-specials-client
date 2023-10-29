import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/utils/api.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private api: ApiService, private router: Router,) { }

  is_online:any = false
  ngOnInit(): void {
    this.api.get('is_online').then(res => {
      this.is_online = res
    }).catch(e => {
      console.log(e)
    })
  }

  hide = true;
  login(e: any) {
    e.preventDefault()
    const formData = new FormData(e.target);
    const obj = {
      email: formData.get("email"),
      password: formData.get("password"),
    }
    this.api.login(obj).then((res:any) => {
      if(res['body']){
        sessionStorage.setItem("UID", res['body'])
        location.href = location.origin + '/#/inputs'
        window.location.reload()
      }else{
        alert("Something went wrong")
      }
    }).catch(e => {
      if(e['error']){
        alert("invalid logins")
      }
      console.log(e)
    })
  }

}
