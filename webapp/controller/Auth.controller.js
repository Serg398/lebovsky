sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast'
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("sap.ui.demo.basicTemplate.controller.Auth", {

        onInit: function () {
            var oModel = this.getModel("Table");
            oModel.setProperty("/auth", {})
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("auth").attachMatched(this._onRouteMatched, this);

        },
        _onRouteMatched: function (oEvent) {
            var oUrlArgs = oEvent.getParameter("arguments"),
                bUpdate = oUrlArgs.update === "true";
            if (bUpdate) {
                this.getModel().refresh();
            }
        },
        getModel: function (sName) {
            return this.getView().getModel(sName) || this.getOwnerComponent().getModel(sName);
        },

        setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        routeReg: function () {
            this.oRouter.navTo("register");
        },

        singIn: function () {
            var oModel = this.getModel("Table");
            var oAuth = oModel.getProperty("/auth")
            if (oAuth.Email != undefined || oAuth.pass != undefined) {
                fetch('http://127.0.0.1:5000/login', {
                    mode: 'cors',
                    credentials: 'include',
                    method: 'POST',
                    body: JSON.stringify(oAuth),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((response) => {
                    return response.json();
                }).then((data) => {
                    if (data.status === 204) {
                        alert(data.text)
                    } else {
                        this.oRouter.navTo("home");
                    }
                });
            } else {
                MessageToast.show("Заполните все поля")
            }
        }
    });
});