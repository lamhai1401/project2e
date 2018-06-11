import socket
import os 
import sys
import platform
import psutil
import uuid
import json
import datetime
import time

af_map = {
    socket.AF_INET: 'IPv4',
    socket.AF_INET6: 'IPv6',
    psutil.AF_LINK: 'MAC',
}

duplex_map = {
    psutil.NIC_DUPLEX_FULL: "full",
    psutil.NIC_DUPLEX_HALF: "half",
    psutil.NIC_DUPLEX_UNKNOWN: "?",
}

PROC_STATUSES_RAW = {
    psutil.STATUS_RUNNING: "R",
    psutil.STATUS_SLEEPING: "S",
    psutil.STATUS_DISK_SLEEP: "D",
    psutil.STATUS_STOPPED: "T",
    psutil.STATUS_TRACING_STOP: "t",
    psutil.STATUS_ZOMBIE: "Z",
    psutil.STATUS_DEAD: "X",
    psutil.STATUS_WAKING: "WA",
    psutil.STATUS_IDLE: "I",
    psutil.STATUS_LOCKED: "L",
    psutil.STATUS_WAITING: "W",
}

# if hasattr(psutil, 'STATUS_WAKE_KILL'):
#     PROC_STATUSES_RAW[psutil.STATUS_WAKE_KILL] = "WK"

# if hasattr(psutil, 'STATUS_SUSPENDED'):
#     PROC_STATUSES_RAW[psutil.STATUS_SUSPENDED] = "V"


def timeit(method):
    def timed(*args, **kw):
        ts = time.time()
        result = method(*args, **kw)
        te = time.time()
        if 'log_time' in kw:
            name = kw.get('log_name', method.__name__.upper())
            kw['log_time'][name] = int((te - ts) * 1000)
        else:
            print ('%r  %2.2f miniseconds' % (method.__name__, (te - ts) * 1000))
        return result
    return timed

def bytes2human(n):
    # http://code.activestate.com/recipes/578019
    # >>> bytes2human(10000)
    # '9.8K'
    # >>> bytes2human(100001221)
    # '95.4M'
    symbols = ('K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y')
    prefix = {}
    for i, s in enumerate(symbols):
        prefix[s] = 1 << (i + 1) * 10
    for s in reversed(symbols):
        if n >= prefix[s]:
            value = float(n) / prefix[s]
            return '%.2f%s' % (value, s)
    return '%sB' % (n)

def ram_info(nt):
    ram = {}
    for name in nt._fields:
        value = getattr(nt, name)
        if name != 'percent':
            value = bytes2human(value)
        ram[name.capitalize()] = str(value)
    return ram

def ifconfig_info():
    ifconfig = {}
    stats = psutil.net_if_stats()
    io_counters = psutil.net_io_counters(pernic=True)
    for nic, addrs in psutil.net_if_addrs().items():        
        if nic in stats:
            st = stats[nic]
            item = {}
            speed = str(st.speed)+"B"
            duplex, mtu, up = map(str, [duplex_map[st.duplex], st.mtu, "yes" if st.isup else "no"])
        item.update({"speed": speed, "duplex": duplex, "mtu": mtu, "up": up})
        ifconfig[nic] = {"stats": item}
        if nic in io_counters:
            io = io_counters[nic]           
            item = {}
            byte, pkts, errs, drops = map(str, [bytes2human(io.bytes_recv), io.packets_recv, io.errin, io.dropin])
            item.update({"bytes": byte, "pkts": pkts, "errs": errs, "drops": drops})
            ifconfig[nic].update({"incoming": item})            
            item = {}
            byte, pkts, errs, drops = map(str, [bytes2human(io.bytes_sent), io.packets_sent, io.errout, io.dropout])
            item.update({"bytes": byte, "pkts": pkts, "errs": errs, "drops": drops})
            ifconfig[nic].update({"outcoming": item})            
        for addr in addrs:
            address = str(af_map.get(addr.family, addr.family))
            address += " address"
            ifconfig[nic].update({address: addr.address})   
    return ifconfig

@timeit
def partition_info():
    disk = {}
    for part in psutil.disk_partitions(all=False):
        if os.name == 'nt':
            if 'cdrom' in part.opts or part.fstype == '':
                # skip cd-rom drives with no disk in it; they may raise
                # ENOENT, pop-up a Windows GUI error for a non-ready
                # partition or just hang.
                continue
        usage = psutil.disk_usage(part.mountpoint)
        total, used, free, percent_use, typed, mount = map(str, [bytes2human(usage.total), bytes2human(usage.used),
                                                   bytes2human(usage.free), usage.percent, part.fstype, part.mountpoint])
        partition = {"total": total, "used": used, "free": free, "percent_used": percent_use, "type": typed}  #"mount": mount
        disk.update({part.device[:-2]: partition})
    return disk

# get system infomation dict output array["attribute"]
@timeit
def get_information():   
    info = {}
    # info["user"] = psutil.users()
    info["name"] = socket.gethostname()
    # info["FQDN"] = socket.getfqdn()
    # info["System Platform"] = sys.platform
    # info["Machine"] = platform.machine()
    # info["Node"] = platform.node()
    # info["Platform"] = platform.platform()
    info["processor"] = platform.processor()
    info["system_os"] = platform.system()
    # info["Release"] =platform.release()
    # info["Version"] = platform.version()
    info["number_of_cpus"] = str(psutil.cpu_count())
    info["number_of_physical_cpus"] = str(psutil.cpu_count(logical=False))
    info["pcpu"] = str(psutil.cpu_percent(1.0))
    info["pmem"] = str(psutil.virtual_memory()[2])
    info["total_proc"] = str(len(psutil.pids()))
    # info["Virtual Memory"] = ram_info(psutil.virtual_memory())
    # info["Swap Memory"] = ram_info(psutil.swap_memory())
    # info["Process"] = process_summary()
    return info

# get process detail
@timeit
def process_summary():

    process = {}
    today_day = datetime.date.today()
    templ = "%-10s %5s %4s %4s %7s %7s %-13s %-5s %5s %7s  %s"
    attrs = ['pid', 'cpu_percent', 'memory_percent', 'name', 'cpu_times',
             'create_time', 'memory_info', 'status']
    if os.name == 'posix':
        attrs.append('uids')
        attrs.append('terminal')

    for p in psutil.process_iter():
        pass
        try:
            pinfo = p.as_dict(attrs, ad_value='')
        except psutil.NoSuchProcess:
            pass
        else:
            if pinfo['create_time']:
                ctime = datetime.datetime.fromtimestamp(pinfo['create_time'])
                if ctime.date() == today_day:
                    ctime = ctime.strftime("%H:%M")
                else:
                    ctime = ctime.strftime("%b%d")
            else:
                ctime = ''
            cputime = time.strftime("%M:%S",
                                    time.localtime(sum(pinfo['cpu_times'])))
            try:
                user = p.username()
            #except Exception as expt_msg:
            #    pass
            except KeyError:
                #user = ''
                if os.name == 'posix':
                    if pinfo['uids']:
                        user = str(pinfo['uids'].real)
                    else:
                        user = ''
                else:
                    raise
            except psutil.Error:
                user = ''
            if os.name == 'nt' and '\\' in user:
                user = user.split('\\')[1]
            vms = pinfo['memory_info'] and \
                int(pinfo['memory_info'].vms / 1024) or '?'
            rss = pinfo['memory_info'] and \
                int(pinfo['memory_info'].rss / 1024) or '?'
            memp = pinfo['memory_percent'] and \
                round(pinfo['memory_percent'], 1) or '?'
            status = PROC_STATUSES_RAW.get(pinfo['status'], pinfo['status'])
            # if user != "SYSTEM" and user != "":
            user, pid, cpu_percent, mem_percent, vms, rss, status, start, cputime, command = map(str, [user,
                pinfo['pid'], pinfo['cpu_percent'], memp, vms, rss, status, ctime, cputime, pinfo['name'].strip() or '?'])
            # thread = {'User': user, "%CPU": cpu_percent, "%MEM": mem_percent, 
            #             "VMS": vms, "RSS": rss, "Status": status, "Start": start, "Time": cputime, "Commmad": command}
            thread = {'user': user, "pcpu": cpu_percent, "pmem": mem_percent, 
                        "status": status, "startAt": start, "duration": cputime, "name": command}
            process.update({str(pid): thread})
    return process

# filter process running
@timeit
def filterProcessRunning(lastProcess, currProcess):
    last    = set()
    current = set()
    temp    = set()
    tempProcess = {}

    # if(len(lastProcess) == 0):
    #     tempProcess = currProcess
    #     return tempProcess

    # set up arr last and current
    for key in lastProcess:
        last.add(key)
    for key in currProcess:
        current.add(key)

    # get difference data between last and current
    temp = last.intersection(current)
    for key in temp:
        if lastProcess[key]['pcpu'] != currProcess[key]['pcpu']:
            tempProcess.update({key: currProcess[key]})
            pass
        if lastProcess[key]['pmem'] != currProcess[key]['pmem']:
            tempProcess.update({key: currProcess[key]})
            pass
    
    # get new process in current but not in last
    temp = current.difference(last)
    if (len(temp) != 0):
        for key in temp:
            tempProcess.update({key: currProcess[key]})

    # get exitted process
    temp = last.difference(current)
    if (len(temp) != 0):
        for key in temp:
            lastProcess[key]['status'] = 'T'
            tempProcess.update({key: lastProcess[key]})
    
    return tempProcess

# get network traffic
@timeit
def get_network_traffic():
    ethernet = (psutil.net_io_counters(pernic=True)['Ethernet'])
    result = {
        'bytes_sent': str(ethernet[0]),
        'bytes_recv': str(ethernet[1]),
        'packets_sent': str(ethernet[2]),
        'packets_recv': str(ethernet[3]),
        'error_in': str(ethernet[4]),
        'error_out': str(ethernet[5]),
        'drop_in': str(ethernet[6]),
        'drop_out': str(ethernet[7])
    }
    return result

