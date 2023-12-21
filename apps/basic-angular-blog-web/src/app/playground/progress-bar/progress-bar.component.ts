import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { from, fromEvent, Observable, of } from 'rxjs';
import {
  concatAll,
  count,
  delay,
  finalize,
  scan,
  share,
  switchMapTo,
  withLatestFrom,
} from 'rxjs/operators';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [RouterLink, NgForOf],
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent implements AfterViewInit {
  @ViewChild('data')
  content!: ElementRef;
  @ViewChild('load')
  button!: ElementRef;
  @ViewChild('progress')
  progressBar!: ElementRef;
  public progressWidth: string = '0%';
  public isProgressComplete: boolean = false;
  public displayData: string[] = [];
  private readonly requestOne = of('first').pipe(
    delay(500),
    finalize(() => console.log('First sequence finished')),
  );
  private readonly requestTwo = of('second').pipe(
    delay(1000),
    finalize(() => console.log('Second sequence finished')),
  );
  private readonly requestThree = of('third').pipe(
    delay(800),
    finalize(() => console.log('Third sequence finished')),
  );
  private readonly requestFour = of('fourth').pipe(
    delay(1700),
    finalize(() => console.log('Fourth sequence finished')),
  );
  private readonly requestFive = of('fifth').pipe(
    delay(700),
    finalize(() => console.log('Fifth sequence finished')),
  );
  private readonly observables: Array<Observable<String>> = [
    this.requestOne,
    this.requestTwo,
    this.requestThree,
    this.requestFour,
    this.requestFive,
  ];
  private readonly array$ = from(this.observables);
  private readonly requests$ = this.array$.pipe(concatAll());

  private clicks$!: Observable<any>;
  private progress$!: Observable<any>;
  private count$!: Observable<number>;
  private ratio$!: Observable<number>;

  ngAfterViewInit(): void {
    console.log('ProgressBarComponent finished loading');

    // Initialize the clicks observable here as the button is now available
    this.clicks$ = fromEvent(this.button.nativeElement, 'click');

    this.progress$ = this.clicks$.pipe(switchMapTo(this.requests$), share());

    this.count$ = this.array$.pipe(count());

    this.ratio$ = this.progress$.pipe(
      scan((progress, _) => progress + 1, 0),
      withLatestFrom(this.count$, (progress, count) => progress / count),
    );

    // Subscribe to the ratio observable to update progress width
    this.ratio$.subscribe((ratio) => {
      this.progressWidth = `${100 * ratio}%`;
      this.isProgressComplete = ratio === 1;
    });

    // Subscribe to the progress observable to update display data
    this.progress$.subscribe((data) => {
      this.displayData.push(data);
    });
  }
}
