import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  concat,
  debounceTime,
  defer,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  merge,
  mergeMap,
  of,
  switchAll,
  tap,
} from 'rxjs';
import { delay, share } from 'rxjs/operators';

@Component({
  selector: 'app-save-indicator',
  templateUrl: './save-indicator.component.html',
  styleUrls: ['./save-indicator.component.scss'],
  standalone: true,
  imports: [],
})
export class SaveIndicatorComponent implements AfterViewInit {
  @ViewChild('nameInput')
  nameInput!: ElementRef;

  @ViewChild('saveIndicator')
  saveIndicator!: ElementRef;

  private savesInProgress: number = 0;

  ngAfterViewInit(): void {
    // Initialize keyup$ inside ngAfterViewInit
    const inputToSave$ = fromEvent(this.nameInput.nativeElement, 'keyup').pipe(
      debounceTime(500),
      map((event: any) => event.target.value),
      distinctUntilChanged(),
      share(),
    );
    const savesInProgress$ = inputToSave$.pipe(
      map(() => of('Saving...')),
      tap(() => {
        this.savesInProgress++;
        console.log('Saves in progress: ', this.savesInProgress);
      }),
    );

    // Fake save request
    const saveChanges = (value: any) => {
      return of(value).pipe(delay(1500));
    };

    const savesCompleted$ = inputToSave$.pipe(
      mergeMap(saveChanges),
      tap((_) => this.savesInProgress--),
      // ignore if additional saves are in progress
      filter((_) => !this.savesInProgress),
      map(() =>
        concat(
          // display saved for 2s
          of('Saved!'),
          of().pipe(delay(2000)),
          // then last updated time, defer for proper time
          defer(() => of(`Last updated: ${new Date().toISOString()}`)),
        ),
      ),
    );

    // Merge and subscribe to the streams
    merge(savesInProgress$, savesCompleted$)
      .pipe(
        /*
       If new save comes in when our completion observable is running, we want to switch to it for a status update.
      */
        switchAll(),
      )
      .subscribe((status) => {
        console.log(status);
        this.saveIndicator.nativeElement.innerHTML = status;
      });
  }
}
