import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { arc, pie, select, scaleOrdinal } from 'd3';

import { Prediction } from '../../models/Prediction';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  title: string = 'Upload';
  descText: string = 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minima corrupti consequatur at quibusdam ex inventore nesciunt delectus harum alias est, necessitatibus dolores esse aut tenetur, placeat fugiat libero nihil! Dolor! Eos fuga nobis, at exercitationem laborum perspiciatis quae dolorem, praesentium blanditiis corporis fugit doloribus itaque, beatae debitis asperiores voluptatem commodi facilis molestiae maxime. Delectus repellat inventore nemo laboriosam eos consequuntur!';
  upImage = null;
  pictureAsFile = null;
  loading = true;
  result: Prediction[] = [];
  width = window.innerWidth * 0.3125;
  height = window.innerHeight * 0.426;
  predictedTumor = '';
  margin = { top: this.width / 60, bottom: this.width / 60, left: 0, right: this.width / 4 };
  innerWidth = this.width - this.margin.left - this.margin.right;
  innerHeight = this.height - this.margin.top - this.margin.bottom;
  innerRadius = this.width / 4;
  outerRadius = this.width / 6;
  ar = arc().innerRadius(this.innerRadius).outerRadius(this.outerRadius);
  pi = pie().padAngle(0.04).value((d: any) => d[1]);
  colorScale = scaleOrdinal();
  arcs: any = null;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
  }

  async uploadImage(e: any) {
    e.preventDefault();
    if (this.pictureAsFile) {
      this.loading = false;
      this.dataService.getPrediction(this.pictureAsFile).subscribe(res => {
        this.result = res;

        this.colorScale = scaleOrdinal().domain(this.result.map(r => r.result)).range(['red', 'blue', 'green', 'yellow']);

        let data = Object();
        this.result.forEach((d) => {
          if (!data.hasOwnProperty(d.result)) {
            data[d.result] = 0;
          }
          data[d.result] += 1;
        });

        data = Object.entries(data);
        this.arcs = this.pi(data);

        let predictions = Object();
        this.result.forEach(res => {
          if (!predictions.hasOwnProperty(res.result)) {
            predictions[res.result] = 0;
          }
          predictions[res.result] += 1;
        });

        let pred = Array();
        Object.keys(predictions).forEach(key => pred.push([key, predictions[key]]));
        pred.sort(function (a, b) {
          return b[1] - a[1];
        });
        this.predictedTumor = pred[0][0];

        console.log(this.predictedTumor);
      })
    }
  }

  selectImage(e: any) {
    this.result = [];
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.upImage = event.target.result;
      }
      this.pictureAsFile = e.target.files[0];
    }
  }

}