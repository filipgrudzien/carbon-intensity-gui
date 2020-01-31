import { Component, OnInit } from '@angular/core';
import { CarbonApiService } from 'src/app/core/services/carbon-api.service';
import { CarbonIntensityResult } from 'src/app/shared/models/CarbonIntensityResult';
import { isExtremeType } from 'src/app/shared/models/CarbonIntensityResultType';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {

  public resultsTitle = 'results';
  public results: Array<CarbonIntensityResult>;
  public resultColumnName = 'result';
  public dateTimeColumnName = 'date/time';
  public carbonIntensityColumnName = 'carbon intensity';
  public intensityIndexColumnName = 'intensity index';

  constructor(private carbonApiService: CarbonApiService) {
    carbonApiService.submitSent$.subscribe(
      date => {
        this.carbonApiService.getDailyCarbonIntensityPrognosis(date).subscribe(
          results => {
            console.log('dostalem', results);
            this.results = results;
          });
      });
  }

  public formatDate(result: CarbonIntensityResult): string {
    return isExtremeType(result.getResultType()) ?
      this.carbonApiService.reformatDate(result.getDate()) : result.getDate();
  }

  ngOnInit() {
  }

}
