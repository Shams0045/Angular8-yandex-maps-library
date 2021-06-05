
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import {YaEvent, YaReadyEvent, YaApiLoaderService, YaGeocoderService} from 'angular8-yandex-maps';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private yaApiLoaderService: YaApiLoaderService,
              private yaGeocoderService: YaGeocoderService) {
    // this.yaApiLoaderService.load()
    //   .subscribe(v => console.log(v));

    // this.yaGeocoderService.geocode('Таджикистан, Душанбе, проспект Негмата Карабаева, 11')
    //     .subscribe(v => console.log(v));
  }

  map: ymaps.Map;
  point: number[];
  center: number[] = [38.573949, 68.785895];
  addressLine;
  private bounds: number[][] = [[38.464454, 68.671434], [38.708910, 68.889581]];

  public mapState = {
    controls: [
      'zoomControl',
      'geolocationControl'
    ]
  };

  public feature: ymaps.IGeoObjectFeature = {
    geometry: {
      type: 'Rectangle',
      coordinates: [[38.464454, 68.671434], [38.708910, 68.889581]]
    },
    properties: {
      hintContent: 'Hint Content',
      balloonContent: 'Baloon Content'
    }
  };

  public options: ymaps.IGeoObjectOptions = {
    fillColor: '#7df9ff33',
    fillOpacity: 0.5,
    strokeColor: '#0000FF',
    strokeOpacity: 0.5,
    strokeWidth: 2,
    borderRadius: 6
  };

  ngOnInit(): void {}

  showOnMap(inputAddress: string): any {
    this.addressLine = inputAddress;
    ymaps.geocode(this.addressLine).then((location) => {
      const firstGeoObject = (location as any).geoObjects.get(0);
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
      const suggest = new (ymaps as any).SuggestView('suggest');
      suggest.events.add(['click']);


      // suggest.events.add(['select'], e => console.log(e));
      // console.log(suggest);
    });
  }


  onYaActionEnd($event: YaEvent<ymaps.Map>): void {
    this.point = $event.event.originalEvent.target.getCenter();
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




