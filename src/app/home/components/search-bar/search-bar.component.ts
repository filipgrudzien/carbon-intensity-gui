import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { CarbonApiService } from 'src/app/core/services/carbon-api.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  public searchTitle = 'search bar';

  searchForm = new FormGroup({
    date: new FormControl(new Date(), [Validators.required])
  });

  constructor(private carbonApiService: CarbonApiService) { }

  ngOnInit() { }

  public submitSearch(): void {
    this.carbonApiService.sendSubmissionData(this.searchForm.value.date);
  }

}
