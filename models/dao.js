var express = require('express');

class DAO {
    // Attributes
    dato1 = "";
    dato2 = "hola";
    dato3 = 42;

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

DAO.dato2;

module.exports = DAO;