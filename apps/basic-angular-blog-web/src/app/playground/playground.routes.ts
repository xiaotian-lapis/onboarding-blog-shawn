import { Routes } from '@angular/router';
import { PlaygroundComponent } from './playground.component';

export const PLAYGROUND_ROUTES: Routes = [
  {
    path: '',
    component: PlaygroundComponent,
  },
  {
    path: 'progress-bar',
    loadChildren: () =>
      import('./progress-bar/progress-bar.routes').then(
        (m) => m.PROGRESS_BAR_ROUTES
      )
  },
  {
    path: 'save-indicator',
    loadChildren: () =>
      import('./save-indicator/save-indicator.routes').then(
        (m) => m.SAVE_INDICATOR_ROUTES
      )
  },
  {
    path: 'smart-counter',
    loadChildren: () =>
      import('./smart-counter/smart-counter.routes').then(
        (m) => m.SMART_COUNTER_ROUTES
      )
  },
];
