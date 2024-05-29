import csv
import mysql.connector

mydb = mysql.connector.connect(
  host="localhost",
  user="USER",
  password="PASSWORD",
  database="IMOVE"
)

mycursor = mydb.cursor()

prefix = 'PATH_A_LOS_DOCUMENTOS_CON_LOS_DATOS_EN_CRUDO'
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