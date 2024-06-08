import csv
from isort import file
import mysql.connector
import os
import codecs

# Leer vars del dotenv
dotenv = {}
with open("C:/Users/USUARIO/Desktop/iMove/iMove/.env", mode="r") as dt:
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

prefix = dotenv["PROJECT_PATH"] + dotenv["DATA_SUBPATH"]
dirs = ['metro', 'renfe']
categories = ['routes', 'stops', 'calendar', 'trips', 'stop_times', 'frequencies']
insert_headers = {}
insert_data = {}

def read_data(category: str, filename: str):
    insert_data[category] = []
    with codecs.open(filename, mode='r', encoding= "utf-8") as csvfile:
        csvreader = csv.reader(csvfile, delimiter=',')
        i = 0
        for row in csvreader:
            if i == 0:
                insert_headers[category] = [field.upper() for field in row]
            else:
                insert_data[category].append(row)
            i = i + 1

def insert_into_db(dir_name: str, table_name: str, headers: list, data: list):
    headers_str = ", ".join(headers)
    sql_temp = f"INSERT INTO {dir_name}_{table_name} ({headers_str}) VALUES "

    for row in data:
        sql = sql_temp + "(" + (", ".join(["%s" for item in row])) + ");"
        # print(sql)
        # print(row)
        mycursor.execute(sql, tuple(row))
    mydb.commit()
    print(f"rows insertadas con exito! [{dir_name}_{table_name}] ({mycursor.rowcount}).")

# Ejecución
for dir_name in dirs:
    for cat in categories:
        filename =  prefix + dir_name + "/" + cat + ".txt"
        if (not os.path.isfile(filename)):
            print(f"El archivo {filename} no existe. Pasando al siguiente fichero...")
            continue
        read_data(cat, filename)
        insert_into_db(dir_name.upper(), cat.upper(), insert_headers[cat], insert_data[cat])
    print(f"\nDatos de {dir_name.upper()} Insertados con éxito!\n")

# Limpieza de Renfe_Stops. Elimina todas las paradas no madrileñas
mycursor.execute("DELETE FROM RENFE_STOPS WHERE STOP_ID NOT IN (SELECT RENFE_STOP_TIMES.STOP_ID FROM RENFE_STOP_TIMES INNER JOIN RENFE_TRIPS ON RENFE_STOP_TIMES.TRIP_ID = RENFE_TRIPS.TRIP_ID INNER JOIN RENFE_ROUTES ON RENFE_TRIPS.ROUTE_ID = RENFE_ROUTES.ROUTE_ID)")
mydb.commit()
print(f"Renfe_Stops limpiada! ({mycursor.rowcount})")

# Limpieza de Metro_Stops. Dejamos solo las paradas, y eliminamos estaciones y accesos.
mycursor.execute("DELETE FROM METRO_STOPS WHERE STOP_ID LIKE 'acc%' OR STOP_ID LIKE 'est%'")
mydb.commit()
print(f"Metro_Stops limpiada! ({mycursor.rowcount})")

# Poblar la tabla de renfe_stop_routes, que agilizará todas nuestras queries en la aplicación
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
print(f"Paradas_Rutas de renfe insertadas! ({mycursor.rowcount})")

# Poblar la tabla de metro_stop_routes, que agilizará todas nuestras queries en la aplicación
stop_ids = []
stop_routes = {}
mycursor.execute("SELECT STOP_ID FROM METRO_STOPS")

rows = mycursor.fetchall()
for row in rows:
    stop_id = row[0]
    mycursor.execute(f"SELECT METRO_ROUTES.ROUTE_ID FROM METRO_ROUTES INNER JOIN METRO_TRIPS ON METRO_ROUTES.ROUTE_ID = METRO_TRIPS.ROUTE_ID INNER JOIN METRO_STOP_TIMES ON METRO_TRIPS.TRIP_ID = METRO_STOP_TIMES.TRIP_ID WHERE METRO_STOP_TIMES.STOP_ID = '{stop_id}' GROUP BY METRO_ROUTES.ROUTE_ID")
    rows_routes = mycursor.fetchall()
    stop_routes[stop_id] = []
    for row_routes in rows_routes:
        stop_routes[stop_id].append(row_routes[0])

for stop_id in stop_routes:
    for route_id in stop_routes[stop_id]:
        mycursor.execute(f"INSERT INTO METRO_STOP_ROUTES (STOP_ID, ROUTE_ID) VALUES ('{stop_id}', '{route_id}')")
mydb.commit()
print(f"Paradas_Rutas de metro insertadas! ({mycursor.rowcount})")

print("Todo insertado!")