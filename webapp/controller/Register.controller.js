sap.ui.define([
	'./BaseController',
	"sap/ui/core/mvc/Controller",
], function (BaseController) {
	"use strict";

	return BaseController.extend("sap.ui.demo.basicTemplate.controller.Register", {

		onInit: function () {
			var oModel = this.getModel("Table");
			oModel.setProperty("/register", {})
			this.oRouter = this.getOwnerComponent().getRouter();
		},

		addUser: async function () {
			var oModel = this.getModel("Table");
			var oRegister = oModel.getProperty("/register")
			var sHost = oModel.getProperty('/host')
			let response = await fetch(sHost + ':5000/api/register', {
				credentials: 'include',
				method: 'POST',
				body: JSON.stringify(oRegister),
				headers: {
					'Access-Control-Allow-Origin': sHost,
					'Content-Type': 'application/json'
				}
			});
			if (response.status === 200) {
				alert('Регистрация прошла успешно', response.status);
				this.oRouter.navTo("auth");
				oModel.setProperty("/auth", {})
			} else {
				alert('error', response.status);
			}
		}
	});
});