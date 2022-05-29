import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

import { Algorithm } from '../../models/Algorithm';

@Component({
  selector: 'app-algorithms',
  templateUrl: './algorithms.component.html',
  styleUrls: ['./algorithms.component.css']
})
export class AlgorithmsComponent implements OnInit {
  index = 0;
  data: Algorithm[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getAlgorithms().subscribe((res) => this.data = res);
  }

  incrementIndex() {
    if (this.index < this.data.length - 1) {
      this.index += 1;
    }
  }

  decrementIndex() {
    if (this.index > 0) {
      this.index -= 1;
    }
  }

}
