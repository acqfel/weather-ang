import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit{
  private appId: string;
  private appCode: string;

  public weather: any;
  public location: any;
  
  public baseUrl: string;

  public constructor(private http: HttpClient) {
      this.appId = environment.appId;
      this.appCode = environment.appCode;
      this.weather = [];
      this.baseUrl = "https://weather.cit.api.here.com/weather/1.0/report.json?product=forecast_7days_simple";
  }

  public ngOnInit() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            this.getWeather(position.coords);
        });
    } else {
        console.error("The browser does not support geolocation...");
    }
  }

  public getWeather(coordinates: any) {
    this.http.jsonp(this.baseUrl+"&latitude=" + coordinates.latitude + "&longitude=" +
                    coordinates.longitude + "&app_id=" + this.appId + "&app_code=" +
                    this.appCode, "jsonpCallback")
        .pipe(map(result => (<any>result).dailyForecasts.forecastLocation))
        .subscribe(result => {
            this.weather = result.forecast;
            this.location = result;
        }, error => {
            console.error(error);
        });
  }
}
