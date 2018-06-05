from systeminfo.Systeminfo_publisher import SystemInfoPublisher
from systeminfo.Disk_info_publisher import DiskInfoPublisher
# from mongodb.MongoProducer import MongoPublisher
import logging
import _thread

LOG_FORMAT = ('%(levelname) -10s %(asctime)s %(name) -30s %(funcName) '
              '-35s %(lineno) -5d: %(message)s')
LOGGER = logging.getLogger(__name__)

def main():
  
	logging.basicConfig(level=logging.DEBUG, format=LOG_FORMAT)

  # Connect to localhost:5672 as guest with the password guest and virtual host "/" (%2F)
	# systeminfo = SystemInfoPublisher('amqp://guest:guest@localhost:5672/%2F?connection_attempts=3&heartbeat_interval=3600')
	# processdetail = ProcessDetailPublisher('amqp://guest:guest@localhost:5672/%2F?connection_attempts=3&heartbeat_interval=3600')
	# mongodata = MongoPublisher('amqp://guest:guest@localhost:5672/%2F?connection_attempts=3&heartbeat_interval=3600')
	diskinfo = DiskInfoPublisher('amqp://guest:guest@localhost:5672/%2F?connection_attempts=3&heartbeat_interval=3600')
	try:
		diskinfo.run()
		# systeminfo.run()
		# processdetail.run()
		#_thread.start_new_thread( systeminfo.run(), ())
		#mongodata.run()
	except KeyboardInterrupt:
		diskinfo.stop()
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