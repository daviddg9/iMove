

async function printStops() {
    let dao = new DAO();

    let stops = await dao.getAllStops();
    
    console.log(stops);    
}

console.log("HOLA!");

printStops();