declare module 'geo-picker' {
	interface GeoPickerOption {
		searchInput?: string,
		searchBtn?: string,
		lngInput?: string,
		latInput?: string,
		zoomInput?: string,
		msgInput?: string,
		map?: string
	}

	interface updateOption {
		lat?: number,
		lng?: number,
		zoom?: number,
		msg?: string,
		disableViewUpdate?: boolean
	}

	export default class GeoPicker {
		constructor(selector: string | HTMLElement, option?:GeoPickerOption) : GeoPicker;
		updatePin(option: updateOption) : GeoPicker;
		setValues() : GeoPicker;
		run(): GeoPicker;
		destroy(): void
	}
}
