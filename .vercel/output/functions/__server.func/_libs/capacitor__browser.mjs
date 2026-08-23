import { n as __exportAll } from "../_runtime.mjs";
import { n as WebPlugin, r as registerPlugin } from "./capacitor__app+capacitor__core.mjs";
//#region node_modules/@capacitor/browser/dist/esm/index.js
var esm_exports = /* @__PURE__ */ __exportAll({ Browser: () => Browser$1 });
var Browser$1 = registerPlugin("Browser", { web: () => Promise.resolve().then(() => web_exports).then((m) => new m.BrowserWeb()) });
//#endregion
//#region node_modules/@capacitor/browser/dist/esm/web.js
var web_exports = /* @__PURE__ */ __exportAll({ BrowserWeb: () => BrowserWeb });
var BrowserWeb = class extends WebPlugin {
	constructor() {
		super();
		this._lastWindow = null;
	}
	async open(options) {
		this._lastWindow = window.open(options.url, options.windowName || "_blank");
	}
	async close() {
		return new Promise((resolve, reject) => {
			if (this._lastWindow != null) {
				this._lastWindow.close();
				this._lastWindow = null;
				resolve();
			} else reject("No active window to close!");
		});
	}
};
new BrowserWeb();
//#endregion
export { esm_exports as t };
