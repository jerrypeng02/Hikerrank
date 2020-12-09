# drop hikerrank mysql database 
#      -> create a new hikerrank db 
#      -> delete previous migrations(except the ini one)
#      -> makemigrations and migrate (models are updated)
#      -> run this file to populate the trail table

import json

import geojson
import mysql.connector
from mysql.connector import errorcode

id_list = []


# read from geojson file and write to the database
def readfile():
    filename = 'Pennsylvania_State_Park_Hiking_Trails.geojson'
    with open(filename) as f:
        gj = geojson.load(f)
        trail_list = gj['features']
        try:
            cnx = mysql.connector.connect(user='root', database='hikerrank')
            print("Connected")
            cursor = cnx.cursor()
            for trail in trail_list:
                if (trail['properties']['TRAILID'] not in id_list) and (
                        trail['properties']['TRAILID'] is not None) and (trail['properties']['NAME'] is not None):
                    tid = trail['properties']['TRAILID']
                    id_list.append(tid)
                    tname = trail['properties']['NAME']
                    tclass = trail['properties']['CLASS']
                    surface = trail['properties']['SURFACE']
                    length = trail['properties']['MILES']
                    backpack = trail['properties']['TYPE_BACKPACK']
                    bicycle = trail['properties']['TYPE_BICYCLE']
                    mountainbike = trail['properties']['TYPE_MOUNTAIN_BIKE']
                    ski = trail['properties']['TYPE_XCOUNTRYSKI']
                    width = trail['properties']['AVERAGE_WIDTH']
                    difficulty = trail['properties']['DIFFICULTY']
                    description = trail['properties']['DESCRIPTION']  # allow null
                    if description is None:
                        description = "None"
                    else:
                        description = str(description).replace('\n', ' ')
                        description = str(description).replace('\r', '')

                    if tclass is None:
                        tclass = "Unkown"
                    if surface is None:
                        surface = "Unkown"
                    if difficulty is None:
                        difficulty = "Unkown"
                    if width is None:
                        width = 0
                    if length is None:
                        length = 0

                    if backpack is None:
                        backpack = "Unkown"
                    elif backpack == 1:
                        backpack = "Supported"
                    else:
                        backpack = "Unsupported"

                    if bicycle is None:
                        bicycle = "Unkown"
                    elif bicycle == 1:
                        bicycle = "Supported"
                    else:
                        bicycle = "Unsupported"

                    if mountainbike is None:
                        mountainbike = "Unkown"
                    elif mountainbike == 1:
                        mountainbike = "Supported"
                    else:
                        mountainbike = "Unsupported"

                    if ski is None:
                        ski = "Unkown"
                    elif ski == 1:
                        ski = "Supported"
                    else:
                        ski = "Unsupported"

                    data_dict = {'type': 'Feature', 'properties': {}, 'geometry': trail['geometry']}
                    trail_dict = {'type': 'geojson', 'data': data_dict}
                    map_info = json.dumps(trail_dict)

                    add_trail = ("INSERT INTO hikerrank_trail "
                                 "VALUES (%s, %s, %s, %s,%s, %s, %s, %s, %s,%s, %s ,%s,%s)")

                    trail = (
                        tid, tname, tclass, surface, length, backpack, bicycle, mountainbike, ski, width, difficulty,
                        description, map_info)

                    # write to the db
                    cursor = cnx.cursor()
                    cursor.execute(add_trail, trail)
                    cnx.commit()
        except mysql.connector.Error as err:
            if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
                print("Something is wrong with your user name or password")
            elif err.errno == errorcode.ER_BAD_DB_ERROR:
                print("Database does not exist")
            else:
                print(err)
        else:
            cnx.close()


if __name__ == "__main__":
    readfile()
