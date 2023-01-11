import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss']
})
export class ActivateComponent implements OnInit {
  public code:string|null = "";
  public loading = false;
  public success = false;
  public message = "";
  
  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.code = route.snapshot.paramMap.get("code");
    this.route.paramMap.subscribe(f => {
      this.code = route.snapshot.paramMap.get("code");
      this.load();
    });
  }
  ngOnInit(): void {
   
  }
  load() {
    this.loading = true;
    this.http.get<any>('https://api.metaradar.io/v1/activate?code=' + this.code).subscribe(r => {
      console.log("R: ", r);
      if (r.success) {
        this.success = true;
        this.message = "Successfully activated your account, you will receive emails now.";
      }
      else {
        this.success = false;
        this.message = "Could not find that code, double check your email.";
      }
      this.loading = false;
    })
  }

}
