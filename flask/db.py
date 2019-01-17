import sqlite3


def get_conn():
    conn = sqlite3.connect('neighbors.db')
    cursor = conn.cursor()
    cursor.execute(
        "CREATE TABLE IF NOT EXISTS neighbor_logs ("
        "id INTEGER PRIMARY KEY AUTOINCREMENT, "
        "logtime DATETIME DEFAULT CURRENT_TIMESTAMP, "
        "hosts TEXT);")
    cursor.close()
    conn.commit()
    return conn


def write_log(contents):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO neighbor_logs (hosts) VALUES ( "' + str(contents) + '")')
    conn.commit()
    conn.close()


def get_log():
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM neighbor_logs ORDER BY id DESC LIMIT 120')
    values = cursor.fetchall()
    conn.close()
    return values

