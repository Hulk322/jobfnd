import { TestBed } from '@angular/core/testing';

import { CalculatorService } from './calculator.service';

describe('CalculatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CalculatorService = TestBed.get(CalculatorService);
    expect(service).toBeTruthy();
  });

  it('should add two numbers', () => {
    const service: CalculatorService = TestBed.get(CalculatorService);
    const result = service.add(2,5);

    expect(result).toBe(7);
  });

  it('should subtract two numbers', () => {
    const service: CalculatorService = TestBed.get(CalculatorService);
    const result = service.subtract(2,2);

    expect(result).toBe(0);
  });


});
