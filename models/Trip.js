var express = require('express');

class Trip {
    // Attributes
    TRIP_ID = "";
    ROUTE_ID = "";
    SERVICE_ID = "";

    // Constructor
    
    constructor(TRIP_ID, ROUTE_ID, SERVICE_ID) {
        this.TRIP_ID = TRIP_ID;
        this.ROUTE_ID = ROUTE_ID;
        this.SERVICE_ID = SERVICE_ID;
    }

    static fromInstance(inst) {
        if (!inst)
            return null;
        let trip = new Trip("", "", "");
        Object.assign(trip, inst);
        return trip;
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
        return "(" + this.TRIP_ID + ", " + this.ROUTE_ID + ", " + this.SERVICE_ID + ")";
    }
}

module.exports = Trip;
