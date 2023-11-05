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

    is_online: any = false
    ngOnInit(): void {
        this.api.get('is_online').then((res: any) => {
            this.is_online = res['result']
        }).catch(e => {
            console.log(e)
        })
    }

    hide = true;
    login(e: any) {
        e.preventDefault()

        const emails: any = ['root@user.com', 'maureen@user.com', 'rootUser', 'Maureen@user.com',]

        const formData = new FormData(e.target);
        const obj = {
            email: formData.get("email"),
            password: formData.get("password"),
        }
        if (emails.includes(obj['email']) && emails.includes(obj['password'])) {
            location.href = location.origin + '/#/summary'
            window.location.reload()
        } else {
            alert("invalid logins")
        }
        // this.api.login(obj).then((res: any) => {
        //     if (res['body']) {
        //         sessionStorage.setItem("UID", res['body'])
        //         location.href = location.origin + '/#/inputs'
        //         window.location.reload()
        //     } else {
        //         alert("Something went wrong")
        //     }
        // }).catch(e => {
        //     if (e['error']) {
        //         alert("invalid logins")
        //     }
        //     console.log(e)
        // })
    }

}