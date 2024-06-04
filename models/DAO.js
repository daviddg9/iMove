var express = require('express');
const mysql = require('mysql2/promise');
const Stop = require('./Stop');
const Route = require('./Route');
const StopTime = require('./StopTime');
const Trip = require('./Trip');

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

    async execQueryToObjectList(query, object) {
        if (query == "" || object == null) {
            console.log("Parámetros inválidos (query: " + query + ") (object: " + object +") (execQueryToObjectList)");
            return [];
        }
        if (this.connection == null)
            await this.connect();
        let listaObjetos = [];
        console.log("Q\t" + query);
        const [results] = await this.connection.execute(query);
        results.forEach(dbRow => {
            listaObjetos.push(object.fromInstance(dbRow));
        });
        return listaObjetos;
    }

    async getStops(where="") {
        if (this.connection == null)
            await this.connect()
        let sql = "SELECT * FROM STOPS";
        if (where.length > 0)
            sql += " WHERE " + where;
        sql += ";";
        
        let listaStops = await this.execQueryToObjectList(sql, Stop);
        //TODO: Checkear errores
        return listaStops;
    }

    async getRoutes(where="") {
        if (this.connection == null)
            await this.connect()
        let sql = "SELECT * FROM ROUTES";
        if (where.length > 0)
            sql += " WHERE " + where;
        sql += ";";
        
        let listaRoutes = await this.execQueryToObjectList(sql, Route);
        //TODO: Checkear errores
        return listaRoutes;
    }

    async getStopsByRouteId(routeId) {
        if (routeId == "") {
            console.log("El ROUTE_ID no puede estar vacío. (getStopsByRouteId)");
            return [];
        }
        if (this.connection == null)
            await this.connect()
        let sql = "SELECT * FROM STOPS " + 
        "WHERE STOPS.STOP_ID IN ( " + 
            "SELECT STOP_ID FROM STOP_ROUTES WHERE ROUTE_ID = '" + routeId + "' " + 
        ");";
        let listaStops = await this.execQueryToObjectList(sql, Stop);
        //TODO: Checkear errores
        return listaStops;
    }

    async getRoutesByStopId(stopId) {
        if (stopId == "") {
            console.log("El STOP_ID no puede estar vacío. (getRoutesByStopId)");
            return [];
        }
        if (this.connection == null)
            await this.connect()
        let sql = "SELECT * FROM ROUTES " + 
        "WHERE ROUTES.ROUTE_ID IN ( " + 
            "SELECT ROUTE_ID FROM STOP_ROUTES WHERE STOP_ID = '" + stopId + "'" + 
        ");";
        let listaRoutes = await this.execQueryToObjectList(sql, Route);
        //TODO: Checkear errores
        return listaRoutes;
    }

    async getRoutesSingleByStopId(stopId) {
        if (stopId == "") {
            console.log("El STOP_ID no puede estar vacío. (getRoutesByStopId)");
            return [];
        }
        if (this.connection == null)
            await this.connect()
        let sql = "SELECT * FROM ROUTES " + 
        "WHERE ROUTES.ROUTE_ID IN ( " + 
            "SELECT ROUTE_ID FROM STOP_ROUTES WHERE STOP_ID = '" + stopId + "'" + 
        ");";
        let listaRoutes = await this.execQueryToObjectList(sql, Route);
        //TODO: Checkear errores

        for (let i = listaRoutes.length - 1; i > 0; i--) {
            const route_og = listaRoutes[i];
            let del = false;
            for (let j = i - 1; j >= 0; j--) {
                const route_compare = listaRoutes[j];
                if (route_og.ROUTE_SHORT_NAME == route_compare.ROUTE_SHORT_NAME) {
                    del = true;
                    break;
                }
            }
            if (del)
                listaRoutes.splice(i, 1);
        }

        return listaRoutes;
    }

    async getFutureStopTimesByStopId(stopId, timeNow, timeEnd) {
        if (stopId == "") {
            console.log("El STOP_ID no puede estar vacío. (getFutureStopTimesByStopId)");
            return [];
        }
        if (timeNow == "") {
            console.log("El timeNow no puede estar vacío. (getFutureStopTimesByStopId)");
            return [];
        }
        if (timeEnd == "") {
            console.log("El timeEnd no puede estar vacío. (getFutureStopTimesByStopId)");
            return [];
        }
        if (this.connection == null)
            await this.connect()
        let sql = "SELECT TRIP_ID, STOP_ID, ARRIVAL_TIME, DEPARTURE_TIME, STOP_SEQUENCE FROM STOP_TIMES " + 
        "WHERE STOP_ID = '" + stopId + "' AND DEPARTURE_TIME >= TIME('" + timeNow + "') AND ARRIVAL_TIME <= TIME('" + timeEnd + "') " +
        "ORDER BY DEPARTURE_TIME";
        let listaStopTimes = await this.execQueryToObjectList(sql, StopTime);
        //TODO: Checkear errores

        // for (let i = 0; i < listaStopTimes.length; i++) {
        //     const stopTime = listaStopTimes[i];
        //     let del = false;
        //     for (let j = i + 1; j < listaStopTimes.length; j++) {
        //         const stopTime2 = listaStopTimes[j];
        //         if (stopTime.TRIP_ID == stopTime2.TRIP_ID &&
        //             (
        //                 stopTime.DEPARTURE_TIME == stopTime2.DEPARTURE_TIME ||
        //                 stopTime.ARRIVAL_TIME == stopTime2.ARRIVAL_TIME
        //             )) {
        //             del = true;
        //             break;
        //         }
        //     }
        //     if (del) {
        //         listaStopTimes.splice(j, 1);
        //         i = i - 1;
        //         continue;
        //     }
        // }

        return listaStopTimes;
    }

    async getTripsByRouteId(routeId) {
        if (routeId == "") {
            console.log("El routeId no puede estar vacío. (getTripsByRouteId)");
            return [];
        }
        if (this.connection == null)
            await this.connect()
        let sql = "SELECT * FROM TRIPS " + 
        "WHERE ROUTE_ID = '" + routeId + "'"; 
        let listaRoutes = await this.execQueryToObjectList(sql, Trip);
        //TODO: Checkear errores
        return listaRoutes;
    }
}

module.exports = DAO;