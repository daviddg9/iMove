var express = require('express');

class StopTime {
    // Attributes
	TRIP_ID = "";
    STOP_ID = "";
    ARRIVAL_TIME = "";
    DEPARTURE_TIME = "";
    STOP_SEQUENCE = "";
  
    // Constructor
    
    constructor(TRIP_ID, STOP_ID, ARRIVAL_TIME, DEPARTURE_TIME, STOP_SEQUENCE) {
        this.TRIP_ID = TRIP_ID;
        this.STOP_ID = STOP_ID;
        this.ARRIVAL_TIME = ARRIVAL_TIME;
        this.DEPARTURE_TIME = DEPARTURE_TIME;
        this.STOP_SEQUENCE = STOP_SEQUENCE;
    }

    static fromInstance(inst) {
        if (!inst)
            return null;
        let stopTime = new StopTime("", "", "", "", "");
        Object.assign(stopTime, inst);
        return stopTime;
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
        return "(" + this.TRIP_ID + ", " + this.STOP_ID + ", " + this.ARRIVAL_TIME + ", " + this.DEPARTURE_TIME + ", " + this.STOP_SEQUENCE + ")";
    }
}

module.exports = StopTime;
