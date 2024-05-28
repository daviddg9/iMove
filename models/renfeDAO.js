var express = require('express');

class RenfeDAO {
    // Attributes
    dato1 = "";
    dato2 = "hola";
    dato3 = 42;
    title = "¿Dónde quieres viajar?";
    lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur";

    // Constructor
    constructor(dato1) {
        this.dato1 = dato1;
    }

    // Getters and Setters
    get dato2() {
        this.dato2 = this.dato2 + " modificado";
        return this.dato2;
    }

    set dato2(val) {
        this.dato2 = val;
    }

    // Methods
    saludar() {
        return "Hola";
    }
}

module.exports = RenfeDAO;