import LeafletDefalt from 'leaflet';
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

export default class GeoPicker {
  constructor(item, options, Leaflet = LeafletDefalt) {
    const opt = Object.assign({}, defaultOptions, options);
    const selector = typeof item === 'string' ? document.querySelector(item) : item;
    if (!selector) {
      return;
    }
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
    this.Leaflet = Leaflet;
    this.options = opt;
    this.map = map;
    this.marker = marker;
    this.lat = lat;
    this.lng = lng;
    this.zoom = zoom;
    this.msg = msg;
    this.msgEle = msgEle;
    this.latEle = latEle;
    this.lngEle = lngEle;
    this.zoomEle = zoomEle;
    this.searchInputEle = searchInputEle;
    this.searchBtn = searchBtn;
    this.bindPopupFlag = false;
    return this;
  }

  run() {
    const { map, msg, marker, Leaflet } = this;
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const view = marker.addTo(map);
    if (msg) {
      view.bindPopup(msg);
    }
    this.setEvent();
    return this;
  }

  setEvent() {
    const { map, msgEle, marker, latEle, lngEle, zoomEle, searchBtn, searchInputEle, Leaflet } = this;

    if (lngEle) {
      ['input', 'change'].forEach((eventName) => {
        lngEle.addEventListener(eventName, this[`lng${eventName}Listener`] = (e) => {
          const lng = e.target.value;
          this.updatePin({ lng });
        }, true);
      });
    }

    if (latEle) {
      ['input', 'change'].forEach((eventName) => {
        latEle.addEventListener(eventName, this[`lat${eventName}Listener`] = (e) => {
          const lat = e.target.value;
          this.updatePin({ lat });
        }, true);
      });
    }

    if (zoomEle) {
      ['input', 'change'].forEach((eventName) => {
        zoomEle.addEventListener(eventName, this[`zoom${eventName}Listener`] = (e) => {
          const zoom = e.target.value;
          this.updatePin({ zoom });
        }, true);
      });
    }

    if (msgEle) {
      ['input', 'change'].forEach((eventName) => {
        msgEle.addEventListener('input', this[`msg${eventName}Listener`] = (e) => {
          const msg = e.target.value;
          this.updatePin({ msg });
        }, true);
      });
    }

    if (searchBtn) {
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
    }

    map.on('zoomend', () => {
      this.zoom = map.getZoom();
      this.zoomEle.value = this.zoom;
    });

    marker.on('drag', () => {
      const position = marker.getLatLng();
      const { lat, lng } = position;
      this.updatePin({ lat, lng, disableViewUpdate: true });
    });

    marker.on('dragend', () => {
      const position = marker.getLatLng();
      const { lat, lng } = position;
      map.panTo(new Leaflet.LatLng(lat, lng));
    });
  }

  updatePin({ lat = this.lat, lng = this.lng, zoom = this.zoom, msg = this.msg, disableViewUpdate = false }) {
    if (!disableViewUpdate) {
      if (lat !== this.lat || lng !== this.lng || zoom !== this.zoom) {
        this.map.setView([lat, lng], zoom);
      }
    }
    this.marker.setLatLng([lat, lng]);
    this.lat = lat;
    this.lng = lng;
    this.zoom = zoom;
    this.msg = msg;
    this.latEle.value = lat;
    this.lngEle.value = lng;
    this.zoomEle.value = zoom;
    if (msg) {
      if (this.bindPopupFlag) {
        this.marker.bindPopup(msg);
        this.bindPopupFlag = false;
      }
      this.marker.setPopupContent(msg);
    } else {
      this.marker.closePopup();
      this.marker.unbindPopup();
      this.bindPopupFlag = true;
    }
    return this;
  }

  destroy() {
    const { latEle, lngEle, zoomEle, msgEle, searchBtn } = this;
    if (latEle) {
      latEle.removeEventListener('input', this.latinputListener, true);
      latEle.removeEventListener('change', this.latchangeListener, true);
    }

    if (lngEle) {
      lngEle.removeEventListener('input', this.lnginputListener, true);
      lngEle.removeEventListener('change', this.lngchangeListener, true);
    }

    if (zoomEle) {
      zoomEle.removeEventListener('input', this.zoominputListener, true);
      zoomEle.removeEventListener('change', this.zoomchangeListener, true);
    }

    if (msgEle) {
      msgEle.removeEventListener('input', this.msginputListener, true);
      msgEle.removeEventListener('change', this.msginputListener, true);
    }

    if (searchBtn) {
      searchBtn.removeEventListener('click', this.searchBtnListener, true);
    }

    this.map.remove();
    this.map.off();
  }
}
