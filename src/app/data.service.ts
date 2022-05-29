import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Algorithm } from '../models/Algorithm';
import { Result } from '../models/Result';
import { Prediction } from '../models/Prediction';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private algorithmsUrl: string = 'https://gist.githubusercontent.com/SiddharthMittal07/554b26ec04129f393e2fc59c82c0f1d3/raw/871224e25d4eb30b19eb7c2a945f7db0af405787/major_project_define.json';
  private resultsUrl: string = 'https://gist.githubusercontent.com/SiddharthMittal07/3c7afd2a88faa690291f9474b60483b6/raw/f2977fdbd8bf4fbd78878e773582ef75f75340ac/major_project_algorithms.json';
  private apiUrl: string = 'https://mlalgorithmsapi.herokuapp.com/prediction';

  constructor(private http: HttpClient) { }

  getAlgorithms(): Observable<Algorithm[]> {
    return this.http.get<Algorithm[]>(this.algorithmsUrl);
  }

  getResults() {
    return this.http.get<Result[]>(this.resultsUrl);
  }

  getPrediction(upImage: any) {
    let form = new FormData();
    form.append("upImage", upImage);
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    const response = this.http.post<Prediction[]>(this.apiUrl, form, {
      headers: headers,
    });
    return response;
  }
}
