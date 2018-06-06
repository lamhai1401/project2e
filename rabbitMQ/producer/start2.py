from systeminfo.Systeminfo_publisher import SystemInfoPublisher
from systeminfo.Process_detail_publisher import ProcessDetailPublisher
import logging
import json

LOG_FORMAT = ('%(levelname) -10s %(asctime)s %(name) -30s %(funcName) '
              '-35s %(lineno) -5d: %(message)s')
LOGGER = logging.getLogger(__name__)


def main():
    with open('config.json', 'r') as f:
        config = json.load(f)
    logging.basicConfig(level=logging.DEBUG, format=LOG_FORMAT)

    # Connect to localhost:5672 as guest with the password guest and virtual host "/" (%2F)
    # systeminfo = SystemInfoPublisher('amqp://localhost')
    # processdetail = ProcessDetailPublisher('amqp://localhost')
    processdetail = ProcessDetailPublisher(config['RABITMQ']['URL'])
    try:
        processdetail.run()
    except KeyboardInterrupt:
        processdetail.stop()


if __name__ == '__main__':
    main()
