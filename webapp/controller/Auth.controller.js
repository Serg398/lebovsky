sap.ui.define([
    "sap/ui/core/mvc/Controller",
], function (Controller) {
    "use strict";

    return Controller.extend("sap.ui.demo.basicTemplate.controller.Auth", {

        onInit: function () {
            var oModel = this.getModel("Table");
            oModel.setProperty("/auth", {})
            this.oRouter = this.getOwnerComponent().getRouter();
            fetch('http://127.0.0.1:5000/login', {
                method: 'POST',
                body: JSON.stringify(),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                return response.json();
            }).then((data) => {
                if (data.status === 200) {
                    this.oRouter.navTo("home");
                } else {
                    
                }
            });
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
            fetch('http://127.0.0.1:5000/login', {
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
        }
    });
});