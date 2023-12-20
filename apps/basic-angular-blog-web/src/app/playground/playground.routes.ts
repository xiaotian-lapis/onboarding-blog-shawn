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
];
