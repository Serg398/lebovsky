sap.ui.define([
    './BaseController',
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast'
], function (BaseController, Controller, MessageToast) {
    "use strict";

    return BaseController.extend("sap.ui.demo.basicTemplate.controller.Auth", {

        onInit: function () {
            var oModel = this.getModel("Table");
            oModel.setProperty("/auth", {})
            this.oRouter = this.getOwnerComponent().getRouter();
        },

        routeReg: function () {
            this.oRouter.navTo("register");
        },

        singIn: function () {
            var oModel = this.getModel("Table");
            var oAuth = oModel.getProperty("/auth")
            var sHost = oModel.getProperty('/host')
            if (oAuth.Email != undefined || oAuth.pass != undefined) {
                fetch(sHost + ':5000/api/login', {
                    credentials: 'include',
                    method: 'POST',
                    body: JSON.stringify(oAuth),
                    headers: {
                        'Access-Control-Allow-Origin': sHost,
                        'Content-Type': 'application/json'
                    }
                }).then((response) => {
                    return response.json();
                }).then((data) => {
                    if (data.status === 204) {
                        alert(data.text)
                    } else {
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
                                MessageToast.show("Не могу получить данные")
                                this.oRouter.navTo("auth");
                            } else {
                                this.oRouter.navTo("home");
                                oModel.setProperty("/front", data)
                            }
                        });
                    }
                });
            } else {
                MessageToast.show("Заполните все поля")
            }
        }
    });
});