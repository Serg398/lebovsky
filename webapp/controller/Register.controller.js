sap.ui.define([
	"sap/ui/core/mvc/Controller",
], function (Controller) {
	"use strict";

	return Controller.extend("sap.ui.demo.basicTemplate.controller.Register", {

		onInit: function () {
			var oModel = this.getModel("Table");
			oModel.setProperty("/register", {})
			this.oRouter = this.getOwnerComponent().getRouter();
		},
		getModel: function (sName) {
			return this.getView().getModel(sName) || this.getOwnerComponent().getModel(sName);
		},

		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		addUser: async function () {
			var oModel = this.getModel("Table");
			var oRegister = oModel.getProperty("/register")
			let response = await fetch('http://62.3.58.53:5000/api/register', {
				credentials: 'include',
				method: 'POST',
				body: JSON.stringify(oRegister),
				headers: {
					"Access-Control-Allow-Headers": "Content-Type",
					"Access-Control-Allow-Origin": "http://62.3.58.53",
					"Access-Control-Allow-Methods": "OPTIONS,POST,GET",
					'Access-Control-Allow-Credentials': 'true',
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
			});
			if (response.status === 200) {
				alert('Регистрация прошла успешно', response.status);
				this.oRouter.navTo("auth");
			} else {
				alert('error', response.status);
			}
		}
	});
});