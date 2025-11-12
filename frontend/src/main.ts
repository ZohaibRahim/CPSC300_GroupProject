import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http'; // <-- NEW IMPORT

const appConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient() // <-- ADDED: Enables all components to use HttpClient
  ]
};

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));