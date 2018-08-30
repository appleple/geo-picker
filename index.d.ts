declare module 'openmap-editor' {
	interface OpenMapEditorOption {
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

	export default class OpenMapEditor {
		constructor(selector: string | HTMLElement, option?:OpenMapEditorOption) : this;
		updatePin(option: updateOption) : this;
		destroy(): void
	}
}
