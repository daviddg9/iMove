import csv
from isort import file
import mysql.connector

# Leer vars del dotenv
dotenv = {}
with open("/home/sdiezg/Projects/iMove/.env", mode="r") as dt:
    dotenv_reader = csv.reader(dt, delimiter="=")
    for dotenv_field in dotenv_reader:
        dotenv[str(dotenv_field[0])] = str(dotenv_field[1])

mydb = mysql.connector.connect(
  host=dotenv["DB_HOST"],
  user=dotenv["DB_USER"],
  password=dotenv["DB_PASS"],
  database=dotenv["DB_NAME"]
)

mycursor = mydb.cursor()

prefix = '/home/sdiezg/Projects/iMove/data/'
dirs = ['renfe']
categories = ['routes', 'stops', 'calendar', 'trips', 'stop_times']
insert_headers = {}
insert_data = {}

def read_data(category: str, filename: str):
    insert_data[category] = []
    with open(filename, mode='r') as csvfile:
        csvreader = csv.reader(csvfile, delimiter=',')
        i = 0
        for row in csvreader:
            if i == 0:
                insert_headers[category] = row
            else:
                insert_data[category].append(row)
            i = i + 1

def insert_into_db(dir_name: str, table_name: str, headers: list, data: list):
    headers_str = ", ".join(headers)
    sql_temp = f"INSERT INTO {dir_name}_{table_name} ({headers_str}) VALUES"

    for row in data:
        sql = sql_temp + "('" + ("', '".join(row)) + "')"
        #print(sql)
        mycursor.execute(sql)
    mydb.commit()
    print(f"rows insertadas con exito! [{dir_name}_{table_name}] ({mycursor.rowcount}).")

# Ejecución
for dir_name in dirs:
    for cat in categories:
        read_data(cat, prefix + dir_name + "/" + cat + ".txt")
        insert_into_db(dir_name.upper(), cat.upper(), insert_headers[cat], insert_data[cat])

# Limpieza de Stops. Elimina todas las paradas no madrileñas
mycursor.execute("DELETE FROM RENFE_STOPS WHERE STOP_ID NOT IN (SELECT RENFE_STOP_TIMES.STOP_ID FROM RENFE_STOP_TIMES INNER JOIN RENFE_TRIPS ON RENFE_STOP_TIMES.TRIP_ID = RENFE_TRIPS.TRIP_ID INNER JOIN RENFE_ROUTES ON RENFE_TRIPS.ROUTE_ID = RENFE_ROUTES.ROUTE_ID)")
mydb.commit()
print(f"Stops limpiada! ({mycursor.rowcount})")

# Poblar la tabla de stop_routes, que agilizará todas nuestras queries en la aplicación
stop_ids = []
stop_routes = {}
mycursor.execute("SELECT STOP_ID FROM RENFE_STOPS")

rows = mycursor.fetchall()
for row in rows:
    stop_id = row[0]
    mycursor.execute(f"SELECT RENFE_ROUTES.ROUTE_ID FROM RENFE_ROUTES INNER JOIN RENFE_TRIPS ON RENFE_ROUTES.ROUTE_ID = RENFE_TRIPS.ROUTE_ID INNER JOIN RENFE_STOP_TIMES ON RENFE_TRIPS.TRIP_ID = RENFE_STOP_TIMES.TRIP_ID WHERE RENFE_STOP_TIMES.STOP_ID = '{stop_id}' GROUP BY RENFE_ROUTES.ROUTE_ID")
    rows_routes = mycursor.fetchall()
    stop_routes[stop_id] = []
    for row_routes in rows_routes:
        stop_routes[stop_id].append(row_routes[0])

for stop_id in stop_routes:
    for route_id in stop_routes[stop_id]:
        mycursor.execute(f"INSERT INTO RENFE_STOP_ROUTES (STOP_ID, ROUTE_ID) VALUES ('{stop_id}', '{route_id}')")
mydb.commit()
print(f"Paradas_Rutas insertadas! ({mycursor.rowcount})")
print("Todo insertado!")