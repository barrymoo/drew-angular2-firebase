import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  items: FirebaseListObservable<any []>;

  constructor(af: AngularFire) {
    this.items = af.database.list('molecular-data');
  }

  title = 'Get names from the Firebase molecular database:';
}
