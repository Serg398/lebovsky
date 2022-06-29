sap.ui.define([
	"sap/ui/core/mvc/Controller",
], function (Controller) {
	"use strict";

	return Controller.extend("sap.ui.demo.basicTemplate.controller.Profile", {

		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			var oModel = this.getModel("Table");
			var sHost = oModel.getProperty('/host')
			fetch(sHost + ':5000/api/index', {
				credentials: 'include',
				headers: {
					'Access-Control-Allow-Origin': sHost,
					'Content-Type': 'application/json'
				}
			}).then((response) => {
				return response.json();
			}).then((data) => {
				console.log(data);
				if (data.status === 204) {
					this.oRouter.navTo("auth");
				} else {
					oModel.setProperty("/front", data)
				}
			});
		},

		getModel: function (sName) {
			return this.getView().getModel(sName) || this.getOwnerComponent().getModel(sName);
		},

		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		cancelSetting: function () {
			this.oRouter.navTo("home")
		},

		// handleUploadPress: function () {
		// 	var oModel = this.getModel("Table");
		// 	var sHost = oModel.getProperty('/host');
			
		// 	var oFileUploader = this.byId("fileUploader");
		// 	var domRef = oFileUploader.getFocusDomRef();
 		// 	var file = domRef.files[0];
			
		// 	var response = fetch(sHost + ':5000/api/upload', {
		// 		credentials: 'include',
		// 		method: 'POST',
		// 		body: file,
		// 		headers: {
		// 			'Access-Control-Allow-Origin': sHost,
		// 			'Content-Type': 'image/png'
		// 		}
		// 	});
		// 	if (response.ok) {
		// 		this.restUpdateList();
		// 		return response.status;
		// 	} else {
		// 		alert('error', response.status);
		// 	}
		// }
	});
});