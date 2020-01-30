import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CarbonIntensityDto } from 'src/app/shared/models/CarbonIntensityDto';
import { Observable, Subject, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CarbonApiService {

  private readonly API_URL = 'https://api.carbonintensity.org.uk/intensity/date';

  constructor(private http: HttpClient) { }

  public getDailyCarbonIntensityPrognosis(date: Date): Observable<Array<CarbonIntensityDto>> {
    return this.getDailyMappedApiResult(date);
  }

  private getDailyMappedApiResult(date: Date): Observable<Array<CarbonIntensityDto>> {
    const parsedDate = this.parseDateToString(date);
    const allResults = new Array<CarbonIntensityDto>();
    const finalResult$ = this.http.get(this.API_URL + '/' + parsedDate)
      .pipe(
        map(data => {
          let flatteredData = data.data;
          flatteredData.forEach(element => {
            allResults.push(new CarbonIntensityDto(
              element.intensity.actual,
              element.intensity.forecast,
              element.intensity.index,
              element.from));
          });
          return this.prepareResultsForDisplay(allResults);
        }),
      );
    return finalResult$;
  }

  private prepareResultsForDisplay(allResults: Array<CarbonIntensityDto>): Array<CarbonIntensityDto> {
    return Array.of(
      this.retrieveMaxForeCastPrognosis(allResults),
      this.retrieveMinForeCastPrognosis(allResults),
      this.retrieveMaxMeasuredPrognosis(allResults),
      this.retrieveMinMeasuredPrognosis(allResults),
      this.calculateAverageMeasuredPrognosis(allResults),
      this.calculateAverageForecastPrognosis(allResults));
  }

  private retrieveMaxForeCastPrognosis(allResults: Array<CarbonIntensityDto>): CarbonIntensityDto {
    return allResults.reduce((prev, current) => {
      return (prev.getIntensityForecast() > current.getIntensityForecast()) ? prev : current;
    });
  }

  private retrieveMinForeCastPrognosis(allResults: Array<CarbonIntensityDto>): CarbonIntensityDto {
    return allResults.reduce((prev, current) => {
      return (prev.getIntensityForecast() < current.getIntensityForecast()) ? prev : current;
    });
  }

  private retrieveMaxMeasuredPrognosis(allResults: Array<CarbonIntensityDto>): CarbonIntensityDto {
    return allResults.reduce((prev, current) => {
      return (prev.getIntensityMeasured() > current.getIntensityMeasured()) ? prev : current;
    });
  }

  private retrieveMinMeasuredPrognosis(allResults: Array<CarbonIntensityDto>): CarbonIntensityDto {
    return allResults.reduce((prev, current) => {
      return (prev.getIntensityMeasured() < current.getIntensityMeasured()) ? prev : current;
    });
  }

  private calculateAverageMeasuredPrognosis(allResults: Array<CarbonIntensityDto>): CarbonIntensityDto {
    let averageMeasuredIntensity = 0;
    allResults.forEach(element => {
      averageMeasuredIntensity += element.getIntensityMeasured() ? element.getIntensityMeasured() : 0;
    });
    return new CarbonIntensityDto(
      averageMeasuredIntensity / allResults.length,
      null,
      null,
      this.parseStringToDate(allResults[0].getMeasuringTime()));
  }

  private calculateAverageForecastPrognosis(allResults: Array<CarbonIntensityDto>): CarbonIntensityDto {
    let averageForecastIntensity = 0;
    allResults.forEach(element => {
      averageForecastIntensity += element.getIntensityForecast() ? element.getIntensityForecast() : 0;
    });
    return new CarbonIntensityDto(
      averageForecastIntensity / allResults.length,
      null,
      null,
      this.parseStringToDate(allResults[0].getMeasuringTime()));
  }

  private parseDateToString(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private parseStringToDate(date: string): string {
    return date.split('T')[0];
  }
}
