var express = require('express');

class Stop {
    // Attributes
    STOP_ID = "";
    STOP_NAME = "";
    STOP_LAT = "";
    STOP_LON = "";

    // Constructor
    
    constructor(STOP_ID, STOP_NAME, STOP_LAT, STOP_LON) {
        this.STOP_ID = STOP_ID;
        this.STOP_NAME = STOP_NAME;
        this.STOP_LAT = STOP_LAT;
        this.STOP_LON = STOP_LON;
    }

    static fromInstance(inst) {
        if (!inst)
            return null;
        let stop = new Stop("", "", "", "");
        Object.assign(stop, inst);
        return stop;
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
        return "(" + this.STOP_ID + ", " + this.STOP_NAME + ", " + this.STOP_LAT + ", " + this.STOP_LON + ")";
    }
}

module.exports = Stop;
