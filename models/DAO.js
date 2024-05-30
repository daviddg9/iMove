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

    async getStops(where="") {
        if (this.connection == null)
            await this.connect()
        let listaStops = []
        let sql = "SELECT * FROM STOPS";
        if (where.length > 0)
            sql += " WHERE " + where;
        sql += ";";
        console.log("QUERY " + sql);
        // TODO: Checkear errores
        const [results] = await this.connection.execute(sql);
        results.forEach(dbStop => {
            listaStops.push(Stop.fromInstance(dbStop));
        });
        return listaStops;
    }

    async getRoutes(where="") {
        if (this.connection == null)
            await this.connect()
        let listaRoutes = []
        let sql = "SELECT * FROM ROUTES";
        if (where.length > 0)
            sql += " WHERE " + where;
        sql += ";";
        console.log("QUERY " + sql);
        // TODO: Checkear errores
        const [results] = await this.connection.execute(sql);
        results.forEach(dbRoute => {
            listaRoutes.push(Route.fromInstance(dbRoute));
        });
        return listaRoutes;
    }
}

module.exports = DAO;