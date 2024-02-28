import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperUtilityService {

  constructor() { }

  convertToSelect2(data, firstColumn = 'id', secondColumn = 'name') {
    var resultData = [];

    for (var key in data) {
      var obj = data[key];
      //{{ cost_center_code.name | titlecase }} ({{ cost_center_code.cost_code }}) -- custom expression COP
      // :name - :location 
      if(typeof obj === 'object' && obj !== null)
        resultData.push({
        id: obj[firstColumn],
        text: this.solveExpression(secondColumn, obj)  //to display
      });
      else
        resultData.push({
        id: obj,
        text: obj  //to display
      });
      
    }
    return resultData;
  }

  toSelect2(data, firstColumn = 'id', secondColumn = 'name') {
    return this.convertToSelect2(data, firstColumn, secondColumn);
  }

  solveExpression(expression, obj) {

    var expressionArray = expression.split(' ');
    if (expressionArray.length == 1) {
      //console.log('name'+obj[expression]);
      return obj[expression];
    }
    else {
      //console.log(expressionArray);
      //console.log(obj[innerObject.substring(1)]);
      var expressionOutput='';
      for (var key in expressionArray) {
        var innerObject = expressionArray[key];
        if (innerObject.charAt(0) == ':' && innerObject.length > 1)
          expressionOutput = expressionOutput + obj[innerObject.substring(1)] + ' ';
        else
          expressionOutput = expressionOutput + innerObject + ' ';
      }

      return expressionOutput;
    }
  }

  inputFormatDate(date) {
    var d;
    if (typeof (date) === "string") {
      d = new Date(date);
    } else {
      d = date;
    }

    if (d instanceof Date) {
      var month = '' + (d.getMonth() + 1);
      var day = '' + d.getDate();
      var year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [month, day, year].join('/');
    } else {
      return null;
    }
  }

}
