# aritmèticaExpress

Demonstration nodeJS JSON Application Server based on Express 3, enough to learn client JavaScript, JSON and some server programming.

## Installing

Node.js (tested with 0.8.11), express and commander modules

	$ npm install

### Server Launch

	$ node service

Port 80 is used by default. If you do not have the proper privileges, you can change port with -p / --port argument option. 

	$ node service --port 3000
	
By default cluster is disabled. To activate use -c / --cluster option. It enables as many processes as logical processors are available. To disable default cluster behaviour, you can use -t / --processes option passing the number of processes to fork.

	$ node service --c -t 32

### Testing

To test local processes you can uses Apache Benchmark:

	$ ab -k -n 100000 -c 100 -p post.txt -T "application/json" -B 127.0.0.1 "http://127.0.0.1/mult"

To test it remotely:

	$ ab -k -n 100000 -c 100 -p post.txt -T "application/json" "http://service-adress/mult"
	
### Business code

Business code is located in service.js, inside api object. Arithmetic vector sample operations are provided and a load operation is included as well.
