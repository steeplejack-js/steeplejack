/**
 * index
 */

/// <reference path="../../typings/tsd.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */
import * as _ from "lodash";


/* Files */
import {Detail} from "./Detail";
import {Exception} from "../index";


/**
 * Validation
 *
 * This is an error that can be recovered from.  Normally, this
 * would be invalid input from the client or similar.  Ultimately,
 * this would return something like an HTTP 400 error.
 */
export class ValidationException extends Exception {


    public errors: {
        [key:string]: Detail[];
    } = {};


    public get type () {
        return "VALIDATION";
    }


    public addError (key: string, value: any, message: string, additional: any = void 0) : ValidationException {

        /* If key not set, throw error */
        if (_.isEmpty(key)) {
            throw new SyntaxError("KEY_MUST_BE_SET");
        }

        /* Create the error detail object */
        let err = Detail.toModel(value, message, additional);

        /* Validate the error and tell the developer if done incorrectly */
        err.validate();

        /* Ensure that we have an array to store our latest error */
        if (_.has(this.errors, key) === false) {
            this.errors[key] = [];
        }

        /* Add in the new error */
        this.errors[key].push(err);

        return this;

    }


    /**
     * Get Errors
     *
     * Gets the errors contained in this object. Convert
     * the Detail classes to object literals.
     *
     * @returns {TResult}
     */
    public getErrors () : any {

        return _.reduce(this.errors, (result, errors, key) => {

            let element: IValidationExceptionDetail[] = [];

            _.each(errors, err => {
                element.push(err.toDTO());
            });

            (<any>result)[key] = element;

            return result;

        }, {});

    }


    /**
     * Has Errors
     *
     * Do we have any errors?
     *
     * @returns {boolean}
     */
    public hasErrors () : boolean {
        return _.isEmpty(this.errors) === false;
    }


}