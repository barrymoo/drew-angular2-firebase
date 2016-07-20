import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppComponent, environment } from './app/';
import { FIREBASE_PROVIDERS, defaultFirebase } from 'angularfire2';

if (environment.production) {
  enableProdMode();
}

bootstrap(AppComponent, [
  FIREBASE_PROVIDERS,
  defaultFirebase({
    apiKey: "AIzaSyDn4gNoi-ebXDnMNiW-bZnb9-RTBYB-Oo8",
    databaseURL: "https://drew-e203c.firebaseio.com",
    authDomain: "drew-e203c.firebaseapp.com",
    storageBucket: "drew-e203c.appspot.com"
  })
]);
