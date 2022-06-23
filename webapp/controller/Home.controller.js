sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/core/Fragment',
	'sap/m/MessageToast'
], function (Controller, Fragment, MessageToast) {
	"use strict";

	return Controller.extend("sap.ui.demo.basicTemplate.controller.Home", {

		onInit: function () {
			var oModel = this.getModel("Table");
			oModel.setProperty("/new", {})
			oModel.setProperty("/front", [])
			this.oRouter = this.getOwnerComponent().getRouter();
			fetch('http://lebovsky.site:5000/api/index', {
				credentials: 'include',
				headers: {
					"Access-Control-Allow-Headers": "Content-Type",
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "OPTIONS,POST,GET",
					'Access-Control-Allow-Credentials': 'true',
					'Content-Type': 'application/json',
					'Accept': 'application/json'
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

		restUpdateList: function () {
			var oModel = this.getModel("Table");
			fetch('http://lebovsky.site:5000/api/index', {
				credentials: 'include',
				headers: {
					"Access-Control-Allow-Headers": "Content-Type",
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "OPTIONS,POST,GET",
					'Access-Control-Allow-Credentials': 'true',
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
			}).then((response) => {
				return response.json();
			}).then((data) => {
				console.log(data);
				oModel.setProperty("/front", data)
				return true
			});
		},

		setBD: async function (link, parametr) {
			let response = await fetch('http://lebovsky.site:5000/api/' + link, {
				credentials: 'include',
				method: 'POST',
				body: JSON.stringify(parametr),
				headers: {
					"Access-Control-Allow-Headers": "Content-Type",
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "OPTIONS,POST,GET",
					'Access-Control-Allow-Credentials': 'true',
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
			});
			if (response.ok) {
				await this.restUpdateList()
				return response.status
			} else {
				alert('error', response.status);
			}
		},

		openFragment: function () {
			var oModel = this.getModel("Table");
			var oUsers = oModel.getProperty("/front")
			console.log(oUsers)
			if (!this.pDialog) {
				this.pDialog = Fragment.load({
					name: "sap.ui.demo.basicTemplate.view.AddEvent",
					controller: this
				}).then(function (oDialog) {
					this.getView().addDependent(oDialog);
					return oDialog;
				}.bind(this));
			}
			this.pDialog.then(function (oDialog) {
				oDialog.open();
			});
		},

		comentPopoverPress: function (oEvent) {
			var oModel = this.getModel("Table");
			var oContext = oEvent.getSource().getBindingContext("Table").sPath
			var oItem = oModel.getProperty(oContext)
			var pop = new sap.m.Popover({
				title: "Комментарий",
				placement: "Bottom",
				contentWidth: "200px",
				contentHeight: "150px",
				content: [new sap.m.Text({ text: oItem.comments })]
			})
			pop.addEventDelegate({
				onmouseout: function () {
					pop.close()
				}
			}, this);
			pop.openBy(oEvent.getSource());
		},

		addEvent: async function (oEvent) {
			var oModel = this.getModel("Table");
			var oFront = oModel.getProperty("/front")
			var oNewItem = oModel.getProperty("/new");
			var oTempItem = oModel.getProperty("/tempitem");
			if (oNewItem.id == undefined) {
				var sID = oFront.id[0].id + 1
				oNewItem.id = sID
				if (oNewItem.DP === undefined ||
					oNewItem.money === undefined ||
					oNewItem.Email1 === undefined ||
					oNewItem.Email2 === undefined) {
					MessageToast.show("Заполните все поля");
				} else {
					this.setBD("additem", oNewItem)
					oModel.setProperty("/new", {})
					oEvent.getSource().getParent().getParent().close()
				};
			} else {
				var oModel = this.getModel("Table");
				var oTempItem = oModel.getProperty("/tempitem");
				var oNewItem = oModel.getProperty("/new");
				if (oNewItem.name1 === oTempItem.name1 && oNewItem.name2 === oTempItem.name2) {
					oNewItem.oldmoney = oTempItem.money
					await this.setBD("edititem", oNewItem);
					await this.restUpdateList()
					oModel.setProperty("/new", {})
					this.pDialog.then(function (oDialog) {
						oDialog.close();
					});
				} else {
					MessageToast.show("Нельзя менять имена");
				}
			}
		},

		onCloseDialog: function () {
			var oModel = this.getModel("Table");
			oModel.setProperty("/new", {})
			this.restUpdateList()
			this.pDialog.then(function (oDialog) {
				oDialog.close();
			})
		},

		delItemList: function (oEvent) {
			var oModel = this.getModel("Table");
			var oItem = oEvent.getParameter("listItem"),
				sPath = oItem.oBindingContexts.Table.sPath;
			var oDelItem = oModel.getProperty(sPath)
			this.setBD("delitem", oDelItem)
		},

		playItem: function (oEvent) {
			var oModel = this.getModel("Table");
			var oContext = oEvent.getSource().getBindingContext("Table").sPath
			var oItem = oModel.getProperty(oContext)
			var oClone = {};
			Object.assign(oClone, oItem)
			oModel.setProperty("/tempitem", oClone)
			oModel.setProperty("/new", oItem)
			this.openFragment()
		},

		logout: function () {
			fetch('http://lebovsky.site:5000/api/logout', {
				credentials: 'include',
				method: 'POST',
				body: JSON.stringify(),
				headers: {
					"Access-Control-Allow-Headers": "Content-Type",
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "OPTIONS,POST,GET",
					'Access-Control-Allow-Credentials': 'true',
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
			}).then((response) => {
				return response.json();
			}).then((data) => {
				if (data.status === 200) {

				} else {
					this.oRouter.navTo("auth");
					var oModel = this.getModel("Table");
					oModel.setProperty("/front", {})
					oModel.setProperty("/auth", {})
				}
			});
		},

		handleNav: function (evt) {
			var navCon = this.byId("navCon");
			var target = evt.getSource().data("target");
			if (target) {
				navCon.to(this.byId(target), "fade");
			} else {
				navCon.back();
			}
		}
	});
});