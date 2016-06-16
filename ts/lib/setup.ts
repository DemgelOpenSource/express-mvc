import {IKernel, Kernel, makePropertyInjectDecorator} from "inversify";
import {ExpressMvc} from "./express-mvc";
import {RouteBuilder} from "./router";
import {mvcController} from "./controllers/mvcController";
import * as _debug from "debug";

var debug = _debug("expressify:setup");

export const SYMBOLS = {
    express: "express-mvc",
    router: "router"
}

var k: IKernel = new Kernel();
export var pInject = makePropertyInjectDecorator(k);
export var kernel = k;

k.bind<RouteBuilder>(RouteBuilder).to(RouteBuilder).inSingletonScope().onActivation((context, router) => {
    router.kernelInstance = kernel;
    return router;
});
k.bind<ExpressMvc>(ExpressMvc).to(ExpressMvc).onActivation((context, expressify) => {
    expressify.kernel = kernel;
    return expressify;
});

/**
 * The main function called to create a ExpressMvc object, initialized the DI and returns a useable ExpressMvc object
 *
 * @param {...mvcController} ...controllers The list of controllers to add to DI, all controllers used are required.
 * @return {ExpressMvc}
 */
export function expressMvc(...controllers: any[]): ExpressMvc {
    debug("Starting ExpressMVC");
    // Handle registering Controllers
    controllers.forEach(controller => {
        debug(`Binding controller (${controller.name})`);
        kernel.bind<mvcController>(controller).to(controller);
        debug(`Bound controller (${controller.name})})`);
    });
    debug('Finished binding controllers...');
    let mvc = kernel.get<ExpressMvc>(ExpressMvc) as ExpressMvc;
    // mvc.kernel = kernel;
    return mvc;
}

export function getRouter(): RouteBuilder {
    return kernel.get<RouteBuilder>(RouteBuilder);
}