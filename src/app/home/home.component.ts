import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public addresses = 0;
  public ethAddresses = 0;
  public polygonAddresses = 0;
  public address = "";
  public email = "";
  public loading = false;
  public sent = false;
  public message = "";
  public network = "ethereum";
  public error = false;
  
  constructor(private http: HttpClient) {

  }

  ngOnInit() {
    this.http.get<any>('https://api.metaradar.io/v1/stats').subscribe(r => {
      for (const d of r) {
        if (d.network == "ethereum") {
          this.ethAddresses = d.count;
        }
        else if (d.network == "polygon") {
          this.polygonAddresses = d.count;
        }
      }
      this.addresses = this.ethAddresses + this.polygonAddresses;
    })
  }

  signup() {
    if (this.address.length!=42) {
      this.error = true;
      this.message = "Address has to be a 0x00 address.";
      return;
    }
    if (this.email.length==0 || !(this.email.indexOf('@')>0)) {
      this.error = true;
      this.message = "Email address invalid.";
      return;
    }
    this.loading = true;
    this.error = false;
    this.http.post<any>('https://api.metaradar.io/v1/signup', {"email": this.email, "address": this.address, "network": this.network}).subscribe(r => {
      this.loading = false;
      this.sent = true;
      if (r.success) {
        this.message = "Successfully signed up, please confirm your email now.";
      }
      else {
        this.error = true;
        this.message = r.error;
      }
    })
  }

}
