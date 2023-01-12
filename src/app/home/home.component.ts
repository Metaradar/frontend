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
  public sentNotifications = 0;
  public messages:any[] = [];
  public entries = [
    {
      "address": "",
      "email": "",
      "loading": false,
      "sent": false,
      "message": "",
      "network": "ethereum",
      "error": false
    }
  ]
  
  constructor(private http: HttpClient) {

  }

  ngOnInit() {
    this.http.get<any>('https://api.metaradar.io/v1/stats').subscribe(r => {
      for (const d of r.addresses) {
        if (d.network == "ethereum") {
          this.ethAddresses = d.count;
        }
        else if (d.network == "polygon") {
          this.polygonAddresses = d.count;
        }
      }
      this.sentNotifications = r.notifications;
      this.addresses = this.ethAddresses + this.polygonAddresses;
    })
  }

  signup() {
    var d = 0;
    for (let e of this.entries) {
      if (e.address.length == 0) {
        continue;
      }
      if (e.address.length!=42) {
        e.error = true;
        e.message = "Address has to be a 0x00 address.";
        d++;
        continue;
      }
      if (e.email.length==0 || !(e.email.indexOf('@')>0)) {
        e.error = true;
        e.message = "Email address invalid.";
        d++;
        continue;
      }
      e.loading = true;
      e.error = false;
      this.http.post<any>('https://api.metaradar.io/v1/signup', {"email": e.email, "address": e.address, "network": e.network}).subscribe(r => {
        d++;
        e.loading = false;
        e.sent = true;
        if (r.success) {
          e.message = "Successfully signed up, please confirm your email now.";
          this.messages.push({
            "error": false,
            "message": e.address + " has been signed up, check your email!"
          });
          let n = [];
          for (let f of this.entries) {
            if (f.address == e.address && e.email == f.email && f.network == e.network) {
  
            }
            else {
              n.push(f);
            }
          }
          this.entries = n;
          if (this.entries.length == 0) {
            this.reset();
          }
        }
        else {
          e.error = true;
          e.message = r.status;
        }
        
      })
    }

    
  }
  add() {
    this.entries.push({
      "address": "",
      "email": "",
      "loading": false,
      "sent": false,
      "message": "",
      "network": "ethereum",
      "error": false
    });
  }
  reset() {
    this.entries = [
      {
        "address": "",
        "email": "",
        "loading": false,
        "sent": false,
        "message": "",
        "network": "ethereum",
        "error": false
      }
    ]
  }

}
