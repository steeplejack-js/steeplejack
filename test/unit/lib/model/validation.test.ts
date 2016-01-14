/**
 * validation.test
 */


"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {expect, sinon} from "../../../helpers/configure";
import {Model} from "../../../../lib/model/index";
import {Validation} from "../../../../lib/model/validation";


describe("Model validation test", function () {

    describe("Static methods", function () {

        describe("#createClosure", function () {

            it("should return true when it's not required and is the default value", function () {

                class Child extends Model {
                    public static schema: any = {
                        name: {
                            type: "string"
                        }
                    }
                }

                let fn: Function = Validation.createClosure(function () {}, null, null, false);

                let obj = new Child();

                expect(fn(obj, null)).to.be.true;

            });

            it("should return a function with default arguments set", function () {

                class Child extends Model {
                    public static schema: any = {
                        name: {
                            type: "string"
                        }
                    }
                }

                let obj = new Child({
                    name: "set value"
                });

                let validationFn = function (...args: any[]) {

                    expect(args).to.have.length(2);

                    expect(args[0]).to.be.equal(obj);
                    expect(args[1]).to.be.equal("desired value");

                    return "result";

                };

                let fn: Function = Validation.createClosure(validationFn, null, null, false);

                expect(fn(obj, "desired value")).to.be.equal("result");

            });

            it("should run with some params", function () {

                class Child extends Model {
                    public static schema: any = {
                        name: {
                            type: "string"
                        }
                    }
                }

                let obj = new Child({
                    name: "set value"
                });

                let params: any[] = [
                    1, 2, 3
                ];

                let validationFn = function (...args: any[]) {

                    expect(args).to.have.length(5);

                    expect(args[0]).to.be.equal(obj);
                    expect(args[1]).to.be.equal("myValue");
                    expect(args[2]).to.be.equal(1);
                    expect(args[3]).to.be.equal(2);
                    expect(args[4]).to.be.equal(3);

                    return "result";

                };

                let fn: Function = Validation.createClosure(validationFn, params, null, false);

                expect(fn(obj, "myValue")).to.be.equal("result");

            });

        });

        describe("#generateFunction", function () {

            describe("stubbed createClosure", function () {

                let stub:any;
                beforeEach(function () {
                    stub = sinon.stub(Validation, "createClosure");
                });

                afterEach(function () {
                    stub.restore();
                });

                it("should return null if no rule object", function () {

                    expect(Validation.generateFunction(null)).to.be.null;

                    expect(stub).to.not.be.called;

                });

                it("should throw an error if the rule is not a function or a string", function () {

                    [
                        {},
                        [],
                        null,
                        true,
                        2
                    ].forEach(rule => {

                        let fail = false;

                        try {
                            Validation.generateFunction({
                                rule
                            });
                        } catch (err) {

                            fail = true;

                            expect(err).to.be.instanceof(TypeError);
                            expect(err.message).to.be.equal(`IDefinitionValidation.rule must be a function or a string, not a ${typeof rule}`);

                        } finally {
                            expect(fail).to.be.true;

                            expect(stub).to.not.be.called;
                        }

                    });

                });

                it("should accept a function as a rule and create the closure", function () {

                    let closure = function () {
                    };
                    let rule = function () {
                    };
                    let param = ["param1", "param2"];
                    let defaultValue:any = null;

                    stub.returns(closure);

                    let fn = Validation.generateFunction({
                        rule,
                        param
                    }, defaultValue);

                    expect(fn).to.be.equal(closure);

                    expect(stub).to.be.calledOnce
                        .calledWithExactly(rule, param, defaultValue, false);

                });

                it("should return the Validation.match method for a match rule", function () {

                    let closure = function () {
                    };
                    let param = ["param1", "param2"];
                    let defaultValue:any = null;

                    stub.returns(closure);

                    let fn = Validation.generateFunction({
                        rule: "match",
                        param
                    }, defaultValue);

                    expect(fn).to.be.equal(closure);

                    expect(stub).to.be.calledOnce
                        .calledWithExactly(Validation.match, param, defaultValue, false);

                });

                it("should throw an error if an unknown validation method sent", function () {

                    let fail = false;

                    try {
                        Validation.generateFunction({
                            rule: "missing"
                        });
                    } catch (err) {
                        fail = true;

                        expect(err).to.be.instanceof(SyntaxError);
                        expect(err.message).to.be.equal("'missing' is not a validation function");
                    } finally {
                        expect(fail).to.be.true;

                        expect(stub).to.not.be.called;

                    }

                });

            });

            describe("unstubbed createdClosure", function () {

                it("should use the datautils.validation method if a string rule given", function () {

                    let rule = "email";
                    let param:any[] = null;
                    let defaultValue:any = null;

                    let fn = Validation.generateFunction({
                        rule,
                        param
                    }, defaultValue);

                    expect(fn).to.be.a("function");

                    class Child extends Model {
                        public static schema: any = {
                            email: {
                                type: "string"
                            }
                        };
                    }

                    let model = new Child({
                        email: "test@test.com"
                    });

                    expect(fn(model, model.get("email"))).to.be.true;

                });

            });

        });

        describe("#match", function () {

            it("should return true when value matches the model value", function () {

                class Child extends Model {
                    public static schema: any = {
                        id: {
                            type: "string"
                        }
                    }
                }

                let obj = new Child({
                    id: "hello"
                });

                expect(Validation.match(obj, "hello", "id")).to.be.true;

            });

            it("should throw an error when the values don't match", function () {

                class Child extends Model {
                    public static schema: any = {
                        hello: {
                            type: "string"
                        }
                    }
                }

                let obj = new Child({
                    hello: "world"
                });

                let fail = false;

                try {
                    Validation.match(obj, "mister", "hello")
                } catch (err) {

                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal(`Value 'hello' does not match`);
                    expect(err.key).to.be.equal("hello");
                    expect(err.value).to.be.equal("mister");
                    expect(err.params).to.be.eql([
                        "world"
                    ]);

                } finally {
                    expect(fail).to.be.true;
                }

            });

        });

    });

});