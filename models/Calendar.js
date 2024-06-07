var express = require('express');

class Calendar {
    // Attributes
    SERVICE_ID = "";
    MONDAY = "";
    TUESDAY = "";
    WEDNESDAY = "";
    THURSDAY = "";
    FRIDAY = "";
    SATURDAY = "";
    SUNDAY = "";
    START_DATE = "";
    END_DATE = "";

    // Constructor
    constructor(SERVICE_ID, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY, START_DATE, END_DATE) {
        this.SERVICE_ID = SERVICE_ID;
        this.MONDAY = MONDAY;
        this.TUESDAY = TUESDAY;
        this.WEDNESDAY = WEDNESDAY;
        this.THURSDAY = THURSDAY;
        this.FRIDAY = FRIDAY;
        this.SATURDAY = SATURDAY;
        this.SUNDAY = SUNDAY;
        this.START_DATE = START_DATE;
        this.END_DATE = END_DATE;
    }

    static fromInstance(inst) {
        if (!inst)
            return null;
        let calendar = new Calendar("", "", "", "", "", "", "", "", "", "");
        Object.assign(calendar, inst);
        return calendar;
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
        return "(" + this.SERVICE_ID + ", " + this.MONDAY + ", " + this.TUESDAY + ", " + this.WEDNESDAY + ", " + this.THURSDAY + ", " + this.FRIDAY + ", " + this.SATURDAY + ", " + this.SUNDAY + ", " + this.START_DATE + ", " + this.END_DATE + ")";
    }
}

module.exports = Calendar;
