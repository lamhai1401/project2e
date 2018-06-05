import time

def transmissionrate(dev, direction, timestep):
    """Return the transmisson rate of a interface under linux
    dev: devicename
    direction: rx (received) or tx (sended)
    timestep: time to measure in seconds
    """
    path = "/sys/class/net/{}/statistics/{}_bytes".format(dev, direction)
    f = open(path, "r")
    bytes_before = int(f.read())
    f.close()
    time.sleep(timestep)
    f = open(path, "r")
    bytes_after = int(f.read())
    f.close()
    return str((bytes_after-bytes_before)/timestep)

devname = "eth0"
timestep = 1 # Seconds

while True:
    print("recv = " + transmissionrate(devname, "rx", timestep) + " bytes")
    print("send = " + transmissionrate(devname, "tx", timestep) + " bytes")
    time.sleep(10)

