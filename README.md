# mongo_restify_server

MIT License(MIT)

A middleware server that sits between your mongodb and server application allowing mongodb to speak in http/s

## Overview

mongo_restify_server supports get, post, put, and delete request

|http method|mongodb method|
|---|---|
|get|find()|
|post|insertOne()|
|put|updateMany()|
|delete|deleteMany()|

Every http method takes different queries, however all of them requires **collection**, which is the location of where the data is stored inside  Mongodb.

## Configuration
        
``` json
    {
        "name": "mongoRestify", // name for server
        "logging": true, // Log to console when request received
        "database_url": "mongodb://192.168.99.100", // url to mongodb
        "port": 80, // port to start server on
        "auth": true, // true to enable authentication from user array below
        "user":[ // user array
            {
                "key": "ce4efc8di3ccag5425ilj6c9u7c502b2", // key to access server
                "name": "test" // name of the key
            },
            {
                "key": "ceeeff8dd01baf53d264251f66c502bc",
                "name": "another key"
            }
        ]
    }
```

## TSL/SSL

To enable TSL/SSL simply place the certificate named "certificate" and key named "key" into the ssl folder.

## Get Request

Get request is used to retrieve information, this performs `find()`.

### sending request

Example:
`http://jiahaokuang.xyz/?collection=user&key=************`
`http://url/?collection=location&key=serverKeyIfenabled`

|query|explanation|
|---|---|
|collection|location of where the data is stored in mongodb|
|key|Server access key in the user config|

### data returned
``` json
{
    error: boolean if error occured it will be true else false
    data: if no error occured this will be the json data return, else it will be error message
}
```

## Post Request

Post request is used to save information, this performs `insertOne()`.

### sending request

Example:
`http://jiahaokuang.xyz/?collection=user&key=************`
`http://url/?collection=location&key=ServerKeyIfenabled`
and request body will be the json you wish to be saved

|query|explanation|
|---|---|
|collection|location of where the data is stored in mongodb|
|key|Server access key in the user config|

request body:
``` json
{
    "username":"jiahaok",
    "password":"password123",
    "name"{
        "first":"jiahao",
        "last":"kuang"
    }
}
```

### data returned

``` json
{
    error: boolean if error occured it will be true else false
    data:{ // if no error occured this will be the json data return, else it will be error message
        ok:1
        n:1
    }
}
```

## Put Request

Put request updates the data in mongodb with new data received, this used `updateMany()`

### sending request

Example:
`http://jiahaokuang.xyz/?collection=user&query={"username":"xyz"}&key=************`
`http://url/?collection=location&query=jsonObject&key=ServerKeyIfenabled`
and request body will be the json you wish to be saved

|query|explanation|
|---|---|
|collection|location of where the data is stored in mongodb|
|query|this javascript object is used to query for the data you want to update|
|key|Server access key in the user config|

request body:
``` json
{
    "username":"jiahaok"
}
```

### data returned

``` json
{
    error: boolean if error occured it will be true else false
    data:{ // if no error occured this will be the json data return, else it will be error message
        ok:1
        nModified:2
        n:2
    }
}
```

## delete request 

The delete request removes element from mongodb, this used `deleteMany()`.

### sending request

Example:
`http://jiahaokuang.xyz/?collection=user&query={"username":"jiahaok"}&key=************`
`http://url/?collection=location&query=jsonObject&key=serverKeyIfenabled`

|query|explanation|
|---|---|
|collection|location of where the data is stored in mongodb|
|query|this javascript object is used to query for the data you want to delete|
|key|Server access key in the user config|

### data returned

``` json
{
    error: boolean if error occured it will be true else false
    data:{ // if no error occured this will be the json data return, else it will be error message
        ok:1
        n:2
    }
}
```

## License
The MIT License (MIT)
Copyright (c) 2016 @JiahaoK(Jiahao Kuang)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.