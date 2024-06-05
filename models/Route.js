var express = require('express');

class Route {
    // Attributes
    ROUTE_ID = "";
    ROUTE_SHORT_NAME = "";
    ROUTE_LONG_NAME = "";
    ROUTE_TYPE = "";
    ROUTE_COLOR = "";
    ROUTE_TEXT_COLOR = "";
    RENFE_STOP_TIMES = []

    // Constructor
    
    constructor(ROUTE_ID, ROUTE_SHORT_NAME, ROUTE_LONG_NAME, ROUTE_TYPE, ROUTE_COLOR, ROUTE_TEXT_COLOR) {
        this.ROUTE_ID = ROUTE_ID;
        this.ROUTE_SHORT_NAME = ROUTE_SHORT_NAME;
        this.ROUTE_LONG_NAME = ROUTE_LONG_NAME;
        this.ROUTE_TYPE = ROUTE_TYPE;
        this.ROUTE_COLOR = ROUTE_COLOR;
        this.ROUTE_TEXT_COLOR = ROUTE_TEXT_COLOR;
    }

    static fromInstance(inst) {
        if (!inst)
            return null;
        let route = new Route("", "", "", "", "", "");
        Object.assign(route, inst);
        return route;
    }

    // Getters and Setters
    // get dato2() {
    //     this.dato2 = this.dato2 + " modificado";
    //     return this.dato2;
    // }

    // set dato2(val) {
    //     this.dato2 = val;
    // }

    // Methods
    toString() {
        return "(" + this.ROUTE_ID + ", " + this.ROUTE_SHORT_NAME + ", " + this.ROUTE_LONG_NAME + ", " + this.ROUTE_TYPE + ", " + this.ROUTE_COLOR + ", " + this.ROUTE_TEXT_COLOR + ")";
    }
}

module.exports = Route;
