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

prefix = '/home/sdiezg/Projects/iMove/data/fomento_transit/'
categories = ['routes', 'stops', 'trips', 'stop_times']
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

def insert_into_db(table_name: str, headers: list, data: list):
    headers_str = ", ".join(headers)
    sql_temp = f"INSERT INTO {table_name} ({headers_str}) VALUES"

    for row in data:
        sql = sql_temp + "('" + ("', '".join(row)) + "')"
        #print(sql)
        mycursor.execute(sql)
    mydb.commit()
    print(f"rows insertadas con exito! [{table_name}] ({mycursor.rowcount}).")

# Ejecución
for cat in categories:
    read_data(cat, prefix + cat + ".txt")
    insert_into_db(cat.upper(), insert_headers[cat], insert_data[cat])

# Limpieza de Stops. Elimina todas las paradas no madrileñas
mycursor.execute("DELETE FROM STOPS WHERE STOP_ID NOT IN (SELECT STOP_TIMES.STOP_ID FROM STOP_TIMES INNER JOIN TRIPS ON STOP_TIMES.TRIP_ID = TRIPS.TRIP_ID INNER JOIN ROUTES ON TRIPS.ROUTE_ID = ROUTES.ROUTE_ID)")
mydb.commit()
print(f"Stops limpiada! ({mycursor.rowcount})")

stop_ids = []
stop_routes = {}
mycursor.execute("SELECT STOP_ID FROM STOPS")

rows = mycursor.fetchall()
for row in rows:
    stop_id = row[0]
    mycursor.execute(f"SELECT ROUTES.ROUTE_ID FROM ROUTES INNER JOIN TRIPS ON ROUTES.ROUTE_ID = TRIPS.ROUTE_ID INNER JOIN STOP_TIMES ON TRIPS.TRIP_ID = STOP_TIMES.TRIP_ID WHERE STOP_TIMES.STOP_ID = '{stop_id}' GROUP BY ROUTES.ROUTE_ID")
    rows_routes = mycursor.fetchall()
    stop_routes[stop_id] = []
    for row_routes in rows_routes:
        stop_routes[stop_id].append(row_routes[0])

for stop_id in stop_routes:
    for route_id in stop_routes[stop_id]:
        mycursor.execute(f"INSERT INTO STOP_ROUTES (STOP_ID, ROUTE_ID) VALUES ('{stop_id}', '{route_id}')")
mydb.commit()
print(f"Paradas_Rutas insertadas! ({mycursor.rowcount})")
print("Todo insertado!")