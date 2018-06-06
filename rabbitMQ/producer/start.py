from systeminfo.Systeminfo_publisher import SystemInfoPublisher
from systeminfo.Process_detail_publisher import ProcessDetailPublisher
from mongodb.MongoProducer import MongoPublisher
import logging
import _thread
import json

LOG_FORMAT = ('%(levelname) -10s %(asctime)s %(name) -30s %(funcName) '
              '-35s %(lineno) -5d: %(message)s')
LOGGER = logging.getLogger(__name__)


def main():
    with open('config.json', 'r') as f:
        config = json.load(f)
    logging.basicConfig(level=logging.DEBUG, format=LOG_FORMAT)

    # Connect to localhost:5672 as guest with the password guest and virtual host "/" (%2F)
    # systeminfo = SystemInfoPublisher(
    #     'amqp://guest:guest@localhost:5672/%2F?connection_attempts=3&heartbeat_interval=3600')
    systeminfo = SystemInfoPublisher(config['RABITMQ']['URL'] + '/%2F?connection_attempts=3&heartbeat_interval=3600')
    # processdetail = ProcessDetailPublisher('amqp://guest:guest@localhost:5672/%2F?connection_attempts=3&heartbeat_interval=3600')
    # mongodata = MongoPublisher('amqp://guest:guest@localhost:5672/%2F?connection_attempts=3&heartbeat_interval=3600')
    try:
        systeminfo.run()
    # _thread.start_new_thread( systeminfo.run(), ())
    # mongodata.run()
    except KeyboardInterrupt:
        systeminfo.stop()


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
