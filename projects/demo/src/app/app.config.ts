import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { TimelineModule } from '../../../ngx-dynamic-timeline/src/public-api'
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(TimelineModule.forChild(null))
  ]
};
