# Project e2

System infomation dashboard

## Getting Started

This project running on localhost. It will show you 5 realtime tables (delay about 1s):

* Percent of CPU, Memories, total Process running
* Running Process running detail
* Network traffic
* Disk info
* Summary of cpu, ram and total runnings process
* Database(mongo, mysql) info

### Prerequisites

Project was based on:

*Nodejs   ver 8.11.2
*Python   ver 3.4 or above
*Anocoda  ver 5.1
*Mongodb  ver 3.6.4
*RabbitMQ newest ver
*Erlang   newest ver
```
Download Nodejs  : https://nodejs.org/dist/v8.11.2/
Download Mongodb : https://www.mongodb.com/download-center?jmp=tutorials&_ga=2.248134855.1933566541.1527655285-2013513463.1527129713#community
Download Python3 : https://www.python.org/downloads/release/python-365/
Download Anacoda : https://www.anaconda.com/download/
Download Erlang  : http://www.erlang.org/downloads
Download and config RabbitMQ:
  -Step1: Install Erlang

  -Step2: Install RabbitMQ
  https://www.rabbitmq.com/install-windows.html

  -Step3: Open cmd and cd run this to setup plugins
  C:\Program Files\RabbitMQ Server\rabbitmq_server-3.7.5\sbin>rabbitmq-plugins enable rabbitmq_management

  -Step4: Open Window Services (window + R + service) and Restart RabbitMQ service

  -Step5: Go to this link with default account is (guest/guest): http://localhost:15672/#/
```

### Installing

Step 1: Clone this project on this link https://github.com/lamhai1401/project2e.git

```
$ git clone https://github.com/lamhai1401/project2e.git
```

Step 2: Open it in command prompt

```
$ cd project2e
```

Step 3: Install nescessary package node modules

```
$ npm install
```

Step 4: Start server

```
$ node server.js
```

Step 5: Install nescessary package python modules

```
$ conda install psutil pika
```

Step 6: Open 2 new terminals and run this two (rabbitMQ/producer)

```
$ python start.py 
```

Go to this link: localhost:PORT to check demo.

## Deployment

You should start mongodb before running this project.
Open file ".env" to setup your enviroment before running.
Setup your tranporter gmail so that using "auto send warning gmail api" :

* Go to: mail.google.com
* Click setting your gmail
* Click tab "Forwarding and POP/IMAP":
  POP download => Enable POP for all mail (even mail that's already been downloaded)
  IMAP Access => Enable IMAP
  Save Changes

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details