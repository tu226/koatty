/**
 * @ author: richen
 * @ copyright: Copyright (c) - <richenlin(at)gmail.com>
 * @ license: MIT
 * @ version: 2020-02-24 16:06:35
 */
import { Middleware, Helper } from "../../../src/index";

const defaultOptions = {};

@Middleware()
export class Models {
    run(options: any, app: any) {
        Helper.define(app, "mm1", 111);
        //应用启动执行一次
        app.once('appReady', () => {
            Helper.define(app, "mm2", 222);
        });
        return function (ctx: any, next: any) {
            console.log('111111');
            return next();
        };
    }
}