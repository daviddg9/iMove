var express = require('express');

class StopCard {
    // Attributes
    STOP_ID = ""
    STOP_NAME = ""
    STOP_LAT = ""
    STOP_LON = ""
    ROUTE_LIST = []

    // Constructor
    
    constructor(STOP_ID, STOP_NAME, STOP_LAT, STOP_LON, ROUTE_LIST) {
        this.STOP_ID = STOP_ID;
        this.STOP_NAME = STOP_NAME;
        this.STOP_LAT = STOP_LAT;
        this.STOP_LON = STOP_LON;
        this.ROUTE_LIST = ROUTE_LIST;
    }

    static fromInstance(inst, routeList) {
        if (!inst || !routeList)
            return null;
        let stopCard = new StopCard("", "", "", "", routeList);
        Object.assign(stopCard, inst);
        return stopCard;
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
        return "(" + this.STOP_ID + ", " + this.STOP_NAME + ", " + this.STOP_LAT + ", " + this.STOP_LON + ", " + this.ROUTE_LIST + ")";
    }

    toCard() {

    }

    addRouteToList(route) {
        this.ROUTE_LIST.push(route)
    }
}

module.exports = StopCard;
