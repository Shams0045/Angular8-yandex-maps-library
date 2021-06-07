
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
  addressLine: string;
  private bounds: number[][] = [[38.464454, 68.671434], [38.708910, 68.889581]];
  pointer: number[];

  public mapState = {
    controls: [
      'zoomControl',
      'geolocationControl'
    ]
  };

  constructor(private yaApiLoaderService: YaApiLoaderService) {}

  ngOnInit(): void {}

  onMapReady($event: YaReadyEvent<ymaps.Map>): void {
    this.map = $event.target;
  }

  showOnMap(inputAddress: string): any {
    this.addressLine = inputAddress;
    ymaps.geocode(this.addressLine).then((location) => {
      const firstGeoObject = (location as any).geoObjects.get(0);
      this.pointer = firstGeoObject.geometry._coordinates;
      this.bounds = firstGeoObject.properties.get('boundedBy');
      // Adding first found geo object to the map.
      this.map.geoObjects.add(firstGeoObject);
      this.map.setBounds(this.bounds, {
        checkZoomRange: true
      }).then();
    });
  }

  onSearchChange(): void {
    this.yaApiLoaderService.load().subscribe(ymaps => {
      const suggest = new (ymaps as any).SuggestView('suggest', {
        results: 7,
        boundedBy: [[38.464454, 68.671434], [38.708910, 68.889581]]
      });
      suggest.events.add(['select']);
      // suggest.destroy();
      // console.log(suggest.destroy());
    });
  }

  onYaActionEnd($event: YaEvent<ymaps.Map>): void {
    this.point = $event.event.originalEvent.target.getCenter();
    $event.ymaps.geocode(this.point).then((res: any) => {
      const firstGeoObject = res.geoObjects.get(0);
      this.addressLine = firstGeoObject.properties.get('name');
    });
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




