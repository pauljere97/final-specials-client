import { urls } from "./urls";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(private http: HttpClient) { }
  api = urls.baseUrl;

  async login(form: any) {
    return await this.http
      .post(this.api.concat('login'), form, {
        observe: "events",
      }).toPromise();
  }
  async get(endpoint: string) {
    return await this.http
      .get(this.api.concat(endpoint))
      .toPromise();
  }
  async post(endpoint: string, data: any) {
    return await this.http
      .post(this.api.concat(endpoint), data, {
        observe: "events",
      })
      .toPromise();
  }
  async put(endpoint: string, data: any) {
    return await this.http
      .put(this.api.concat(endpoint), data, {
        observe: "events",
      })
      .toPromise();
  }

}