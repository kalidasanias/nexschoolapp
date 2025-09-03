/**
 * Created by SenthilPeriyasamy on 10/19/2016.
 */

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModule } from './components/app/app.module';

if (process.env.ENV === 'production') {
    enableProdMode();
}

//noinspection TypeScriptValidateTypes
platformBrowserDynamic().bootstrapModule(AppModule);
