var express = require('express');
const mysql = require('mysql2/promise');
const Stop = require('./Stop');

class DAO {
    // Attributes
    connectionData = {
        host: "",
        user: "",
        password: "",
        database: ""
    }
    connection = null

    // Constructor
    constructor(host, user, password, database) {
        this.connectionData = {
            host: host,
            user: user,
            password: password,
            database: database
        }
    }

    // Methods
    async connect() {
        this.connection = await mysql.createConnection(this.connectionData);
    }

    async getAllStops(where="") {
        if (this.connection == null)
            await this.connect()
        let listaStops = []
        let sql = "SELECT * FROM STOPS";
        if (where.length > 0)
            sql += " WHERE " + where;
        sql += ";";
        // TODO: Checkear errores
        console.log("QUERY " + sql);
        const [results] = await this.connection.execute(sql);
        results.forEach(dbStop => {
            listaStops.push(Stop.fromInstance(dbStop));
        });
        return listaStops;
    }
}

module.exports = DAO;