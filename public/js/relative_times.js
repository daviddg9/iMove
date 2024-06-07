function timeToMinsRemaining(time) {
    let time_parts = time.split(":");
    let date_now = new Date();
    let date_train = new Date();
    date_train.setHours(time_parts[0]);
    date_train.setMinutes(time_parts[1]);
    date_train.setSeconds(time_parts[2]);

    let diff_ms = date_train - date_now;
    let diff_mins = Math.floor(diff_ms / 60000);

    // console.log(date_train);
    // console.log("Faltan " + diff_mins + " minutos.");
    // console.log("");

    return diff_mins;
}

function updateTimes(time_elements, raw_times) {
    let i = 0;
    let deleted = false;
    for (const te of time_elements) {
        let mins_remaining = timeToMinsRemaining(raw_times[i]);
        if (mins_remaining < 0) {
            te.parentNode.remove();
            raw_times.splice(i, 1);
            deleted = true;
            break;
        }
        else if (mins_remaining == 0) {
            te.innerHTML = "<<<";
        }
        else {
            te.innerHTML = mins_remaining + " min" + (mins_remaining != 1 ? "s" : "");
        }
        i++;
    }
    if (deleted)
        updateTimes(time_elements, raw_times);
}

function refreshIfTimesEmpty(time_containers) {
    for (const tc of time_containers) {
        if (!tc.hasChildNodes()) {
            location.reload();
        }
    }
}

let time_containers = document.getElementsByClassName("container-tiempos");
let time_elements = document.getElementsByClassName("tiempo");
let raw_times = [];

for (const te of time_elements) {
    raw_times.push(te.innerHTML);
}

updateTimes(time_elements, raw_times);

let date_now = new Date();
// Restamos 1 segundo para que las horas se actualizen al segundo 01,
// y se pongan bien los minutos restantes.
let seconds_now = date_now.getSeconds() - 1;
if (seconds_now == 0) {
    setInterval(() => {
        updateTimes(time_elements, raw_times);
        refreshIfTimesEmpty(time_containers);
    }, 60000);
}
else {
    setTimeout(() => {
        updateTimes(time_elements, raw_times);
        refreshIfTimesEmpty(time_containers);
        setInterval(() => {
            updateTimes(time_elements, raw_times);
            refreshIfTimesEmpty(time_containers);
        }, 60000);
    }, (60 - seconds_now) * 1000);

}
