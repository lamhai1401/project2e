from systeminfo.Systeminfo_publisher import SystemInfoPublisher
from systeminfo.Disk_info_publisher import DiskInfoPublisher
from systeminfo.Process_running_publisher import ProcessDetailPublisher
from mongodb.Mongo_publisher import MongoPublisher
from mySQL.Mysql_publisher import MySQLStatusPublisher
from mySQL.Mysql_publisher import MySQLProcessPublisher
from multiprocessing import Pool, TimeoutError, Process
import logging
import _thread

LOG_FORMAT = ('%(levelname) -10s %(asctime)s %(name) -30s %(funcName) '
              '-35s %(lineno) -5d: %(message)s')
LOGGER = logging.getLogger(__name__)

systeminfo = SystemInfoPublisher('amqp://guest:guest@localhost:5672/%2F?connection_attempts=3&heartbeat_interval=3600')
processdetail = ProcessDetailPublisher('amqp://guest:guest@localhost:5672/%2F?connection_attempts=3&heartbeat_interval=3600')



def runSys():
	systeminfo.run()
def runPro():
	processdetail.run()

def main():
	logging.basicConfig(level=logging.DEBUG, format=LOG_FORMAT)
	rabbit_url = 'amqp://guest:guest@localhost:5672/%2F?connection_attempts=3&heartbeat_interval=3600'

  # Connect to localhost:5672 as guest with the password guest and virtual host "/" (%2F)
	# systeminfo = SystemInfoPublisher('amqp://guest:guest@localhost:5672/%2F?connection_attempts=3&heartbeat_interval=3600')
	# processdetail = ProcessDetailPublisher('amqp://guest:guest@localhost:5672/%2F?connection_attempts=3&heartbeat_interval=3600')
	# mongodata = MongoPublisher('amqp://guest:guest@localhost:5672/%2F?connection_attempts=3&heartbeat_interval=3600')
	# diskinfo = DiskInfoPublisher(rabbit_url)
	# start 4 worker processes
	# Process(target=runSys).start()
	# Process(target=runPro).start()

	pool = Pool(processes=2)
	pool.apply_async(runSys)
	pool.apply_async(runPro)
  
	pool.join()
	pool.close()
	# smysqlinfo = MySQLStatusPublisher('amqp://guest:guest@localhost:5672/%2F?connection_attempts=3&heartbeat_interval=3600')
	# try:
	# 	# p.start()
		
	# 	# mysqlinfo.run()
	# 	# diskinfo.run()
	# 	# systeminfo.run()
	# 	# processdetail.run()
	# 	#_thread.start_new_thread( systeminfo.run(), ())
	# 	#mongodata.run()
	# except KeyboardInterrupt:
	# 	print ("We lacked patience and got a multiprocessing.TimeoutError")
		# mysqlinfo.stop()
		# diskinfo.stop()
		# systeminfo.stop()
		# mongodata.stop()
		# processdetail.stop()

	# try:
	# 	#_thread.start_new_thread( systeminfo.run(), ())
	# 	_thread.start_new_thread( processdetail.run(), ())
	# except KeyboardInterrupt:
	# 	#systeminfo.stop()
	# 	processdetail.stop()

if __name__ == '__main__':
  main()