import { Component } from '@angular/core';
import { map, startWith, takeWhile, timer } from 'rxjs';
import { scan } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-smart-counter',
  templateUrl: './smart-counter.component.html',
  styleUrls: ['./smart-counter.component.scss'],
  standalone: true,
  imports: [FormsModule],
})
export class SmartCounterComponent {
  protected currentNumber = 0;
  protected inputVal = '';

  onEnter(value: string) {
    const endRange = parseInt(value);
    // this.currentNumber = this.displayValue; // Update current number with the last displayed value
    timer(0, 200)
      .pipe(
        map(() => this.positiveOrNegative(endRange, this.currentNumber)),
        startWith(this.currentNumber),
        scan((acc, curr) => acc + curr),
        takeWhile(this.takeUntilFunc(endRange, this.currentNumber)),
      )
      .subscribe((val) => {
        this.currentNumber = val; // Keep track of the current number
      });
  }

  takeUntilFunc(endRange: any, currentNumber: any) {
    return endRange > currentNumber
      ? (val: any) => val < endRange
      : (val: any) => val >= endRange;
  }

  positiveOrNegative(endRange: any, currentNumber: any) {
    return endRange > currentNumber ? 1 : -1;
  }
}
