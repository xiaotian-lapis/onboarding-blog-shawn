import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  exhaustMap,
  fromEvent,
  iif,
  map,
  mergeMap,
  of,
  pipe,
  repeat,
  Subscription,
  takeUntil,
  takeWhile,
  tap,
} from 'rxjs';
import { delay, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-swipe',
  templateUrl: './swipe.component.html',
  styleUrls: ['./swipe.component.scss'],
  standalone: true,
  imports: [FormsModule],
})
export class SwipeComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();

  ngOnInit() {
    /**
     * DOM manipulation: set the position of the refresh dot
     * @param y
     */
    const setRefreshPos = (y: any) =>
      (document.getElementById('refresh')!.style.top = `${y}px`);

    /**
     * DOM manipulation: set the position of the refresh dot to 100 px
     */
    const resetRefresh = () => setRefreshPos(100);

    /**
     * DOM manipulation: set the data display
     * @param data
     */
    const setData = (data: any) =>
      (document.getElementById('data')!.innerText = data);

    /**
     * Fake request
     */
    const fakeRequest = () =>
      of(new Date().toUTCString()).pipe(
        tap((_) => console.log('request')),
        delay(1000),
      );

    /**
     * Take until mouse up or refresh dot reaches 310 px
     */
    const takeUntilMouseUpOrRefresh$ = pipe(
      takeUntil(fromEvent(document, 'mouseup')),
      takeWhile((y: any) => y < 310),
    );

    /**
     * Move the refresh dot to y
     * @param y
     */
    const moveDot = (y: any) => of(y).pipe(tap(setRefreshPos));

    /**
     * refresh logic
     */
    const refresh$ = of({}).pipe(
      tap(resetRefresh),
      tap((e) => setData('...refreshing...')),
      exhaustMap((_) => fakeRequest()),
      tap(setData),
    );

    this.subscription = fromEvent(document, 'mousedown')
      .pipe(
        // @ts-expect-error ts-migrate(2554)
        mergeMap((_) => fromEvent(document, 'mousemove')),
        map((e: MouseEvent) => e.clientY),
        takeUntilMouseUpOrRefresh$,
        finalize(resetRefresh),
        exhaustMap((y) => iif(
          () => y < 300, moveDot(y), refresh$)
        ),
        finalize(() => console.log('end')),
        repeat(),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
