var express = require('express');

class Frequency {
    // Attributes
    TRIP_ID = "";
    START_TIME = "";
    END_TIME = "";
    HEADWAY_SECS = "";

    // Constructor
    
    constructor(TRIP_ID, START_TIME, END_TIME, HEADWAY_SECS) {
        this.TRIP_ID = TRIP_ID;
        this.START_TIME = START_TIME;
        this.END_TIME = END_TIME;
        this.HEADWAY_SECS = HEADWAY_SECS;
    }

    static fromInstance(inst) {
        if (!inst)
            return null;
        let route = new Frequency("", "", "", "", "", "");
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
        return "(" + this.TRIP_ID + ", " + this.START_TIME + ", " + this.END_TIME + ", " + this.HEADWAY_SECS + ")";
    }
}

module.exports = Frequency;
