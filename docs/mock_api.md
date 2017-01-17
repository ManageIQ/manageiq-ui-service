### Mock API Usage

This project ships with a mock REST API backend meant to help simulate the ManageIQ Server.  If you would like to launch this server. (By default it runs on port 3004)   

- ```yarn start:mock-api```

####Configuration
If you would like to get this to run on a different port , please set the following environmental variable
```export MOCK_API_HOST=localhost:3005``` or whatever port you would like.

####How to add data and RESTful endpoint data

In the root of the project exists a folder /mock_api  
If you look you will see a folder named data that contains .mock.json files.  
If you want to add a new restful endpoint or edit an existing endpoint create a file with the following naming convention```restful_endpoint_name.mock.json```  

Below you will see a sample of what one of the files looks like

```
{
    "endpoint":"blueprints",
    "data":{"test":"test"},
    "querystrings":[
        {
            "endpoint":"filter[]=id%3E0&hide=resources",
            "data":{"testData":"test"}]}
        }
    ]
}
```
Key Elements in configuration    

- **endpoint** - At the high level of the json object an endpoint is the restful endpoint you are defining.  So in this example "blueprints" would actually be for the url http://localhost:3000/api/blueprints
- **data** - This is a object with the data you would like the server to respond with 
- **querystring** - This is optional.  This is an array of objects that represents a possible querystring url for this endpoint.  In this example "filter[]=id%3E0&hide=resources" would actually end up being the url *http://localhost:3000/api/blueprints?filter[]=id%3E0&hide=resources*.  
*** Please note that if a url has a nested path, please treat the rest of the path just like you would a querystring and add it to the query string array.  
For example ```  
{  
	"querystrings":[
        {
            "endpoint":"/test/path/123",
            "data":{"testData":"test"}
        }
    ]
}
```  
This example url would really be *http://localhost:3000/api/blueprints/test/path/123*

****
