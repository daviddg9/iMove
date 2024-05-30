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

for cat in categories:
    read_data(cat, prefix + cat + ".txt")
    insert_into_db(cat.upper(), insert_headers[cat], insert_data[cat])

print("Todo insertado!")