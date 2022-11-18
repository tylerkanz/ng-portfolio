import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fader, slideInAnimation } from './utils/route-animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [ slideInAnimation ]
})
export class AppComponent {
  title = 'ng-portfolio';

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation']
  }
}
