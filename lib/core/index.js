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
    _classCallCheck(this, GeoPicker);

    var opt = Object.assign({}, defaultOptions, options);
    var selector = document.querySelector(item);
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
    var map = _leaflet2.default.map(mapEle).setView([lat, lng], zoom);
    var marker = _leaflet2.default.marker(map.getCenter(), {
      draggable: true
    });
    _leaflet2.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    marker.addTo(map).bindPopup(msg).openPopup();

    this.options = opt;
    this.selector = selector;
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
    this.setEvent();
    return this;
  }

  _createClass(GeoPicker, [{
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
          searchInputEle = this.searchInputEle;

      lngEle.addEventListener('input', this.lngListener = function (e) {
        var lng = e.target.value;
        _this.updatePin({ lng: lng });
      }, true);

      latEle.addEventListener('input', this.latListener = function (e) {
        var lat = e.target.value;
        _this.updatePin({ lat: lat });
      }, true);

      map.on('zoomend', function () {
        _this.zoom = map.getZoom();
        _this.zoomEle.value = _this.zoom;
      });

      zoomEle.addEventListener('input', this.zoomListener = function (e) {
        var zoom = e.target.value;
        _this.updatePin({ zoom: zoom });
      }, true);

      msgEle.addEventListener('input', this.msgListener = function (e) {
        var msg = e.target.value;
        _this.updatePin({ msg: msg });
      }, true);

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

        map.panTo(new _leaflet2.default.LatLng(lat, lng));
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
  }, {
    key: 'destroy',
    value: function destroy() {
      var latEle = this.latEle,
          lngEle = this.lngEle,
          zoomEle = this.zoomEle;

      latEle.removeEventListener('input', this.latListener, true);
      lngEle.removeEventListener('input', this.lngListener, true);
      zoomEle.removeEventListener('input', this.zoomListener, true);
      this.map.remove();
      this.map.off();
    }
  }]);

  return GeoPicker;
}();

exports.default = GeoPicker;
module.exports = exports['default'];