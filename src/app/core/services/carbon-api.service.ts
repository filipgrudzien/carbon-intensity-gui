import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CarbonApiService {

  private readonly API_URL = 'https://api.carbonintensity.org.uk/intensity/date';
  /* let response = 
  {
    "data": {
      "from": string;
      "to": string;
      "intensity": {
        "forecast": number;
        "actual": number;
        "index": string;
      }
    }
  }; */

  constructor(private http: HttpClient) { }

  public getCarbonIntensityPrognosis(date: Date): void {
    const parsedDate = this.parseDate(date);
    const resp = this.http.get(this.API_URL + '/' + parsedDate).subscribe(
      data => console.log(data)
    );
    console.log();
  }

  private parseDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
