import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss'],
})
export class RedirectComponent {
  id?: string;
  userIp: any;
  ipData: any;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getIp().subscribe((ip) => {
      this.userIp = ip;
      console.log(`User IP: ${this.userIp}`);

      const ipGeoUrl = `https://api.ipgeolocation.io/ipgeo?apiKey=cad8a3b8f883434b9e0b102ca8181785&ip=${this.userIp}`;

      this.http.get<any>(ipGeoUrl).subscribe((res) => {
        this.ipData = res;
        console.log(this.ipData);
        this.route.params.subscribe((params) => {
          this.id = params['id'];

          if (!this.id) {
            this.router.navigate(['/main']);
          }

          this.http
            .get<any>(
              'https://script.google.com/macros/s/AKfycbyopRx0C0RRkdKVagX7YcaBT32L-2Ksp1xomG2YZC9rAlGkCG8bBKvewAoztX5wmtdO3Q/exec?apifor=getoriginal&id=' +
                this.id +
                '&content=' +
                this.ipData.country_name +
                '|' +
                this.ipData.city +
                '|' +
                this.ipData.country_flag +
                '|' +
                new Date()
            )
            .subscribe((Response) => {
              console.log(Response);
              if (Response.data) {
                let url = Response.data.originalUrl;

                if (url == null) {
                  this.router.navigate(['/NotFound']);
                } else {
                  if (url.toLowerCase().includes('https')) {
                    window.open(url, '_self');
                  } else {
                    window.open('https://' + url, '_self');
                  }
                }
              }
            });
        });
      });
    });

    // Access route parameters and extract ID
  }
  getIp(): Observable<string> {
    const ipApiUrl = 'https://api.ipify.org?format=text';
    return this.http
      .get(ipApiUrl, { responseType: 'text' })
      .pipe(map((response) => response as string));
  }
}
