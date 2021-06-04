import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {AngularYandexMapsModule, YaConfig} from 'angular8-yandex-maps';
import {FormsModule} from '@angular/forms';

const mapConfig: YaConfig = {
  apikey: null,
  lang: 'ru_RU',
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AngularYandexMapsModule.forRoot(mapConfig),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
