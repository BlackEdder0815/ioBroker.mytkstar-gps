"use strict";

/*
 * Created with @iobroker/create-adapter v2.3.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require("@iobroker/adapter-core");

// Load your modules here, e.g.:
// const fs = require("fs");
const axios = require("axios").default;
const cheerio = require("cheerio");
const rjsonParser = require("really-relaxed-json").createParser();


class MytkstarGps extends utils.Adapter {

	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	constructor(options) {
		super({
			...options,
			name: "mytkstar-gps",
		});
		this.on("ready", this.onReady.bind(this));
		this.on("unload", this.onUnload.bind(this));

		this.queryProcessID = null;
	}

	/**
	 * Worker function. This function is called regulary to fetch
	 * the latest state of the gps-token from the vendor page.
	 * @param {MytkstarGps} context
	 */
	async updateStates(context) {
		try{
			context.log.debug("intervall triggered");

			// fetch login-properties
			const responseInit = await axios.get("https://www.mytkstar.net/Login.aspx");
			const cookies = responseInit.headers["set-cookie"];
			let cookie = "";
			if(cookies && cookies?.length > 0) {
				cookie = cookies[0].split(";")[0].trim();
			}
			context.log.debug(`cookie: ${cookie}`);
			const $ = cheerio.load(responseInit.data);
			const viewstate = $("#__VIEWSTATE").val();
			const viewstateGen = $("#__VIEWSTATEGENERATOR").val();
			const eventvalidation = $("#__EVENTVALIDATION").val();

			context.log.debug(`viewstate: ${viewstate}, viewstateGen: ${viewstateGen}, eventvalidation: ${eventvalidation}`);

			// proceed login

			const responseLogin = await axios.postForm("https://www.mytkstar.net/Login.aspx", {
				__VIEWSTATE: viewstate,
				__VIEWSTATEGENERATOR: viewstateGen,
				__EVENTVALIDATION: eventvalidation,
				btnLoginImei: "",
				txtAccountPassword: "",
				txtUserName: "",
				hidGMT: "1",
				txtImeiPassword: context.config.Password,
				txtImeiNo: context.config.trackerID
			}, {
				headers: {
					"content-type": "multipart/form-data",
					"cookie": cookie
				}
			});

			const authCookies = responseLogin.headers["set-cookie"];
			let authCookie = null;
			if(authCookies && authCookies?.length > 0) {
				authCookie = authCookies[0].split(";")[0].trim();
			}
			context.log.debug(`auth cookie: ${authCookie}`);
			if(authCookie == null) {
				context.log.warn("auth cookie not found in request. Wrong permission data?");
				context.connected = false;
				return;
			}

			context.connected = true;

			const fetchTokenDataRequest = await axios.post("https://www.mytkstar.net/Ajax/DevicesAjax.asmx/GetDevicesByUserID", {
				UserID: 36160,
				isFirst: false,
				TimeZones:"1:00",
				DeviceID:1259673,
				IsKM:1
			}, {
				headers: {
					"content-type": "application/json",
					"cookie": `${authCookie}; ${cookie}`
				}
			});

			const d = fetchTokenDataRequest.data.d;
			if(!d) {
				context.log.error("response contains not the expected object 'd'");
				context.connected = false;
				return;
			}

			const tokenObject = JSON.parse(rjsonParser.stringToJson(d));

			context.log.debug(JSON.stringify(tokenObject));

			await context.setStateAsync("token.id", { val: tokenObject.devices[0].id, ack: true });
			await context.setStateAsync("token.locationID", { val: parseInt(tokenObject.devices[0].locationID), ack: true });
			await context.setStateAsync("token.groupID", { val: tokenObject.devices[0].groupID, ack: true });
			await context.setStateAsync("token.serverUtcDate", { val: tokenObject.devices[0].serverUtcDate, ack: true });
			await context.setStateAsync("token.deviceUtcDate", { val: tokenObject.devices[0].deviceUtcDate, ack: true });
			await context.setStateAsync("token.baiduLat", { val: parseFloat(tokenObject.devices[0].baiduLat), ack: true });
			await context.setStateAsync("token.baiduLng", { val: parseFloat(tokenObject.devices[0].baiduLng), ack: true });
			await context.setStateAsync("token.latitude", { val: parseFloat(tokenObject.devices[0].latitude), ack: true });
			await context.setStateAsync("token.longitude", { val: parseFloat(tokenObject.devices[0].longitude), ack: true });
			await context.setStateAsync("token.ofl", { val: parseInt(tokenObject.devices[0].ofl), ack: true });
			await context.setStateAsync("token.speed", { val: parseFloat(tokenObject.devices[0].speed), ack: true });
			await context.setStateAsync("token.course", { val: parseInt(tokenObject.devices[0].course), ack: true });
			await context.setStateAsync("token.dataType", { val: parseInt(tokenObject.devices[0].dataType), ack: true });
			await context.setStateAsync("token.battery", { val: parseInt(tokenObject.devices[0].dataContext.split("-")[1]) , ack: true });
			await context.setStateAsync("token.distance", { val: parseFloat(tokenObject.devices[0].distance), ack: true });
			await context.setStateAsync("token.isStop", { val: tokenObject.devices[0].isStop, ack: true });
			await context.setStateAsync("token.stopTimeMinute", { val: tokenObject.devices[0].stopTimeMinute, ack: true });
			await context.setStateAsync("token.carStatus", { val: tokenObject.devices[0].carStatus, ack: true });
			await context.setStateAsync("token.status", { val: tokenObject.devices[0].status, ack: true });

			context.log.info("States updated");



		} catch (error) {
			context.log.error(error);
			context.connected = false;
		}
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	async onReady() {
		// Initialize your adapter here

		// The adapters config (in the instance object everything under the attribute "native") is accessible via
		// this.config:
		this.log.debug("config trackerID: " + this.config.trackerID);
		this.log.debug("config request intervall: " + this.config.requestFrequency);
		this.connected = false;

		this.updateStates(this);
		this.queryProcessID = this.setInterval(this.updateStates, this.config.requestFrequency * 60000, this);

	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 * @param {() => void} callback
	 */
	onUnload(callback) {
		try {
			// Here you must clear all timeouts or intervals that may still be active
			if(this.queryProcessID) {
				this.clearInterval(this.queryProcessID);
			}

			callback();
		} catch (e) {
			callback();
		}
	}
}

if (require.main !== module) {
	// Export the constructor in compact mode
	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	module.exports = (options) => new MytkstarGps(options);
} else {
	// otherwise start the instance directly
	new MytkstarGps();
}