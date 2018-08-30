import Leaflet from 'leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

// setup
const provider = new OpenStreetMapProvider();

const defaultOptions = {
  searchInput: '.js-search',
  searchBtn: '.js-search-btn',
  lngInput: '.js-lng',
  latInput: '.js-lat',
  zoomInput: '.js-zoom',
  msgInput: '.js-msg',
  map: '.js-map'
};

export default class OpenMapEditor {
  constructor(item, options) {
    const opt = Object.assign({}, defaultOptions, options);
    const selector = document.querySelector(item);
    const mapEle = selector.querySelector(opt.map);
    const lngEle = selector.querySelector(opt.lngInput);
    const latEle = selector.querySelector(opt.latInput);
    const zoomEle = selector.querySelector(opt.zoomInput);
    const searchInputEle = selector.querySelector(opt.searchInput);
    const searchBtn = selector.querySelector(opt.searchBtn);
    const msgEle = selector.querySelector(opt.msgInput);
    const lat = latEle.value;
    const lng = lngEle.value;
    const zoom = zoomEle.value;
    const msg = msgEle.value;
    const map = Leaflet.map(mapEle).setView([lat, lng], zoom);
    const marker = Leaflet.marker(map.getCenter(), {
      draggable: true
    });
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    marker.addTo(map)
      .bindPopup(msg)
      .openPopup();

    lngEle.addEventListener('input', this.lngListener = (e) => {
      const lng = e.target.value;
      this.updatePin({ lng });
    }, true);

    latEle.addEventListener('input', this.latListener = (e) => {
      const lat = e.target.value;
      this.updatePin({ lat });
    }, true);

    map.on('zoomend', (e) => {
      this.zoom = map.getZoom();
      this.zoomEle.value = this.zoom;
    });

    zoomEle.addEventListener('input', this.zoomListener = (e) => {
      const zoom = e.target.value;
      this.updatePin({ zoom });
    }, true);

    msgEle.addEventListener('input', this.msgListener = (e) => {
      const msg = e.target.value;
      this.updatePin({ msg });
    }, true);

    searchBtn.addEventListener('click', this.searchBtnListener = () => {
      const query = searchInputEle.value;
      provider.search({ query }).then((results) => {
        if (results.length) {
          const result = results[0];
          this.updatePin({
            lng: result.x,
            lat: result.y
          });
        }
      });
    }, true);

    marker.on("drag", (e) => {
      const position = marker.getLatLng();
      const { lat, lng } = position;
      this.updatePin({ lat, lng, disableViewUpdate: true });
    });

    marker.on("dragend", (e) => {
      const position = marker.getLatLng();
      const { lat, lng } = position;
      map.panTo(new Leaflet.LatLng(lat, lng));
    });

    this.options = opt;
    this.selector = selector;
    this.map = map;
    this.marker = marker;
    this.lat = lat;
    this.lng = lng;
    this.zoom = zoom;
    this.msg = msg;
    this.latEle = latEle;
    this.lngEle = lngEle;
    this.zoomEle = zoomEle;
    return this;
  }

  updatePin({ lat = this.lat, lng = this.lng, zoom = this.zoom, msg = this.msg, disableViewUpdate = false }) {
    if (!disableViewUpdate) {
      if (lat !== this.lat || lng !== this.lng || zoom !== this.zoom) {
        this.map.setView([lat, lng], zoom);
      }
    }
    this.marker.setLatLng([lat, lng]);
    this.marker.setPopupContent(msg);
    this.lat = lat;
    this.lng = lng;
    this.zoom = zoom;
    this.msg = msg;
    this.latEle.value = lat;
    this.lngEle.value = lng;
    this.zoomEle.value = zoom;
    return this;
  }

  destroy() {
    const { latEle, lngEle, zoomEle } = this;
    latEle.removeEventListener('input', this.latListener, true);
    lngEle.removeEventListener('input', this.lngListener, true);
    zoomEle.removeEventListener('input', this.zoomListener, true);
    this.map.remove();
    this.map.off();
  }
}
