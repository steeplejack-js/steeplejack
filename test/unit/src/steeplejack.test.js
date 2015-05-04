/**
 * steeplejack
 */

"use strict";


/* Node modules */
var path = require("path");


/* Third-party modules */
var proxyquire = require("proxyquire");


/* Files */
var Main = rootRequire();
var Base = rootRequire("/src/library/Base");
var Router = rootRequire("src/library/Router");


describe("Main test", function () {

    describe("Instantiation method", function () {

        describe("constructor", function () {

            it("should register the config to the IOC container", function () {

                var stub = sinon.stub(Main.prototype, "getInjector");

                var registerSingleton = sinon.stub();

                stub.returns({
                    registerSingleton: registerSingleton
                });

                var obj = new Main({
                    config: "value"
                });

                expect(registerSingleton).to.be.calledOnce
                    .calledWithExactly("$config", {
                        config: "value"
                    });

                stub.restore();

            });

        });

    });

    describe("Methods", function () {

        describe("#_getNameInstance", function () {

            beforeEach(function () {

                this.obj = new Main();

            });

            it("should throw an error when a non-object is passed in", function () {

                var fail = false;

                try {
                    this.obj._getNameInstance("string");
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(SyntaxError);
                    expect(err.message).to.be.equal("Invalid module formatting");

                } finally {
                    expect(fail).to.be.true;
                }

            });

            it("should throw an error when an array is passed in", function () {

                var fail = false;

                try {
                    this.obj._getNameInstance(["string"]);
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(SyntaxError);
                    expect(err.message).to.be.equal("Invalid module formatting");

                } finally {
                    expect(fail).to.be.true;
                }

            });

            it("should throw an error when an empty object is passed in", function () {

                var fail = false;

                try {
                    this.obj._getNameInstance({});
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(SyntaxError);
                    expect(err.message).to.be.equal("Invalid module formatting");

                } finally {
                    expect(fail).to.be.true;
                }

            });

            it("should throw an error when an object with 2 keys is passed in", function () {

                var fail = false;

                try {
                    this.obj._getNameInstance({
                        something: "here",
                        somethingelse: "here"
                    });
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(SyntaxError);
                    expect(err.message).to.be.equal("Invalid module formatting");

                } finally {
                    expect(fail).to.be.true;
                }

            });

            it("should correctly return the name and instance", function () {

                expect(this.obj._getNameInstance({
                    name: "instance"
                }))
                    .to.be.eql({
                        name: "name",
                        inst: "instance"
                    });

            });

        });

        describe("#_registerModule", function () {

            it("should reject non-objects", function () {

                proxyquire.noCallThru();

                this.Main = proxyquire("../../../", {
                    "/path/to/module": 222
                });

                this.obj = new this.Main();

                var fail = false;

                try {
                    this.obj._registerModule("/path/to/module");
                } catch (err) {

                    fail = true;

                    expect(err).to.be.instanceof(SyntaxError);
                    expect(err.message).to.be.equal("Module must be an object");

                } finally {
                    expect(fail).to.be.true;
                }

            });

            it("should reject an object with 0 elements on it", function () {

                proxyquire.noCallThru();

                this.Main = proxyquire("../../../", {
                    "/path/to/module": {

                    }
                });

                this.obj = new this.Main();

                var fail = false;

                try {
                    this.obj._registerModule("/path/to/module");
                } catch (err) {

                    fail = true;

                    expect(err).to.be.instanceof(SyntaxError);
                    expect(err.message).to.be.equal("Module must be an object with exactly 1 element");

                } finally {
                    expect(fail).to.be.true;
                }

            });

            it("should reject an object with 2 elements on it", function () {

                proxyquire.noCallThru();

                this.Main = proxyquire("../../../", {
                    "/path/to/module": {
                        key1: "",
                        key2: ""
                    }
                });

                this.obj = new this.Main();

                var fail = false;

                try {
                    this.obj._registerModule("/path/to/module");
                } catch (err) {

                    fail = true;

                    expect(err).to.be.instanceof(SyntaxError);
                    expect(err.message).to.be.equal("Module must be an object with exactly 1 element");

                } finally {
                    expect(fail).to.be.true;
                }

            });

            it("should reject an key that doesn't begin with __", function () {

                proxyquire.noCallThru();

                this.Main = proxyquire("../../../", {
                    "/path/to/module": {
                        key1: ""
                    }
                });

                this.obj = new this.Main();

                var fail = false;

                try {
                    this.obj._registerModule("/path/to/module");
                } catch (err) {

                    fail = true;

                    expect(err).to.be.instanceof(SyntaxError);
                    expect(err.message).to.be.equal("No known modules");

                } finally {
                    expect(fail).to.be.true;
                }

            });

            it("should throw an error if the registration function doesn't exist", function () {

                proxyquire.noCallThru();

                this.Main = proxyquire("../../../", {
                    "/path/to/module": {
                        __unknownModule: ""
                    }
                });

                this.obj = new this.Main();

                var fail = false;

                try {
                    this.obj._registerModule("/path/to/module");
                } catch (err) {

                    fail = true;

                    expect(err).to.be.instanceof(SyntaxError);
                    expect(err.message).to.be.equal("Unknown module type: __unknownModule");

                } finally {
                    expect(fail).to.be.true;
                }

            });

            it("should run the registration function with the module", function () {

                proxyquire.noCallThru();

                this.Main = proxyquire("../../../", {
                    "/path/to/module": {
                        __myModule: "moduleFn"
                    }
                });

                this.obj = new this.Main();

                this.obj.registerMyModule = sinon.spy();

                this.obj._registerModule("/path/to/module");

                expect(this.obj.registerMyModule).to.be.calledOnce
                    .calledWith({
                        __myModule: "moduleFn"
                    });

            });

        });

        describe("#addModule", function () {

            beforeEach(function () {

                proxyquire.noCallThru();

                this.glob = {
                    sync: sinon.stub()
                };

                this.Main = proxyquire("../../../", {
                    glob: this.glob
                });

                this.obj = new this.Main();

            });

            it("should register an array of modules", function () {

                this.glob.sync.onCall(0).returns([
                    "/path/to/module1",
                    "/path/to/module1a"
                ]);

                this.glob.sync.onCall(1).returns([
                    "/path/to/module2",
                    "/path/to/module2a",
                    "/path/to/module2b"
                ]);

                this.glob.sync.onCall(2).returns([
                    "/path/to/module3"
                ]);

                this.obj.addModule([
                    "module1",
                    "module2",
                    "module3"
                ]);

                expect(this.obj._modules).to.be.eql([
                    "/path/to/module1",
                    "/path/to/module1a",
                    "/path/to/module2",
                    "/path/to/module2a",
                    "/path/to/module2b",
                    "/path/to/module3"
                ]);

                expect(this.glob.sync).to.be.calledThrice
                    .calledWith(path.join(process.cwd(), "module1"))
                    .calledWith(path.join(process.cwd(), "module2"))
                    .calledWith(path.join(process.cwd(), "module3"));

            });

            it("should register a single string", function () {

                this.glob.sync.returns([
                    "/path/to/module1",
                    "/path/to/module2"
                ]);

                this.obj.addModule("module1");

                expect(this.obj._modules).to.be.eql([
                    "/path/to/module1",
                    "/path/to/module2"
                ]);

                expect(this.glob.sync).to.be.calledOnce
                    .calledWith(path.join(process.cwd(), "module1"));

            });

            it("should throw an error if a non-string is passed in with the array", function () {

                var fail = false;

                try {

                    this.obj.addModule([
                        2
                    ]);

                } catch (err) {

                    fail = true;

                    expect(err).to.be.instanceof(TypeError);
                    expect(err.message).to.be.equal("steeplejack.addModule can only accept a string[]");

                } finally {

                    expect(fail).to.be.true;

                    expect(this.glob.sync).to.not.be.called;

                }

            });

            it("should throw an error if a non-string is passed in", function () {

                var fail = false;

                try {

                    this.obj.addModule({});

                } catch (err) {

                    fail = true;

                    expect(err).to.be.instanceof(TypeError);
                    expect(err.message).to.be.equal("steeplejack.addModule can only accept a string[]");

                } finally {

                    expect(fail).to.be.true;

                    expect(this.glob.sync).to.not.be.called;

                }

            });

        });

        describe("#getInjector", function () {

            it("should return the injector instance", function () {

                var obj = new Main();

                expect(obj.getInjector()).to.be.equal(obj._injector);

            });

        });

        describe("module registration", function () {

            beforeEach(function () {

                this.obj = new Main({
                    config: "value"
                });

                this.getInjector = sinon.stub(this.obj, "getInjector");

                this.register = sinon.spy();
                this.registerSingleton = sinon.spy();

                this.getInjector.returns({
                    register: this.register,
                    registerSingleton: this.registerSingleton
                });

            });

            describe("#registerConfig", function () {

                it("should call the config function with the config object", function () {

                    var fn = sinon.stub()
                        .returns({
                            hello: "world"
                        });

                    var module = {
                        __config: fn
                    };

                    expect(this.obj.registerConfig(module)).to.be.equal(this.obj);

                    expect(fn).to.be.calledOnce
                        .calledWithExactly({
                            config: "value"
                        });

                    expect(this.registerSingleton).to.be.calledOnce
                        .calledWithExactly("proxy", {
                            hello: "world"
                        });


                });

                it("should throw an error if a non-function is used", function () {

                    var fail = false;

                    try {
                        this.obj.registerConfig({
                            __config: {}
                        });
                    } catch (err) {
                        fail = true;

                        expect(err).to.be.instanceof(TypeError);
                        expect(err.message).to.be.equal("steeplejack.registerConfig can only accept functions");
                    } finally {
                        expect(fail).to.be.true;
                    }

                });

                it("should throw an error if an anonymous function used", function () {

                    var fail = false;

                    try {
                        this.obj.registerConfig({
                            __config: function () {}
                        });
                    } catch (err) {
                        fail = true;

                        expect(err).to.be.instanceof(SyntaxError);
                        expect(err.message).to.be.equal("steeplejack.registerConfig function cannot be anonymous");
                    } finally {
                        expect(fail).to.be.true;
                    }

                });

            });

            describe("#registerConstant", function () {

                it("should throw an error if __constant not registered", function () {

                    var fail = false;

                    try {
                        this.obj.registerConstant("erm");
                    } catch (err) {
                        fail = true;

                        expect(err).to.be.instanceof(SyntaxError);
                        expect(err.message).to.be.equal("Invalid module formatting");
                    } finally {
                        expect(fail).to.be.true;
                    }

                });

                it("should load the constant to the registerSingleton method", function () {

                    var module = {
                        __constant: {
                            constantName: "value"
                        }
                    };

                    expect(this.obj.registerConstant(module)).to.be.equal(this.obj);

                    expect(this.getInjector).to.be.calledOnce
                        .calledWithExactly();

                    expect(this.registerSingleton).to.be.calledOnce
                        .calledWithExactly("constantName", "value");

                });

            });

            describe("#registerFactory", function () {

                it("should register a function to the factory", function () {

                    var fn = function factoryName () {};

                    var module = {
                        __factory: fn
                    };

                    expect(this.obj.registerFactory(module)).to.be.equal(this.obj);

                    expect(this.getInjector).to.be.calledOnce
                        .calledWithExactly();

                    expect(this.register).to.be.calledOnce
                        .calledWithExactly("factoryName", fn);

                });

                it("should throw an error if anonymous function used", function () {

                    var fn = function () {};

                    var module = {
                        __factory: fn
                    };

                    var fail = false;

                    try {
                        this.obj.registerFactory(module);
                    } catch (err) {
                        fail = true;

                        expect(err).to.be.instanceof(SyntaxError);
                        expect(err.message).to.be.equal("steeplejack.registerFactory function cannot be anonymous");
                    } finally {
                        expect(fail).to.be.true;
                    }

                });

            });

            describe("#registerSingleton", function () {

                it("should throw an error if a function passed in", function () {

                    var module = {
                        __singleton: {
                            moduleName: function () {}
                        }
                    };

                    var fail = false;

                    try {
                        this.obj.registerSingleton(module);
                    } catch (err) {
                        fail = true;

                        expect(err).to.be.instanceof(TypeError);
                        expect(err.message).to.be.equal("steeplejack.registerSingleton cannot accept a function");
                    } finally {
                        expect(fail).to.be.true;
                    }

                });

                it("should register an instance", function () {

                    var obj = {
                        hello: "world"
                    };

                    var module = {
                        __singleton: {
                            moduleName: obj
                        }
                    };

                    expect(this.obj.registerSingleton(module)).to.be.equal(this.obj);

                    expect(this.getInjector).to.be.calledOnce
                        .calledWithExactly();

                    expect(this.registerSingleton).to.be.calledOnce
                        .calledWithExactly("moduleName", obj);

                })

            });

        });

        describe("#run", function () {

        });

        describe("#setRoutes", function () {

        });

    });

    describe("Static methods", function () {

        describe("#app", function () {

            beforeEach(function () {

                proxyquire.noCallThru();

                this.optimist = {
                    argv: {
                        _: []
                    }
                };

                this.router = {
                    discoverRoutes: sinon.stub()
                };

                this.Main = proxyquire("../../../", {
                    optimist: this.optimist,
                    "./library/Router": this.router
                });

            });

            it("should load up the app with no extras", function () {

                this.optimist.argv._ = [];

                var app = this.Main.app();

                expect(app).to.be.instanceof(this.Main);

                expect(app._config).to.be.eql({});
                expect(app._modules).to.be.eql([]);
                expect(app._routes).to.be.eql({});

            });

            it("should load in the config", function () {

                this.optimist.argv._ = [];

                var app = this.Main.app({
                    config: {
                        val1: true,
                        val2: "hello"
                    }
                });

                expect(app).to.be.instanceof(this.Main);

                expect(app._config).to.be.eql({
                    val1: true,
                    val2: "hello"
                });
                expect(app._modules).to.be.eql([]);
                expect(app._routes).to.be.eql({});

            });

            it("should merge in environment variables to the config", function () {

                this.optimist.argv._ = [];

                var stub = sinon.sandbox.create().stub(process.env);

                stub.VAL_1_ENVVAR = "false";
                stub.VAL_2_ENVVAR = "goodbye";

                var app = this.Main.app({
                    config: {
                        val1: true,
                        val2: "hello"
                    },
                    env: {
                        val1: "VAL_1_ENVVAR",
                        val2: "VAL_2_ENVVAR"
                    }
                });

                expect(app).to.be.instanceof(this.Main);

                expect(app._config).to.be.eql({
                    val1: false,
                    val2: "goodbye"
                });
                expect(app._modules).to.be.eql([]);
                expect(app._routes).to.be.eql({});

            });

            it("should merge in environment variables and command line arguments to the config", function () {

                this.optimist.argv._ = [
                    "val2=erm?"
                ];

                var stub = sinon.sandbox.create().stub(process.env);

                stub.VAL_1_ENVVAR = "false";
                stub.VAL_2_ENVVAR = "goodbye";

                var app = this.Main.app({
                    config: {
                        val1: true,
                        val2: "hello"
                    },
                    env: {
                        val1: "VAL_1_ENVVAR",
                        val2: "VAL_2_ENVVAR"
                    }
                });

                expect(app).to.be.instanceof(this.Main);

                expect(app._config).to.be.eql({
                    val1: false,
                    val2: "erm?"
                });
                expect(app._modules).to.be.eql([]);
                expect(app._routes).to.be.eql({});

            });

            it("should pass in modules", function () {

                var spy = sinon.spy(this.Main.prototype, "addModule");

                var app = this.Main.app({
                    modules: [
                        "module1",
                        "module2",
                        "module3"
                    ]
                });

                expect(app).to.be.instanceof(this.Main);

                expect(app._config).to.be.eql({});
                expect(app._routes).to.be.eql({});

                expect(spy).to.be.called
                    .calledWith([
                        "module1",
                        "module2",
                        "module3"
                    ]);

            });

            it("should pass in the routes", function () {

                var spy = sinon.spy(this.Main.prototype, "setRoutes");

                this.router.discoverRoutes.returns("routes");

                var app = this.Main.app({
                    routeDir: "route/dir"
                });

                expect(app).to.be.instanceof(this.Main);

                expect(app._config).to.be.eql({});
                expect(app._modules).to.be.eql([]);

                expect(spy).to.be.calledOnce
                    .calledWith("routes");

                expect(this.router.discoverRoutes).to.be.calledOnce
                    .calledWith(path.join(process.cwd(), "route/dir"));

            });

        });

        describe("#Base", function () {

            it("should be the same as the Base object", function (done) {

                expect(Main.Base).to.be.equal(Base);

                done();

            });

        });

        describe("#Collection", function () {

            it("should be the same as the Collection object", function (done) {

                expect(Main.Collection).to.be.equal(require("../../../src/library/Collection"));

                done();

            });

        });

        describe("#Exceptions", function () {

            it("should present an object of exceptions", function (done) {

                var Exceptions = Main.Exceptions;

                expect(Exceptions.Exception).to.be.equal(require("../../../src/error/Exception"));
                expect(Exceptions.Fatal).to.be.equal(require("../../../src/error/Fatal"));
                expect(Exceptions.Validation).to.be.equal(require("../../../src/error/Validation"));

                done();

            });

        });

        describe("#Injector", function () {

            it("should present the Injector object", function () {

                expect(Main.Injector).to.be.equal(require("../../../src/library/Injector"));

            });

        });

        describe("#Model", function () {

            it("should be the same as the DomainModel object", function (done) {

                expect(Main.Model).to.be.equal(require("../../../src/library/DomainModel"));

                done();

            });

        });

        describe("#Router", function () {

            it("should be the same as the Router", function () {
                expect(Main.Router).to.be.equal(require("../../../src/library/Router"));
            });

        });

    });

});
