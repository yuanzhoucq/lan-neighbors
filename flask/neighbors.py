from time import sleep
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from db import write_log

options = webdriver.ChromeOptions()
options.add_argument("headless")


def find_neighbors():
    driver = webdriver.Chrome(chrome_options=options)
    driver.get('http://192.168.1.1')
    sleep(3)
    pwd_elem = driver.find_element_by_id('lgPwd')
    pwd_elem.send_keys('D31306888')
    pwd_elem.send_keys(Keys.RETURN)
    sleep(5)
    machines = driver.find_elements_by_class_name('bEptLHDInfo')[1:]
    driver.set_network_conditions(
        offline=True,
        latency=5,  # additional latency (ms)
        download_throughput=500 * 1024,  # maximal throughput
        upload_throughput=500 * 1024)  # maximal throughput

    hosts = []
    for machine in machines:
        hostname = machine.find_element_by_class_name('bEptHostNameP').text
        if hostname != '':
            hosts.append(hostname)
    driver.close()
    return hosts


def log_neighbors(interval=30):
    while True:
        try:
            write_log(str(find_neighbors()))
        except Exception as e:
            print(e)
        sleep(interval)
