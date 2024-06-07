const DAO = require("../models/DAO");

const servicePicker = async (req, res, next) => {
    // Paramos la ejecución en la llamada a favicon, para que no se ejecute
    // dos veces cada vez que hagamos una petición.
    if (req.url == "/favicon.ico") {
        next();
        return;
    }
    
    let dotenv = req.app.get("dotenv");
    let dao = new DAO(dotenv["DB_HOST"], dotenv["DB_USER"], dotenv["DB_PASS"], dotenv["DB_NAME"]);

    let date_now = new Date()
    let date_str = date_now.toString();
    let date_parts = date_str.split(" ");
    let date_ymd = date_parts[3] + (date_now.getMonth().toString().length == 1 ? "0" : "") + (date_now.getMonth() + 1) + date_parts[2];
    let day_prefix = date_parts[0];
    let day = "";

    switch (day_prefix) {
        case "Mon":
            day = "MONDAY";
            break;
        case "Tue":
            day = "TUESDAY";
            break;
        case "Wed":
            day = "WEDNESDAY";
            break;
        case "Thu":
            day = "THURSDAY";
            break;
        case "Fri":
            day = "FRIDAY";
            break;
        case "Sat":
            day = "SATURDAY";
            break;
        case "Sun":
            day = "SUNDAY";
            break;
    }

    let calendarEntries = await dao.getRenfeCalendarEntriesByDayAndDate(day, date_ymd);

    // for (const calendarEntry of calendarEntries) {
    //     console.log(calendarEntry.toString());
    // }

    Object.assign(req.body, {calendarList: calendarEntries});

    next();
};

module.exports = servicePicker;