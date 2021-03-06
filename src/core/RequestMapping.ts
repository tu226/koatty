/**
 * @ author: richen
 * @ copyright: Copyright (c) - <richenlin(at)gmail.com>
 * @ license: MIT
 * @ version: 2020-01-07 15:50:14
 */
// tslint:disable-next-line: no-import-side-effect
import "reflect-metadata";
import * as helper from "think_lib";
import { attachPropertyData } from "./Injectable";
import { ROUTER_KEY, PARAM_KEY, PARAM_RULE_KEY } from "./Constants";

/**
 *
 *
 * @export
 * @interface RouterOption
 */
export interface RouterOption {
    path?: string;
    requestMethod: string;
    routerName?: string;
    method: string;
}

/**
 * http request methods
 *
 * @export
 * @var RequestMethod
 */
export const RequestMethod = {
    GET: "get",
    POST: "post",
    PUT: "put",
    DELETE: "delete",
    PATCH: "patch",
    ALL: "all",
    OPTIONS: "options",
    HEAD: "head"
};

/**
 * Routes HTTP requests to the specified path.
 *
 * @param {string} [path="/"] router path
 * @param {*} [requestMethod=RequestMethod.GET] http methods
 * @param {{
 *         routerName?: string; router name
 *     }} [routerOptions={}]
 * @returns {MethodDecorator}
 */
export const RequestMapping = (
    path = "/",
    requestMethod = RequestMethod.GET,
    routerOptions: {
        routerName?: string;
    } = {}
): MethodDecorator => {
    const routerName = routerOptions.routerName || "";

    return (target, key: string, descriptor: PropertyDescriptor) => {
        // tslint:disable-next-line: no-object-literal-type-assertion
        attachPropertyData(ROUTER_KEY, {
            path,
            requestMethod,
            routerName,
            method: key
        } as RouterOption, target, key);

        return descriptor;
    };
};

/**
 * Routes HTTP POST requests to the specified path.
 *
 * @param {string} path
 * @param {{
 *         routerName?: string;
 *     }} [routerOptions={}]
 * @returns {MethodDecorator}
 */
export const PostMaping = (
    path = "/",
    routerOptions: {
        routerName?: string;
    } = {}
): MethodDecorator => {
    return RequestMapping(path, RequestMethod.POST, routerOptions);
};

/**
 * Routes HTTP GET requests to the specified path.
 *
 * @param {string} path
 * @param {{
 *         routerName?: string;
 *     }} [routerOptions={}]
 * @returns {MethodDecorator}
 */
export const GetMaping = (
    path = "/",
    routerOptions: {
        routerName?: string;
    } = {}
): MethodDecorator => {
    return RequestMapping(path, RequestMethod.GET, routerOptions);
};

/**
 * Routes HTTP DELETE requests to the specified path.
 *
 * @param {string} path
 * @param {{
 *         routerName?: string;
 *     }} [routerOptions={}]
 * @returns {MethodDecorator}
 */
export const DeleteMaping = (
    path = "/",
    routerOptions: {
        routerName?: string;
    } = {}
): MethodDecorator => {
    return RequestMapping(path, RequestMethod.DELETE, routerOptions);
};

/**
 * Routes HTTP PUT requests to the specified path.
 *
 * @param {string} path
 * @param {{
 *         routerName?: string;
 *     }} [routerOptions={}]
 * @returns {MethodDecorator}
 */
export const PutMaping = (
    path = "/",
    routerOptions: {
        routerName?: string;
    } = {}
): MethodDecorator => {
    return RequestMapping(path, RequestMethod.PUT, routerOptions);
};

/**
 * Routes HTTP PATCH requests to the specified path.
 *
 * @param {string} path
 * @param {{
 *         routerName?: string;
 *     }} [routerOptions={}]
 * @returns {MethodDecorator}
 */
export const PatchMaping = (
    path = "/",
    routerOptions: {
        routerName?: string;
    } = {}
): MethodDecorator => {
    return RequestMapping(path, RequestMethod.PATCH, routerOptions);
};

/**
 * Routes HTTP OPTIONS requests to the specified path.
 *
 * @param {string} path
 * @param {{
 *         routerName?: string;
 *     }} [routerOptions={}]
 * @returns {MethodDecorator}
 */
export const OptionsMaping = (
    path = "/",
    routerOptions: {
        routerName?: string;
    } = {}
): MethodDecorator => {
    return RequestMapping(path, RequestMethod.OPTIONS, routerOptions);
};

/**
 * Routes HTTP HEAD requests to the specified path.
 *
 * @param {string} path
 * @param {{
 *         routerName?: string;
 *     }} [routerOptions={}]
 * @returns {MethodDecorator}
 */
export const HeadMaping = (
    path = "/",
    routerOptions: {
        routerName?: string;
    } = {}
): MethodDecorator => {
    return RequestMapping(path, RequestMethod.HEAD, routerOptions);
};


/**
 * 
 * @param fn 
 */
const Inject = (fn: Function): ParameterDecorator => {
    return (target: any, propertyKey: string, descriptor: any) => {
        // 获取成员类型
        // const type = Reflect.getMetadata("design:type", target, propertyKey);
        // 获取成员参数类型
        const paramtypes = Reflect.getMetadata("design:paramtypes", target, propertyKey);
        // 获取成员返回类型
        // const returntype = Reflect.getMetadata("design:returntype", target, propertyKey);
        // 获取所有元数据 key (由 TypeScript 注入)
        // const keys = Reflect.getMetadataKeys(target, propertyKey);

        attachPropertyData(PARAM_KEY, {
            name: propertyKey,
            fn,
            index: descriptor,
            type: (paramtypes[descriptor] && paramtypes[descriptor].name ? paramtypes[descriptor].name : "").toLowerCase()
        }, target, propertyKey);
        return descriptor;

    };

};

/**
 * Convert paramer's type to defined.
 *
 * @param {*} param
 * @param {string} type
 * @returns
 */
const convertParamsType = (param: any, type: string) => {
    switch (type) {
        case "number":
            return helper.toNumber(param);
        case "boolean":
            return !!param;
        case "array":
        case "tuple":
            return helper.toArray(param);
        case "string":
            // Almost all types can be converted to strings, so returning directly.
            return helper.toString(param);
        case "object":
        case "enum":
        default: //any
            return param;
    }
};

/**
 * Get parsed request body.
 *
 * @export
 * @returns
 */
export function RequestBody(): ParameterDecorator {
    return Inject((ctx: any) => ctx.request.body);
}

/**
 * Get parsed query-string.
 *
 * @export
 * @param {string} [name] params name
 * @returns
 */
export function PathVariable(name?: string): ParameterDecorator {
    if (name) {
        return Inject((ctx: any, type: string) => {
            const data: any = helper.extend(ctx.params || {}, ctx.query);
            return convertParamsType(data[name], type);
        });
    } else {
        return Inject((ctx: any, type: string) => {
            const data: any = helper.extend(ctx.params || {}, ctx.query);
            return data;
        });
    }
}


/**
 * Get parsed request body.
 *
 * @export
 * @returns
 */
export function Body(): ParameterDecorator {
    return Inject((ctx: any) => ctx.request.body);
}

/**
 * Get parsed query-string.
 *
 * @export
 * @param {string} [name]
 * @returns
 */
export function Get(name?: string): ParameterDecorator {
    if (name) {
        return Inject((ctx: any, type: string) => {
            const data: any = helper.extend(ctx.params || {}, ctx.query);
            return convertParamsType(data[name], type);
        });
    } else {
        return Inject((ctx: any, type: string) => {
            const data: any = helper.extend(ctx.params || {}, ctx.query);
            return data;
        });
    }
}

/**
 * Get parsed POST/PUT... body.
 *
 * @export
 * @param {string} [name]
 * @returns
 */
export function Post(name?: string): ParameterDecorator {
    if (name) {
        return Inject((ctx: any, type: string) => {
            return ctx.post(name);
        });
    } else {
        return Inject((ctx: any, type: string) => {
            return ctx.post();
        });
    }
}

/**
 * Get parsed upload file object.
 *
 * @export
 * @param {string} [name]
 * @returns
 */
export function File(name?: string): ParameterDecorator {
    if (name) {
        return Inject((ctx: any, type: string) => {
            return ctx.file(name);
        });
    } else {
        return Inject((ctx: any, type: string) => {
            return ctx.file();
        });
    }
}

/**
 * Get request header.
 *
 * @export
 * @param {string} [name]
 * @returns
 */
export function Header(name?: string): ParameterDecorator {
    if (name) {
        return Inject((ctx: any, type: string) => {
            return ctx.get(name);
        });
    } else {
        return Inject((ctx: any, type: string) => {
            return ctx.headers;
        });
    }
}

