import { Component, Input } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { ThreeComponent } from './three/three.component';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ThreeComponent]
})
export class AppComponent {
  items: FirebaseListObservable<any []>;

  constructor(af: AngularFire) {
    this.items = af.database.list('/molecular-data');
  }

  title = 'Get names from the Firebase molecular database:';
}
