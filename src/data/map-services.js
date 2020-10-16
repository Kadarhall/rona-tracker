const accessToken = process.env.GATSBY_MAPBOX_KEY;

export const mapServices = [
  {
    name: 'OpenStreetMap',
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  },
  {
    name: 'Mapbox',
    attribution: '&copy; NASA + RBS, image service by OpenGeo',
    url:
      'https://api.mapbox.com/styles/v1/kadarhall/ckgbte9ex4r5719mp6i2nrjrn/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoia2FkYXJoYWxsIiwiYSI6Im9GVVV0dGcifQ.kj_3hN9V6hax3LncAlpWqQ',
  },
];
