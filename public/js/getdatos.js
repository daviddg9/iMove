

async function printStops() {
    let dao = new DAO();

    let stops = await dao.getStops();
    
    console.log(stops);    
}

console.log("HOLA!");

printStops();