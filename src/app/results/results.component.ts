import { Component, OnInit } from '@angular/core';
import { scaleLinear, scaleBand, max, mean, select } from 'd3';

import { DataService } from '../data.service';
import { Result } from '../../models/Result';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  title: string = 'Results';
  data: Result[] = [];
  scaleFactor = 0.47;
  width = window.innerWidth * this.scaleFactor;
  height = window.innerHeight * this.scaleFactor;
  margin = { top: 40, bottom: 40, right: 80, left: 40 };
  innerWidth = this.width - this.margin.left - this.margin.right;
  innerHeight = this.height - this.margin.top - this.margin.bottom;
  yScale: any;
  xScale: any;
  colorScale: any;
  yAttribute: string = 'precision_score';
  yValue = (d: any) => d[this.yAttribute];
  factors = [
    { key: 'PRECISION', value: 'precision_score' },
    { key: 'PROCESSING TIME', value: 'time' },
    { key: 'RECALL SCORE', value: 'recall_score' },
    { key: 'ACCURACY', value: 'testing_accuracy' },
  ];

  factorDefinitions: any = {
    testing_accuracy: 'Accuracy is defined as the percentage of correct predictions for the test data. It can be calculated easily by dividing the number of correct predictions by the number of total predictions.',
    time: 'Time complexity can be seen as the measure of how fast or slow an algorithm will perform for the input size. Time complexity is always given with respect to some input size (say n).',
    precision_score: 'Precision is one indicator of a machine learning model\'s performance – the quality of a positive prediction made by the model. Precision refers to the number of true positives divided by the total number of positive predictions.',
    recall_score: 'Recall literally is how many of the true positives were recalled (found), i.e. how many of the correct hits were also found.'
  };

  descText: string = "We have used 6 Supervised Machine Learning Algorithms, namely: Support Vector Machine, Decision Tree Classification, Logistic Regression, Naive Bayes Classification, Random Forest Algorithm, and K-Nearest Neighbors. The results are observed on the basis of 4 metrics of Precision, Recall, Accuracy and Processing Time.";

  algorithmDef: any = {
    'LogisticRegression': `It is a statistical analysis method to predict a categorical outcome based on prior observations of a dataset. The model predicts a dependent data variable by analysing the relationship between one or more existing independent variables.
    Logistic Regression has become an important tool in the discipline of machine learning. It allows algorithms used in machine learning applications to classify incoming data based on historical data. As additional relevant data comes in, the algorithms get better at predicting classifications within datasets.`,
    'SVM': `Support Vector Machine or SVM is one of the most popular Supervised learning algorithms, which is used for classification as well as regression problems. The goal of the SVM algorithm is to create the best line or decision boundary that can segregate n-dimensional space into classes so that we can  easily put the new data point in the correct category. This best decision boundary is called a hyperplane.`,
    'KNN': `KNN algorithm assumes the similarity between the new case/data and available cases and put the new case into the category that is most similar to the available categories. KNN algorithm stores all the available data and classifies a new data point based on the similarity. This means when new data appears then it can be easily classified into a well suited category by using the algorithm.`,
    'NaiveBayes': `Naive Bayes algorithm is a supervised learning algorithm, which is based on Bayes theorem and used for solving classification problems. It is mainly used in text classification that includes a high-dimensional training data. It is one of the simple and most effective classification algorithms which helps in building fast machine learning models that can make quick predictions.
    It is called “Naive” because it assumes that the occurrence of a certain feature is independent of the occurrence of other features. It is called “Bayes” because it depends on the principle of Bayes’ Theorem.`,
    'DecisionTree': `It is a Tree-Structured classifier, where internal nodes represent the features of a dataset, branches represent the decision rules and each leaf node represents the outcome. It is a graphical representation for getting all the possible solutions to a problem/decision based on given conditions.`,
    'RandomForest': `Random Forest algorithm is based on the concept of ensemble learning, which is a process of combining multiple classifiers to solve a complex problem and to improve the performance of the model. Random Forest is a classifier that contains a number of decision trees on various subsets of the given dataset and takes the average to improve the predictive accuracy of that dataset. The greater number of trees in the forest leads to higher accuracy and prevents the problem of over fitting.`
  };


  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    this.dataService.getResults().subscribe((res) => {
      this.data = res

      this.yScale = scaleLinear().domain([0, max(this.data, this.yValue)]).range([this.innerHeight, 0]);
      this.xScale = scaleBand().domain(this.data.map(d => d.algorithm)).range([0, this.innerWidth]).padding(0.5);
      let maxValue = max(this.data, this.yValue);
      this.data.map(d => {
        if (maxValue < 1) {
          if (this.yValue(d) > 0.65) {
            d.color = '#00f';
          } else {
            d.color = '#f00';
          }
        } else {
          if (this.yValue(d) < 100) {
            d.color = '#00f';
          } else {
            d.color = '#f00';
          }
        }
      });
    });
  }

  changeYAttribute(e: any) {
    this.yAttribute = e.target.value;
    this.yScale = scaleLinear().domain([0, max(this.data, this.yValue)]).range([this.innerHeight, 0]);
    this.xScale = scaleBand().domain(this.data.map(d => d.algorithm)).range([0, this.innerWidth]).padding(0.5);
    let maxValue = max(this.data, this.yValue);
    this.data.map(d => {
      if (maxValue < 1) {
        if (this.yValue(d) > 0.65) {
          d.color = '#00f';
        } else {
          d.color = '#f00';
        }
      } else {
        if (this.yValue(d) < 100) {
          d.color = '#00f';
        } else {
          d.color = '#f00';
        }
      }
    });
  }

  showToolTip(data: any) {
    console.log(data.algorithm);
    select('#algorithmDef').append('span').text(this.algorithmDef[data.algorithm]);
    select('#algorithmDef').style('visibility', 'visible');
  }

  hideToolTip() {
    select('#algorithmDef').selectAll('span').remove();
    select('#algorithmDef').style('visibility', 'hidden');
  }

  showTable(colorValue: any) {
    const filteredData = this.data.filter(d => d.color === colorValue);
    const table = select('#tab');
    const thead = table.append('tr');
    filteredData.map(data => thead.append('th').style('border', '1px solid black').text(data.algorithm));
    thead.append('th').style('border', '1px solid black').text('Average');
    const tbody = table.append('tr');
    filteredData.map(data => tbody.append('td').text(this.yValue(data).toFixed(2)).style('background-color', colorValue).style('color', 'white'));
    const meanValue = mean(this.data, this.yValue);
    tbody.append('td').text(123.123.toFixed(2)).style('background-color', 'green').style('color', 'white');

    table.style('visibility', 'visible');
  }

  hideTable() {
    select('#tab').selectAll('tr').remove();
    select('#tab').selectAll('th').remove();
    select('#tab').selectAll('td').remove();
    select('#tab').style('visibility', 'hidden');
  }

}
