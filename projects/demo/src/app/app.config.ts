import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core'
import { provideRouter } from '@angular/router'
import { routes } from './app.routes'
import { TimelineModule } from '../../../ngx-timeline/src/public-api'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    importProvidersFrom(TimelineModule.forChild(null)),
    provideRouter(routes),
    provideZonelessChangeDetection()
  ]
};
