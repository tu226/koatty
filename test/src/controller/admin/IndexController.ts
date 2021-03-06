/**
 * @ author: xxx
 * @ copyright: Copyright (c)
 * @ license: Apache License 2.0
 * @ version: 2020-01-17 11:08:27
 */
import { Controller, GetMaping, Autowired, RequestMapping, RequestMethod, PostMaping, Before, BeforeEach, After, RequestBody, Get, Validated, Valid, Helper } from "../../../../src/index";
import { App } from '../../App';
import { AdminController } from "../AdminController";
import { TestService } from "../../service/TestService";
import { Dto } from '../../model/Dto';
import { TestModel } from '../../model/TestModel';

@Controller("/admin")
export class IndexController extends AdminController {
    app: App;
    pageInfo: { 'appName': string; 'appVersion': string; 'appKeywords': string; 'appDescription': string; };

    @Autowired()
    private testService: TestService;
    cache: {};

    init() {
        this.cache = {};
    }

    // __before() {
    //     console.log('__before');
    //     return Promise.resolve();
    // }

    @RequestMapping("/", RequestMethod.ALL)
    // @Before("TestAspect")
    async default(@Get("aa") @Valid(["IsNotEmpty", "IsDate"], "格式不正确") aa: number) {
        return this.ok(Helper.toString(aa));
    }

    @RequestMapping("/test", RequestMethod.ALL)
    @Validated()
    async test(@Get() aa: Dto) {
        console.log(Helper.isFunction(TestModel));
        const info = await this.testService.test(aa);
        return this.body(info);
    }

}
