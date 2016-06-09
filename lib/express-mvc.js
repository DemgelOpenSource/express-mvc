/// <reference path="../../node_modules/inversify-dts/inversify/inversify.d.ts" />
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
const e = require("express");
const inversify_1 = require('inversify');
const controller_1 = require('./decorators/controller');
const router_1 = require("./router");
require("reflect-metadata");
exports.express = Symbol("express-mvc");
exports.router = Symbol("router");
const kernel = new inversify_1.Kernel();
function expressMvc(...controllers) {
    // kernel = new Kernel();
    kernel.bind(exports.express).to(ExpressMvc);
    kernel.bind(exports.router).to(router_1.Router);
    // Handle registering Controllers
    controllers.forEach(controller => {
        kernel.bind(controller_1.GetControllerName(controller)).to(controller);
    });
    return kernel.get(exports.express);
}
exports.expressMvc = expressMvc;
let ExpressMvc = class ExpressMvc {
    constructor(router) {
        this.router = router;
        router.kernel = kernel;
    }
    addTransient() { }
    addSingleton() { }
    start() {
        // Define the express server
        this.server = e();
        // TODO will change this a options setting for production... but we are no where near that, if ever ;)
        this.server.set('views', '../views');
        this.server.set('view engine', 'pug');
        // This will call the router which will be from inversify, for now fudge it
        this.server.get("/:one?/:two?/:three?", (req, res) => {
            this.router.route(req, res);
        });
        this.server.listen(3000, () => {
            console.log("Listening on port 3000");
        });
    }
};
ExpressMvc = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(exports.router)), 
    __metadata('design:paramtypes', [router_1.Router])
], ExpressMvc);