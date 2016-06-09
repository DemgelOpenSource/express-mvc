import {expressMvc} from "../lib/express-mvc";
import {TestController} from "./testController";
import {TestService} from "./testService";

let server = expressMvc(TestController);
server.addTransient<TestService>("TestService", TestService);
server.start();