from systeminfo.Systeminfo_publisher import SystemInfoPublisher
from systeminfo.Disk_info_publisher import DiskInfoPublisher
from systeminfo.Process_running_publisher import  ProcessRunningPublisher
from systeminfo.Network_traffic_publisher import NetworkTrafficPublisher
from mongodb.Mongo_publisher import MongoPublisher
from mySQL.Mysql_publisher import MySQLStatusPublisher
from mySQL.Mysql_publisher import MySQLProcessPublisher
from multiprocessing import Process
import logging
import _thread

LOG_FORMAT = ('%(levelname) -10s %(asctime)s %(name) -30s %(funcName) '
              '-35s %(lineno) -5d: %(message)s')
LOGGER = logging.getLogger(__name__)

rabbit_url = 'amqp://guest:guest@localhost:5672/%2F?connection_attempts=3&heartbeat_interval=3600'

# create publisher
systeminfo = SystemInfoPublisher(rabbit_url)
processrunning = ProcessRunningPublisher(rabbit_url)
mongodata = MongoPublisher(rabbit_url)
diskinfo = DiskInfoPublisher(rabbit_url)
mysqlstatus = MySQLStatusPublisher(rabbit_url)
mysqlprocess =MySQLProcessPublisher(rabbit_url)
networktraffic = NetworkTrafficPublisher(rabbit_url)
# define func
def runSys():
	systeminfo.run()
def runPro():
	processrunning.run()
def runDisk():
	diskinfo.run()
def runNetwork_traffic():
	networktraffic.run()
def runMongo():
	mongodata.run()
def runMysql_status():
	mysqlstatus.run()
def runMysql_process():
	mysqlprocess.run()

def main():
	logging.basicConfig(level=logging.DEBUG, format=LOG_FORMAT)

	# create a process
	system_info = Process(target=runSys)
	process_running = Process(target=runPro)
	disk_info = Process(target=runDisk)
	network_traffic = Process(target=runNetwork_traffic)
	mongo_info = Process(target= runMongo)
	mysql_status = Process(target=runMysql_status)
	mysql_process = Process(target=runMysql_process)
	try:
		system_info.start()
		process_running.start()
		disk_info.start()
		network_traffic.start()
		mongo_info.start()
		mysql_process.start()
		mysql_status.start()
	except KeyboardInterrupt:
		print('Script exitting')
	except Exception as msg:
		print(msg)

if __name__ == '__main__':
  main()