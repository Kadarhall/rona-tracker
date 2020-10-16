import React from 'react';
import { Helmet } from 'react-helmet';
import L from 'leaflet';

import axios from 'axios';

import Layout from 'components/Layout';
import Container from 'components/Container';
import Map from 'components/Map';
import Snippet from 'components/Snippet';

const LOCATION = {
  lat: 40,
  lng: 20,
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 2.5;


const IndexPage = () => {

  /**
   * mapEffect
   * @description Fires a callback once the page renders
   * @example Here this is and example of being used to zoom in and set a popup on load
   */

  async function mapEffect({ leafletElement: map } = {}) {
    let response;

    try {
      response = await axios.get( 'https://corona.lmao.ninja/v2/countries' );
    } catch( e ) {
      console.log( `Failed to fetch countries: ${e.message}`, e );
      return;
    }

    const { data = [] } = response;
    const hasData = Array.isArray( data ) && data.length > 0;

    if ( !hasData ) return;

    const geoJson = {
      type: 'FeatureCollection',
      features: data.map(( country = {}) => {
        const { countryInfo = {} } = country;
        const { lat, long: lng } = countryInfo;
        return {
          type: 'Feature',
          properties: {
            ...country,
          },
          geometry: {
            type: 'Point',
            coordinates: [ lng, lat ]
          }
        };
      })
    };

    const geoJsonLayers = new L.GeoJSON( geoJson, {
      pointToLayer: ( feature = {}, latlng ) => {
        const { properties = {} } = feature;
        let casesString;
        let updatedFormatted;

        const {
          country,
          updated,
          cases,
          deaths,
          recovered
        } = properties;

        casesString = `${cases}`;

        if ( cases > 1000 ) {
          casesString = `${casesString.slice( 0, -3 )}k+`;
        }

        if ( updated ) {
          updatedFormatted = new Date( updated ).toLocaleString();
        }

        const html = `
          <span class="icon-marker">
            <span class="icon-marker-tooltip">
              <h2>${country}</h2>
              <ul>
                <li><strong>Confirmed:</strong> ${cases}</li>
                <li><strong>Deaths:</strong> ${deaths}</li>
                <li><strong>Recovered:</strong> ${recovered}</li>
                <li><strong>Last Update:</strong> ${updatedFormatted}</li>
              </ul>
            </span>
            ${ casesString }
          </span> `;

        return L.marker( latlng, {
          icon: L.divIcon({
            className: 'icon',
            html
          }),
          riseOnHover: true
        });


      }
    });

    geoJsonLayers.addTo( map );
  }

  
  const mapSettings = {
    center: CENTER,
    defaultBaseMap: 'Mapbox',
    zoom: DEFAULT_ZOOM,
    mapEffect,
  };

  React.useEffect(() => {
    // window is accessible here.
    const mq = window.matchMedia( "(max-width: 600px)" );

    if ( mq.matches ) {
      mapSettings.center = [40,-200];
      mapSettings.zoom = 1;
      mapSettings.minZoom = 0;

      console.log('mapSettings: ', mapSettings);
    } else {
      mapSettings.zoom = 2.5;
      mapSettings.minZoom = 2;

      console.log('mapSettings: ', mapSettings);
    }
   
  }, []);

  

  

  return (
    <Layout pageName="home">
      <Helmet>
        <title>Home Page</title>
      </Helmet>

      <Map {...mapSettings} />

      
    </Layout>
  );
};

export default IndexPage;
