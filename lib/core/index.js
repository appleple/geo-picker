'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

var _leafletGeosearch = require('leaflet-geosearch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// setup
var provider = new _leafletGeosearch.OpenStreetMapProvider();

var defaultOptions = {
  searchInput: '.js-search',
  searchBtn: '.js-search-btn',
  lngInput: '.js-lng',
  latInput: '.js-lat',
  zoomInput: '.js-zoom',
  msgInput: '.js-msg',
  map: '.js-map'
};

var GeoPicker = function () {
  function GeoPicker(item, options) {
    var Leaflet = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _leaflet2.default;

    _classCallCheck(this, GeoPicker);

    var opt = Object.assign({}, defaultOptions, options);
    var selector = typeof item === 'string' ? document.querySelector(item) : item;
    if (!selector) {
      return;
    }
    var mapEle = selector.querySelector(opt.map);
    var lngEle = selector.querySelector(opt.lngInput);
    var latEle = selector.querySelector(opt.latInput);
    var zoomEle = selector.querySelector(opt.zoomInput);
    var searchInputEle = selector.querySelector(opt.searchInput);
    var searchBtn = selector.querySelector(opt.searchBtn);
    var msgEle = selector.querySelector(opt.msgInput);
    var lat = latEle.value;
    var lng = lngEle.value;
    var zoom = zoomEle.value;
    var msg = msgEle.value;
    var map = Leaflet.map(mapEle).setView([lat, lng], zoom);
    var marker = Leaflet.marker(map.getCenter(), {
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

  _createClass(GeoPicker, [{
    key: 'setValues',
    value: function setValues() {
      var latEle = this.latEle,
          lngEle = this.lngEle,
          zoomEle = this.zoomEle,
          msgEle = this.msgEle;

      this.lat = latEle.value;
      this.lng = lngEle.value;
      this.zoom = zoomEle.value;
      this.msg = msgEle.value;
      return this;
    }
  }, {
    key: 'run',
    value: function run() {
      var map = this.map,
          msg = this.msg,
          marker = this.marker,
          Leaflet = this.Leaflet;

      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      var view = marker.addTo(map);
      if (msg) {
        view.bindPopup(msg);
      }
      this.setEvent();
      return this;
    }
  }, {
    key: 'setEvent',
    value: function setEvent() {
      var _this = this;

      var map = this.map,
          msgEle = this.msgEle,
          marker = this.marker,
          latEle = this.latEle,
          lngEle = this.lngEle,
          zoomEle = this.zoomEle,
          searchBtn = this.searchBtn,
          searchInputEle = this.searchInputEle,
          Leaflet = this.Leaflet;


      if (lngEle) {
        ['input', 'change'].forEach(function (eventName) {
          lngEle.addEventListener(eventName, _this['lng' + eventName + 'Listener'] = function (e) {
            var lng = e.target.value;
            _this.updatePin({ lng: lng });
          }, true);
        });
      }

      if (latEle) {
        ['input', 'change'].forEach(function (eventName) {
          latEle.addEventListener(eventName, _this['lat' + eventName + 'Listener'] = function (e) {
            var lat = e.target.value;
            _this.updatePin({ lat: lat });
          }, true);
        });
      }

      if (zoomEle) {
        ['input', 'change'].forEach(function (eventName) {
          zoomEle.addEventListener(eventName, _this['zoom' + eventName + 'Listener'] = function (e) {
            var zoom = e.target.value;
            _this.updatePin({ zoom: zoom });
          }, true);
        });
      }

      if (msgEle) {
        ['input', 'change'].forEach(function (eventName) {
          msgEle.addEventListener('input', _this['msg' + eventName + 'Listener'] = function (e) {
            var msg = e.target.value;
            _this.updatePin({ msg: msg });
          }, true);
        });
      }

      if (searchBtn) {
        searchBtn.addEventListener('click', this.searchBtnListener = function () {
          var query = searchInputEle.value;
          provider.search({ query: query }).then(function (results) {
            if (results.length) {
              var result = results[0];
              _this.updatePin({
                lng: result.x,
                lat: result.y
              });
            }
          });
        }, true);
      }

      map.on('zoomend', function () {
        _this.zoom = map.getZoom();
        _this.zoomEle.value = _this.zoom;
      });

      marker.on('drag', function () {
        var position = marker.getLatLng();
        var lat = position.lat,
            lng = position.lng;

        _this.updatePin({ lat: lat, lng: lng, disableViewUpdate: true });
      });

      marker.on('dragend', function () {
        var position = marker.getLatLng();
        var lat = position.lat,
            lng = position.lng;

        map.panTo(new Leaflet.LatLng(lat, lng));
      });
    }
  }, {
    key: 'updatePin',
    value: function updatePin(_ref) {
      var _ref$lat = _ref.lat,
          lat = _ref$lat === undefined ? this.lat : _ref$lat,
          _ref$lng = _ref.lng,
          lng = _ref$lng === undefined ? this.lng : _ref$lng,
          _ref$zoom = _ref.zoom,
          zoom = _ref$zoom === undefined ? this.zoom : _ref$zoom,
          _ref$msg = _ref.msg,
          msg = _ref$msg === undefined ? this.msg : _ref$msg,
          _ref$disableViewUpdat = _ref.disableViewUpdate,
          disableViewUpdate = _ref$disableViewUpdat === undefined ? false : _ref$disableViewUpdat;

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
  }, {
    key: 'destroy',
    value: function destroy() {
      var latEle = this.latEle,
          lngEle = this.lngEle,
          zoomEle = this.zoomEle,
          msgEle = this.msgEle,
          searchBtn = this.searchBtn;

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
  }]);

  return GeoPicker;
}();

exports.default = GeoPicker;
module.exports = exports['default'];