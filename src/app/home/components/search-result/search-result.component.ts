import { Component, OnInit } from '@angular/core';
import { CarbonApiService } from 'src/app/core/services/carbon-api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {

  public resultsTitle = 'results';

  constructor(private carbonApiService: CarbonApiService) {
    carbonApiService.submitSent$.subscribe(
      date => {
        this.carbonApiService.getDailyCarbonIntensityPrognosis(date).subscribe(
          result => {
            console.log('dostalem', result);
          });
      });
  }

  ngOnInit() {
  }

}
