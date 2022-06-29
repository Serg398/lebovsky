sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/core/Fragment',
	'sap/m/MessageToast',
	'sap/ui/core/BusyIndicator',
	"sap/m/MessageBox"
], function (Controller, Fragment, MessageToast, BusyIndicator, MessageBox) {
	"use strict";

	return Controller.extend("sap.ui.demo.basicTemplate.controller.Home", {

		onInit: function () {
			var oModel = this.getModel("Table");
			oModel.setProperty("/new", {});
			oModel.setProperty("/front", []);
			oModel.setProperty("/date", new Date())
			var sHost = oModel.getProperty('/host');
			this.oRouter = this.getOwnerComponent().getRouter();
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
					oModel.setProperty("/front", data);
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
			var sHost = oModel.getProperty('/host');
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
				oModel.setProperty("/front", data);
				return true;
			});
		},

		setBD: async function (link, parametr) {
			var oModel = this.getModel("Table");
			var sHost = oModel.getProperty('/host');
			let response = await fetch(sHost + ':5000/api/' + link, {
				credentials: 'include',
				method: 'POST',
				body: JSON.stringify(parametr),
				headers: {
					'Access-Control-Allow-Origin': sHost,
					'Content-Type': 'application/json'
				}
			});
			if (response.ok) {
				await this.restUpdateList();
				return response.status;
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
			var oContext = oEvent.getSource().getBindingContext("Table").sPath;
			var oItem = oModel.getProperty(oContext);
			var pop = new sap.m.Popover({
				title: "Комментарий",
				placement: "Bottom",
				contentWidth: "200px",
				contentHeight: "150px",
				content: [new sap.m.Text({ text: oItem.comments })]
			})
			pop.addEventDelegate({
				onmouseout: function () {
					pop.close();
				}
			}, this);
			pop.openBy(oEvent.getSource());
		},

		addEvent: async function () {
			var oModel = this.getModel("Table");
			var oNewItem = oModel.getProperty("/new");
			var oTempItem = oModel.getProperty("/tempitem");
			if (oNewItem.id == undefined) {
				if (oNewItem.DP === undefined ||
					oNewItem.money === undefined ||
					oNewItem.email1 === undefined ||
					oNewItem.email2 === undefined) {
					MessageToast.show("Заполните все поля");
				} else {
					this.setBD("additem", oNewItem);
					oModel.setProperty("/new", {});
					await this.restUpdateList();
					this.pDialog.then(function (oDialog) {
						oDialog.close();
						oDialog.destroy();
						this.pDialog = null;
					}.bind(this))
				};
			} else {
				var oModel = this.getModel("Table");
				var oTempItem = oModel.getProperty("/tempitem");
				var oNewItem = oModel.getProperty("/new");
				if (oNewItem.name1 ===
					oTempItem.name1 &&
					oNewItem.name2 ===
					oTempItem.name2) {
					oNewItem.oldmoney =
						oTempItem.money
					await this.setBD("edititem", oNewItem);
					await this.restUpdateList();
					await oModel.setProperty("/new", {});
					this.pDialog.then(function (oDialog) {
						oDialog.close();
						oDialog.destroy();
						this.pDialog = null;
					}.bind(this));
				} else {
					MessageToast.show("Нельзя менять имена");
				}
			}
		},

		onCloseDialogEvent: function () {
			var oModel = this.getModel("Table");
			oModel.setProperty("/new", {});
			this.restUpdateList();
			this.pDialog.then(function (oDialog) {
				oDialog.close();
			})
		},

		deleteEvent: function (oEvent) {
			var oModel = this.getModel("Table");
			var oContext = oEvent.getSource().getBindingContext("Table").sPath;
			MessageBox.warning("Вы действительно хотите удалить транзакцию?", {
				actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
				emphasizedAction: MessageBox.Action.OK,
				onClose: function (sAction) {
					if (sAction === "OK") {
						var oDelItem = oModel.getProperty(oContext);
						this.setBD("delitem", oDelItem);
					}
				}.bind(this)
			});
		},

		// deleteEvent: function (oEvent) {
		// 	var oModel = this.getModel("Table");
		// 	var oContext = oEvent.getSource().getBindingContext("Table").sPath;
		// 	var oDelItem = oModel.getProperty(oContext);
		// 	this.setBD("delitem", oDelItem);
		// },

		pressEvent: function (oEvent) {
			var oModel = this.getModel("Table");
			var oContext = oEvent.getSource().getBindingContext("Table").sPath;
			var oItem = oModel.getProperty(oContext);
			var oClone = {};
			Object.assign(oClone, oItem);
			oModel.setProperty("/tempitem", oClone);
			oModel.setProperty("/new", oItem);
			this.openFragment();
		},

		logout: function () {
			var oModel = this.getModel("Table");
			var sHost = oModel.getProperty('/host')
			fetch(sHost + ':5000/api/logout', {
				credentials: 'include',
				method: 'POST',
				body: JSON.stringify(),
				headers: {
					'Access-Control-Allow-Origin': sHost,
					'Content-Type': 'application/json'
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
		},
		pressSettings: function () {
			this.oRouter.navTo("profile");
		},

		onPressMenu: function () {
			var oView = this.getView(),
				oButton = oView.byId("button");
			if (!this._oMenuFragment) {
				this._oMenuFragment = Fragment.load({
					id: oView.getId(),
					name: "sap.ui.demo.basicTemplate.view.Menu",
					controller: this
				}).then(function (oMenu) {
					oMenu.openBy(oButton);
					this._oMenuFragment = oMenu;
					return this._oMenuFragment;
				}.bind(this));
			} else {
				this._oMenuFragment.openBy(oButton);
			}
		}
	});
});