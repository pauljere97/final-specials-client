import {Component} from '@angular/core';
import { ApiService } from 'src/app/utils/api.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private api: ApiService,){}

  hide = true;
  login(e:any){
    e.preventDefault()
    const formData = new FormData(e.target);
    console.log(formData.get("email"))
    console.log(formData.get("password"))
    this.api.login(formData).then(res => {
      console.log(res)
    }).catch(e => {
      console.log(e)
    })
  }
}
