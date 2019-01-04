### Mock API Usage
This product ships with a mock REST API that simulates a server.  If you would like to launch this server, which runs 
on port 3004, run:

- ```yarn add @manageiq/manageiq-api-mock```
- ```cd node_modules/@manageiq/manageiq-api-mock/ && node index.js```

####Configuration
If you would like to get this to run on a different port , please set the following environmental variable;

- ```export MOCK_API_HOST=localhost:3005``` 

If you would like to debug incoming http requests please set the following environmental variable:

- ```export LOG_LEVEL=debug```

#### How to add RESTful endpoint data
Checkout the repo [manageiq-api-mock](https://github.com/ManageIQ/manageiq-api-mock)
