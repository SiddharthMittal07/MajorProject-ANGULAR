import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  logoText: string = 'Major Project';
  navItems = [
    { title: 'Algorithms', value: '#algorithms' },
    { title: 'Results', value: '#results' },
    { title: 'Upload', value: '#upload' },
    { title: 'Footer', value: '#footer' },
  ];
  title: string = 'Predictive Analysis for Brain Cancer Detection using Machine Learning Techniques';
  buttonText: string = 'Try It Yourself!';

  constructor() { }

  ngOnInit(): void {
  }

}
