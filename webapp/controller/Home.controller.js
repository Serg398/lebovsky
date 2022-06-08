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
			this.oRouter = this.getOwnerComponent().getRouter();
			this.restUpdateList()
		},

		getModel: function (sName) {
			return this.getView().getModel(sName) || this.getOwnerComponent().getModel(sName);
		},

		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		restUpdateList: function () {
			var oModel = this.getModel("Table");
			fetch('http://127.0.0.1:5000/list', {
				headers: {
					'Content-Type': 'application/json'
				}
			}).then((response) => {
				return response.json();
			})
				.then((data) => {
					console.log(data);
					oModel.setProperty("/front", data)
					return true
				});

		},

		setBD: async function (link, parametr) {
			let response = await fetch('http://127.0.0.1:5000/' + link, {
				method: 'POST',
				body: JSON.stringify(parametr),
				headers: {
					'Content-Type': 'application/json'
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
				var sID = oFront.id + 1
				oNewItem.id = sID
				if (oNewItem.DP === undefined ||
					oNewItem.money === undefined ||
					oNewItem.name1 === undefined ||
					oNewItem.name2 === undefined) {
					MessageToast.show("Заполните все поля");
				} else {
					this.setBD("additem", oNewItem)
					oModel.setProperty("/new", {})
					oEvent.getSource().getParent().getParent().close()
				};
			} else {
				await this.setBD("edittemp", oTempItem)
				await this.setBD("edititem", oNewItem);
				await this.restUpdateList()
				oModel.setProperty("/new", {})
				this.pDialog.then(function (oDialog) {
					oDialog.close();
				});
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
		}
	});
});