var express = require('express');
const mysql = require('mysql2');
const Stop = require('./Stop');

class DAO {
    // Attributes
    connectionData = {
        host: "localhost",
        user: "root",
        password: "Starcraft2",
        database: "IMOVE"
    }

    connection = null

    // Constructor
    constructor() {
        this.connection = mysql.createConnection(this.connectionData);
        this.connection.connect();
        // TODO: Comprobar que se ha conectado bien.
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
    getAllStops() {
        // TODO: Comprobar conexion
        let listaStops = []
        this.connection.query("SELECT * FROM STOPS;", (err, rows, fields) => {
            if (err) throw err;
            rows.forEach(dbStop => {
                listaStops.push(new Stop(dbStop));
            });
        });
        return listaStops;
    }
}

module.exports = DAO;