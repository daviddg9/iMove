var express = require('express');
const mysql = require('mysql2/promise');
const Stop = require('./Stop');
const Route = require('./Route');
const StopTime = require('./StopTime');
const Trip = require('./Trip');
const Calendar = require('./Calendar');
const Frequency = require('./Frequency');
const DEBUG = false;


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
        if (DEBUG)
            console.log("Q\t" + query);
        const [results] = await this.connection.execute(query);
        results.forEach(dbRow => {
            listaObjetos.push(object.fromInstance(dbRow));
        });
        return listaObjetos;
    }

    ///////////////////////////////////////////////////////////////////////////
    //                                 RENFE                                 //
    ///////////////////////////////////////////////////////////////////////////

    async getRenfeStops(where="") {
        if (this.connection == null)
            await this.connect()
        let sql = "SELECT * FROM RENFE_STOPS";
        if (where.length > 0)
            sql += " WHERE " + where;
        sql += " ORDER BY STOP_NAME ASC;";
        
        let listaStops = await this.execQueryToObjectList(sql, Stop);
        //TODO: Checkear errores
        return listaStops;
    }

    async getRenfeRoutes(where="") {
        if (this.connection == null)
            await this.connect()
        let sql = "SELECT * FROM RENFE_ROUTES";
        if (where.length > 0)
            sql += " WHERE " + where;
        sql += ";";
        
        let listaRoutes = await this.execQueryToObjectList(sql, Route);
        //TODO: Checkear errores
        return listaRoutes;
    }

    async getRenfeStopsByRouteId(routeId) {
        if (routeId == "") {
            console.log("El ROUTE_ID no puede estar vacío. (getRenfeStopsByRouteId)");
            return [];
        }
        if (this.connection == null)
            await this.connect()
        let sql = "SELECT * FROM RENFE_STOPS " + 
        "WHERE RENFE_STOPS.STOP_ID IN ( " + 
            "SELECT STOP_ID FROM RENFE_STOP_ROUTES WHERE ROUTE_ID = '" + routeId + "' " + 
        ");";
        let listaStops = await this.execQueryToObjectList(sql, Stop);
        //TODO: Checkear errores
        return listaStops;
    }

    async getRenfeRoutesByStopId(stopId) {
        if (stopId == "") {
            console.log("El STOP_ID no puede estar vacío. (getRenfeRoutesByStopId)");
            return [];
        }
        if (this.connection == null)
            await this.connect()
        let sql = "SELECT * FROM RENFE_ROUTES " + 
        "WHERE RENFE_ROUTES.ROUTE_ID IN ( " + 
            "SELECT ROUTE_ID FROM RENFE_STOP_ROUTES WHERE STOP_ID = '" + stopId + "'" + 
        ");";
        let listaRoutes = await this.execQueryToObjectList(sql, Route);
        //TODO: Checkear errores
        return listaRoutes;
    }

    async getRenfeRoutesSingleByStopId(stopId) {
        if (stopId == "") {
            console.log("El STOP_ID no puede estar vacío. (getRenfeRoutesSingleByStopId)");
            return [];
        }
        if (this.connection == null)
            await this.connect()
        let sql = "SELECT * FROM RENFE_ROUTES " + 
        "WHERE RENFE_ROUTES.ROUTE_ID IN ( " + 
            "SELECT ROUTE_ID FROM RENFE_STOP_ROUTES WHERE STOP_ID = '" + stopId + "'" + 
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

    async getRenfeFutureStopTimesByStopId(stopId, timeNow, timeEnd) {
        if (stopId == "") {
            console.log("El STOP_ID no puede estar vacío. (getRenfeFutureStopTimesByStopId)");
            return [];
        }
        if (timeNow == "") {
            console.log("El timeNow no puede estar vacío. (getRenfeFutureStopTimesByStopId)");
            return [];
        }
        if (timeEnd == "") {
            console.log("El timeEnd no puede estar vacío. (getRenfeFutureStopTimesByStopId)");
            return [];
        }
        if (this.connection == null)
            await this.connect()
        let sql = "SELECT TRIP_ID, STOP_ID, ARRIVAL_TIME, DEPARTURE_TIME, STOP_SEQUENCE FROM RENFE_STOP_TIMES " + 
        "WHERE STOP_ID = '" + stopId + "' AND DEPARTURE_TIME >= TIME('" + timeNow + "') AND ARRIVAL_TIME <= TIME('" + timeEnd + "') " +
        "ORDER BY DEPARTURE_TIME";
        let listaStopTimes = await this.execQueryToObjectList(sql, StopTime);
        //TODO: Checkear errores

        return listaStopTimes;
    }

    async getRenfeTripsByRouteId(routeId) {
        if (routeId == "") {
            console.log("El routeId no puede estar vacío. (getRenfeTripsByRouteId)");
            return [];
        }
        if (this.connection == null)
            await this.connect()
        let sql = "SELECT * FROM RENFE_TRIPS " + 
        "WHERE ROUTE_ID = '" + routeId + "'"; 
        let listaRoutes = await this.execQueryToObjectList(sql, Trip);
        //TODO: Checkear errores
        return listaRoutes;
    }

    async getRenfeTripsByRouteIdAndActiveCalendarList(routeId, calendarList) {
        if (routeId == "") {
            console.log("El routeId no puede estar vacío. (getRenfeTripsByRouteIdAndActiveCalendarList)");
            return [];
        }
        if (calendarList.length == 0) {
            return [];
        }
        if (this.connection == null)
            await this.connect()
        let listaTrips = [];
        for (const calendar of calendarList) {
            let sql = "SELECT * FROM RENFE_TRIPS " + 
            "WHERE ROUTE_ID = '" + routeId + "' AND " +
            "SERVICE_ID = '" + calendar.SERVICE_ID + "'"; 
            listaTrips = listaTrips.concat(await this.execQueryToObjectList(sql, Trip));
        }
        //TODO: Checkear errores
        return listaTrips;
    }

    async getRenfeCalendarEntriesByDayAndDate(day_of_week, date_ymd) {
        if (day_of_week == "") {
            console.log("El day_of_week no puede estar vacío. (getRenfeCalendarEntriesByDayAndDate)");
            return [];
        }
        if (date_ymd == "") {
            console.log("El date_ymd no puede estar vacío. (getRenfeCalendarEntriesByDayAndDate)");
            return [];
        }
        if (this.connection == null)
            await this.connect()
        let sql = "SELECT * FROM RENFE_CALENDAR " + 
        "WHERE " + day_of_week + " = '1' AND " +
        "CAST(START_DATE AS SIGNED) <= " + date_ymd + " AND " + 
        "CAST(END_DATE AS SIGNED) >= " + date_ymd; 
        let listaCalendars = await this.execQueryToObjectList(sql, Calendar);
        //TODO: Checkear errores
        return listaCalendars;
    }

    ///////////////////////////////////////////////////////////////////////////
    //                                 METRO                                 //
    ///////////////////////////////////////////////////////////////////////////

    async getMetroStops(where="") {
        if (this.connection == null)
            await this.connect()
        let sql = "SELECT * FROM METRO_STOPS";
        if (where.length > 0)
            sql += " WHERE " + where;
        sql += " ORDER BY STOP_NAME ASC;";
        
        let listaStops = await this.execQueryToObjectList(sql, Stop);
        //TODO: Checkear errores
        return listaStops;
    }

    async getMetroStopsSingle(where="") {
        if (this.connection == null)
            await this.connect()
        let sql = "SELECT * FROM METRO_STOPS";
        if (where.length > 0)
            sql += " WHERE " + where;
        sql += " ORDER BY STOP_NAME ASC;";
        
        let listaStops = await this.execQueryToObjectList(sql, Stop);

        for (let i = 0; i < listaStops.length; i++) {
            const stop = listaStops[i];
            let compId = stop.STOP_ID;

            for (let j = i + 1; j < listaStops.length; j++) {
                const stopComp = listaStops[j];

                let stopNameNorm = stop.STOP_NAME.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                let stopCompNameNorm = stopComp.STOP_NAME.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

                if (stopNameNorm != stopCompNameNorm)
                    break;

                compId += "+" + stopComp.STOP_ID;
                listaStops.splice(j, 1);
                j--;
            }
            listaStops[i].STOP_ID = compId;
        }
        //TODO: Checkear errores
        return listaStops;
    }

    async getMetroRoutes(where="") {
        if (this.connection == null)
            await this.connect()
        let sql = "SELECT * FROM METRO_ROUTES";
        if (where.length > 0)
            sql += " WHERE " + where;
        sql += ";";
        
        let listaRoutes = await this.execQueryToObjectList(sql, Route);
        //TODO: Checkear errores
        return listaRoutes;
    }

    async getMetroStopsByRouteId(routeId) {
        if (routeId == "") {
            console.log("El ROUTE_ID no puede estar vacío. (getMetroStopsByRouteId)");
            return [];
        }
        if (this.connection == null)
            await this.connect()
        let sql = "SELECT * FROM METRO_STOPS " + 
        "WHERE METRO_STOPS.STOP_ID IN ( " + 
            "SELECT STOP_ID FROM METRO_STOP_ROUTES WHERE ROUTE_ID = '" + routeId + "' " + 
        ");";
        let listaStops = await this.execQueryToObjectList(sql, Stop);
        //TODO: Checkear errores
        return listaStops;
    }

    async getMetroRoutesByStopId(stopId) {
        if (stopId == "") {
            console.log("El STOP_ID no puede estar vacío. (getMetroRoutesByStopId)");
            return [];
        }
        if (this.connection == null)
            await this.connect()
        let sql = "SELECT * FROM METRO_ROUTES " + 
        "WHERE METRO_ROUTES.ROUTE_ID IN ( " + 
            "SELECT ROUTE_ID FROM METRO_STOP_ROUTES WHERE STOP_ID = '" + stopId + "'" + 
        ");";
        let listaRoutes = await this.execQueryToObjectList(sql, Route);
        //TODO: Checkear errores
        return listaRoutes;
    }

    async getMetroRoutesSingleByStopName(stopName) {
        if (stopName == "") {
            console.log("El STOP_NAME no puede estar vacío. (getMetroRoutesSingleByStopName)");
            return [];
        }
        if (this.connection == null)
            await this.connect()
        let sql = "SELECT * FROM METRO_ROUTES " + 
        "WHERE METRO_ROUTES.ROUTE_ID IN ( " + 
            "SELECT METRO_STOP_ROUTES.ROUTE_ID FROM METRO_STOP_ROUTES " + 
            "INNER JOIN METRO_STOPS on METRO_STOP_ROUTES.STOP_ID = METRO_STOPS.STOP_ID " +
            "WHERE METRO_STOPS.STOP_NAME = '" + stopName + "'" + 
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

    async getMetroRoutesSingleByStopId(stopId) {
        if (stopId == "") {
            console.log("El STOP_NAME no puede estar vacío. (stopId)");
            return [];
        }
        if (this.connection == null)
            await this.connect()
        let sql = "SELECT * FROM METRO_ROUTES " + 
        "WHERE METRO_ROUTES.ROUTE_ID IN ( " + 
            "SELECT ROUTE_ID FROM METRO_STOP_ROUTES " + 
            "WHERE STOP_ID = '" + stopId + "'" +
        ");";
        let listaRoutes = await this.execQueryToObjectList(sql, Route);
        //TODO: Checkear errores

        // for (let i = listaRoutes.length - 1; i > 0; i--) {
        //     const route_og = listaRoutes[i];
        //     let del = false;
        //     for (let j = i - 1; j >= 0; j--) {
        //         const route_compare = listaRoutes[j];
        //         if (route_og.ROUTE_SHORT_NAME == route_compare.ROUTE_SHORT_NAME) {
        //             del = true;
        //             break;
        //         }
        //     }
        //     if (del)
        //         listaRoutes.splice(i, 1);
        // }

        return listaRoutes;
    }

    async getMetroFutureStopTimesByStopId(stopId, timeNow, timeEnd) {
        if (stopId == "") {
            console.log("El STOP_ID no puede estar vacío. (getMetroFutureStopTimesByStopId)");
            return [];
        }
        if (timeNow == "") {
            console.log("El timeNow no puede estar vacío. (getMetroFutureStopTimesByStopId)");
            return [];
        }
        if (timeEnd == "") {
            console.log("El timeEnd no puede estar vacío. (getMetroFutureStopTimesByStopId)");
            return [];
        }
        if (this.connection == null)
            await this.connect()
        let sql = "SELECT TRIP_ID, STOP_ID, ARRIVAL_TIME, DEPARTURE_TIME, STOP_SEQUENCE FROM METRO_STOP_TIMES " + 
        "WHERE STOP_ID = '" + stopId + "' AND DEPARTURE_TIME >= TIME('" + timeNow + "') AND ARRIVAL_TIME <= TIME('" + timeEnd + "') " +
        "ORDER BY DEPARTURE_TIME";
        let listaStopTimes = await this.execQueryToObjectList(sql, StopTime);
        //TODO: Checkear errores

        return listaStopTimes;
    }

    async getMetroFutureStopTimesByTripId(tripId, timeNow, timeEnd) {
        if (tripId == "") {
            console.log("El STOP_ID no puede estar vacío. (getMetroFutureStopTimesByStopId)");
            return [];
        }
        if (timeNow == "") {
            console.log("El timeNow no puede estar vacío. (getMetroFutureStopTimesByStopId)");
            return [];
        }
        if (timeEnd == "") {
            console.log("El timeEnd no puede estar vacío. (getMetroFutureStopTimesByStopId)");
            return [];
        }
        if (this.connection == null)
            await this.connect()
        let sql = "SELECT TRIP_ID, STOP_ID, ARRIVAL_TIME, DEPARTURE_TIME, STOP_SEQUENCE FROM METRO_STOP_TIMES " + 
        "WHERE TRIP_ID = '" + tripId + "' AND DEPARTURE_TIME >= TIME('" + timeNow + "') AND ARRIVAL_TIME <= TIME('" + timeEnd + "') " +
        "ORDER BY DEPARTURE_TIME";
        let listaStopTimes = await this.execQueryToObjectList(sql, StopTime);
        //TODO: Checkear errores

        return listaStopTimes;
    }

    async getMetroFutureStopTimesByTripIdFromFrequencies(tripId, timeNow, timeEnd) {
        if (tripId == "") {
            console.log("El STOP_ID no puede estar vacío. (getMetroFutureStopTimesByStopId)");
            return [];
        }
        if (timeNow == "") {
            console.log("El timeNow no puede estar vacío. (getMetroFutureStopTimesByStopId)");
            return [];
        }
        if (timeEnd == "") {
            console.log("El timeEnd no puede estar vacío. (getMetroFutureStopTimesByStopId)");
            return [];
        }
        if (this.connection == null)
            await this.connect()
        let sql = "SELECT * FROM METRO_FREQUENCIES " + 
        "WHERE TRIP_ID = '" + tripId + "' AND START_TIME <= TIME('" + timeNow + "') AND END_TIME >= TIME('" + timeEnd + "') " +
        "ORDER BY END_TIME";
        let listaFrequencies = await this.execQueryToObjectList(sql, Frequency);
        //TODO: Checkear errores

        let listaStopTimes = [];
        let timeNowParts = timeNow.split(":");
        let dateTimeNow = new Date();
        let dateTimeEnd = new Date();
        let dateTimeNowAdder = new Date();

        Date.prototype.addSeconds = function(s) {
            this.setSeconds(this.getSeconds() + s);
            return this;
        }

        dateTimeNow.setHours(parseInt(timeNowParts[0]), parseInt(timeNowParts[1]), parseInt(timeNowParts[2]));
        dateTimeNowAdder.setHours(parseInt(timeNowParts[0]), parseInt(timeNowParts[1]), parseInt(timeNowParts[2]));
        Object.assign(dateTimeEnd, dateTimeNow);
        dateTimeEnd.addSeconds(1800);
        
        for (const frequency of listaFrequencies) {
            let secondsStartTime, secondsNow, secondsDiff, secondsInterval, secondsRemainder, secondsFirstAdd;
            let startTimeParts = frequency.START_TIME.split(":");
            
            secondsInterval = parseInt(frequency.HEADWAY_SECS);
            secondsStartTime = (parseInt(startTimeParts[0]) * 3600) + (parseInt(startTimeParts[1]) * 60) + parseInt(startTimeParts[2]);
            secondsNow = (parseInt(timeNowParts[0]) * 3600) + (parseInt(timeNowParts[1]) * 60) + parseInt(timeNowParts[2]);
            secondsDiff = secondsNow - secondsStartTime;
            secondsRemainder = secondsDiff % secondsInterval;
            secondsFirstAdd = secondsInterval - secondsRemainder;

            console.log(frequency);

            while (dateTimeNowAdder < dateTimeEnd) {
                let secondsToAdd = secondsInterval;
                if (secondsFirstAdd > 0) {
                    secondsToAdd = secondsFirstAdd;
                    secondsFirstAdd = 0;
                }
                dateTimeNowAdder.addSeconds(secondsToAdd);
                let trainTime = ("" + dateTimeNowAdder).split(" ")[4];
                listaStopTimes.push(new StopTime(tripId, "", "", trainTime, ""));
            }
        }

        return listaStopTimes;
    }

    async getMetroTripsByRouteId(routeId) {
        if (routeId == "") {
            console.log("El routeId no puede estar vacío. (getMetroTripsByRouteId)");
            return [];
        }
        if (this.connection == null)
            await this.connect()
        let sql = "SELECT * FROM METRO_TRIPS " + 
        "WHERE ROUTE_ID = '" + routeId + "'"; 
        let listaRoutes = await this.execQueryToObjectList(sql, Trip);
        //TODO: Checkear errores
        return listaRoutes;
    }

    async getMetroTripsByRouteIdAndActiveCalendarList(routeId, calendarList) {
        if (routeId == "") {
            console.log("El routeId no puede estar vacío. (getMetroTripsByRouteIdAndActiveCalendarList)");
            return [];
        }
        if (calendarList.length == 0) {
            return [];
        }
        if (this.connection == null)
            await this.connect()
        let listaTrips = [];
        for (const calendar of calendarList) {
            let sql = "SELECT * FROM METRO_TRIPS " + 
            "WHERE ROUTE_ID = '" + routeId + "' AND " +
            "SERVICE_ID = '" + calendar.SERVICE_ID + "'"; 
            listaTrips = listaTrips.concat(await this.execQueryToObjectList(sql, Trip));
        }
        //TODO: Checkear errores
        return listaTrips;
    }

    async getMetroCalendarEntriesByDay(day_of_week) {
        if (day_of_week == "") {
            console.log("El day_of_week no puede estar vacío. (getMetroCalendarEntriesByDayAndDate)");
            return [];
        }
        if (this.connection == null)
            await this.connect()
        let sql = "SELECT * FROM METRO_CALENDAR " + 
        "WHERE " + day_of_week + " = '1'";
        let listaCalendars = await this.execQueryToObjectList(sql, Calendar);
        //TODO: Checkear errores
        return listaCalendars;
    }
}

module.exports = DAO;