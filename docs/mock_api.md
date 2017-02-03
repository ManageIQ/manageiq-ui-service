### Mock API Usage

This project ships with a mock REST API backend meant to help simulate the ManageIQ Server.  If you would like to launch this server. (By default it runs on port 3004)   

- ```yarn start:mock-api```

####Configuration
If you would like to get this to run on a different port , please set the following environmental variable
```export MOCK_API_HOST=localhost:3005``` or whatever port you would like.  

If you would like to debug incoming http requests please set the following environmental variable
```export LOG_LEVEL=debug```

####How to add data and RESTful endpoint data

In the root of the project exists a folder /mock_api  
If you look you will see a folder named **data** that contains subfolders that have .json files.  
If you want to add a new restful endpoint or edit an existing endpoint create a file with the following naming convention```unique_filename.json```  

* Please note that the folders under mock_api/data are just to help organize files and do not have to match the endpoint the files underneath are for.  
 
Below you will see a sample of what one of the files looks like

```
{
    "url":"blueprints",
    "get":{"test":"test"},
    "put":{},
    "post":{},
    "delete":{}
}
```  
Key Elements in configuration    

- **url** - At the high level of the json object an endpoint is the restful endpoint you are defining.  So in this example "blueprints" would actually be for the url http://localhost:3000/api/blueprints.  
- **get** - This is a object with the data you would like the server to respond with 
- **put** - This is a object with the data you would like the server to respond with 
- **post** - This is a object with the data you would like the server to respond with 
- **delete** - This is a object with the data you would like the server to respond with 

####Handling querystrings and subpaths

Sometimes you will have urls with querystrings you need to handle
like *http://localhost:3000/api/blueprints?test=123*
  
You also might end up with urls with subpaths like *http://localhost:3000/api/blueprints/test/path/*

The Mock API handles defining both of these scenarios the same way.  
For example querystrings  

```
{  
	"url":"blueprints?test=123",
	"get":{"test":"test"}
}
```
or subpaths

```
{
	"url":"blueprints/test/path/",
	"get":{"test":"test"}
}

```
####Overriding stock endpoints with local changes
If you would like to override any of the endpoints in the repo please drop the overriden files into the mock_api/local directory structure.  This will pick up and override files that match from stock data.  