import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CarbonIntensityDto } from 'src/app/shared/models/CarbonIntensityDto';
import { Observable, Subject, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CarbonIntensityResult } from 'src/app/shared/models/CarbonIntensityResult';
import { CarbonIntensityResultType } from 'src/app/shared/models/CarbonIntensityResultType';

@Injectable({
  providedIn: 'root'
})
export class CarbonApiService {

  private readonly API_URL = 'https://api.carbonintensity.org.uk/intensity/date';
  private readonly LOW_INDEX = 'low';
  private readonly MODERATE_INDEX = 'moderate';
  private readonly HIGH_INDEX = 'high';
  private readonly FIRST_ELEMENT_POSITION = '0';

  private submitSender = new Subject<Date>();
  submitSent$ = this.submitSender.asObservable();

  constructor(private http: HttpClient) { }

  sendSubmissionData(date: Date) {
    this.submitSender.next(date);
  }

  public reformatDate(date: string): string {
    const splittedDate = date.split('T');
    return splittedDate[0] + ' ' + splittedDate[1].replace('Z', '');
  }

  public getDailyCarbonIntensityPrognosis(date: Date): Observable<Array<CarbonIntensityResult>> {
    return this.getDailyMappedApiResult(date);
  }

  private getDailyMappedApiResult(date: Date): Observable<Array<CarbonIntensityResult>> {
    const parsedDate = this.parseDateToString(date);
    const apiResults = new Array<CarbonIntensityDto>();
    const finalResult$ = this.http.get(this.API_URL + '/' + parsedDate)
      .pipe(
        map(data => {
          // tslint:disable-next-line:no-string-literal
          let flatteredData = data['data'];
          flatteredData.forEach(element => {
            apiResults.push(new CarbonIntensityDto(
              element.intensity.actual,
              element.intensity.forecast,
              element.intensity.index,
              element.from));
          });
          return this.prepareResultsForDisplay(apiResults);
        }),
      );
    return finalResult$;
  }

  private prepareResultsForDisplay(apiResults: Array<CarbonIntensityDto>): Array<CarbonIntensityResult> {
    return Array.of(
      this.retrieveMaxForecastPrognosis(apiResults),
      this.retrieveMinForecastPrognosis(apiResults),
      this.retrieveMaxMeasuredPrognosis(apiResults),
      this.retrieveMinMeasuredPrognosis(apiResults),
      this.calculateAverageMeasuredPrognosis(apiResults),
      this.calculateAverageForecastPrognosis(apiResults));
  }

  private retrieveMaxForecastPrognosis(apiResults: Array<CarbonIntensityDto>): CarbonIntensityResult {
    const maxForecastResult = apiResults.reduce((prev, current) => {
      return (prev.getIntensityForecast() > current.getIntensityForecast()) ? prev : current;
    });
    return new CarbonIntensityResult(
      CarbonIntensityResultType.MAXIMUM_CARBON_INTENSITY_FORECAST,
      maxForecastResult.getMeasuringTime(),
      maxForecastResult.getIntensityForecast(),
      maxForecastResult.getIntensityIndex());
  }

  private retrieveMinForecastPrognosis(apiResults: Array<CarbonIntensityDto>): CarbonIntensityResult {
    const minForecastResult = apiResults.reduce((prev, current) => {
      return (prev.getIntensityForecast() < current.getIntensityForecast()) ? prev : current;
    });
    return new CarbonIntensityResult(
      CarbonIntensityResultType.MINIMUM_CARBON_INTENSITY_FORECAST,
      minForecastResult.getMeasuringTime(),
      minForecastResult.getIntensityForecast(),
      minForecastResult.getIntensityIndex());
  }

  private retrieveMaxMeasuredPrognosis(apiResults: Array<CarbonIntensityDto>): CarbonIntensityResult {
    const maxMeasuredResult = apiResults.reduce((prev, current) => {
      return (prev.getIntensityMeasured() > current.getIntensityMeasured()) ? prev : current;
    });
    return new CarbonIntensityResult(
      CarbonIntensityResultType.MAXIMUM_CARBON_INTENSITY_MEASURED,
      maxMeasuredResult.getMeasuringTime(),
      maxMeasuredResult.getIntensityForecast(),
      maxMeasuredResult.getIntensityIndex());
  }

  private retrieveMinMeasuredPrognosis(apiResults: Array<CarbonIntensityDto>): CarbonIntensityResult {
    const minMeasuredResult = apiResults.reduce((prev, current) => {
      return (prev.getIntensityMeasured() < current.getIntensityMeasured()) ? prev : current;
    });
    return new CarbonIntensityResult(
      CarbonIntensityResultType.MINIMUM_CARBON_INTENSITY_MEASURED,
      minMeasuredResult.getMeasuringTime(),
      minMeasuredResult.getIntensityForecast(),
      minMeasuredResult.getIntensityIndex());
  }

  private calculateAverageMeasuredPrognosis(apiResults: Array<CarbonIntensityDto>): CarbonIntensityResult {
    let averageMeasuredIntensity = 0;
    apiResults.forEach(element => {
      averageMeasuredIntensity += element.getIntensityMeasured() ? element.getIntensityMeasured() : 0;
    });
    return new CarbonIntensityResult(
      CarbonIntensityResultType.AVG_CARBON_INTENSITY_MEASURED,
      this.parseStringToDate(apiResults[0].getMeasuringTime()),
      Math.floor(averageMeasuredIntensity / apiResults.length),
      this.calculateMostCommonIndex(apiResults));
  }

  private calculateAverageForecastPrognosis(apiResults: Array<CarbonIntensityDto>): CarbonIntensityResult {
    let averageForecastIntensity = 0;
    apiResults.forEach(element => {
      averageForecastIntensity += element.getIntensityForecast() ? element.getIntensityForecast() : 0;
    });
    return new CarbonIntensityResult(
      CarbonIntensityResultType.AVG_CARBON_INTENSITY_FORECAST,
      this.parseStringToDate(apiResults[0].getMeasuringTime()),
      Math.floor(averageForecastIntensity / apiResults.length),
      this.calculateMostCommonIndex(apiResults));
  }

  private calculateMostCommonIndex(apiResults: Array<CarbonIntensityDto>): string {
    let indexMap = new Map();
    indexMap.set(this.LOW_INDEX, 0);
    indexMap.set(this.MODERATE_INDEX, 0);
    indexMap.set(this.HIGH_INDEX, 0);
    apiResults.forEach(element => {
      if (element.getIntensityIndex() === this.LOW_INDEX) {
        indexMap.set(this.LOW_INDEX, indexMap.get(this.LOW_INDEX) + 1);
      } else if (element.getIntensityIndex() === this.MODERATE_INDEX) {
        indexMap.set(this.MODERATE_INDEX, indexMap.get(this.MODERATE_INDEX) + 1);
      } else if (element.getIntensityIndex() === this.HIGH_INDEX) {
        indexMap.set(this.HIGH_INDEX, indexMap.get(this.HIGH_INDEX) + 1);
      }
    });
    const maxCounter = [indexMap.get(this.LOW_INDEX), indexMap.get(this.MODERATE_INDEX), indexMap.get(this.HIGH_INDEX)]
      .sort()
      .reverse()[this.FIRST_ELEMENT_POSITION];
    let result;
    indexMap.forEach((value, key) => {
      if (value === maxCounter) {
        result = key;
      }
    });
    return result;
  }

  private parseDateToString(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private parseStringToDate(date: string): string {
    return date.split('T')[0];
  }
}
