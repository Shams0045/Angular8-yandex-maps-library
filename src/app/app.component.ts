import {Component, OnInit} from '@angular/core';

import {YaEvent, YaReadyEvent, YaApiLoaderService} from 'angular8-yandex-maps';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  map: ymaps.Map;
  point: number[];
  center: number[] = [38.573949, 68.785895];
  addressLine;

  suggest: any;

  constructor(private yaApiLoaderService: YaApiLoaderService) {
    // this.yaApiLoaderService.load()
    //   .subscribe(v => console.log(v));
  }

  ngOnInit(): void {}

  onSearchChange(searchValue: string): void {
    this.yaApiLoaderService.load().subscribe(ymaps => {
      const suggest = new (ymaps as any).SuggestView('suggest');
      suggest.events.add(['select'], e => console.log(e));
    });
   // console.log(searchValue);
  }


  onYaActionEnd($event: YaEvent<ymaps.Map>): void {
    this.point = $event.event.originalEvent.target.getCenter();
    console.log(this.point);
    $event.ymaps.geocode(this.point).then((res: any) => {
      const firstGeoObject = res.geoObjects.get(0);
      this.addressLine = firstGeoObject.properties.get('name');
    });
  }

  onMapReady($event: YaReadyEvent<ymaps.Map>): void {
    this.map = $event.target;
  }

  onDetectLocationClick(): void {
    ymaps.geolocation.get({
      provider: 'browser',
      mapStateAutoApply: true,
    }).then((res) => {
      this.center = res.geoObjects.get(0).geometry.getBounds()[0];
      //  console.log(this.map.setCenter(this.center));
      this.map.setCenter(this.center, 18,
        {duration: 2000}).then(() => {
      });
    })
      .catch(error => console.log('Yandex Map Error: ', error));
  }

}




