# DBCS

Implementation of a microservices architecture for a university project.

___--Developed by Jorge Rebé Martín and Sergio Motrel Bajo--___

This project consisted in the development of three microservices, a web client (SPA) with Angular and its deployment in Docker containers, all orchestrated
using Docker Compose.

## Microservices
1. Microservice for users management, called 'APIPractica', made with Spring.
2. JWT based authentication microservice, developed with ASP.NET - Folder 'APILogin'.
3. Microservice that simulates rooms booking in a hotel, developed with Spring.

## Webclient

There is a webclient built with Angular, from which all the previous services will be accessed. This webclient makes requests to the microservices through an API-Gateway,
in this case Kong, which was configurated using Konga as a GUI. Konga configuration can be found in file 'konga_config_practica3_v5.json'.


## Deployment
The deployment is done in Docker containers, all orchestrated using Docker Compose. Each microservice (excepting the authentication service) uses its own MySQL database.  

In order to deploy it using Docker Compose, you should generate the '.jar' for the microservices developed using Spring. After that, go to the root folder of the project
(where 'docker-compose.yml' file is), and run the following command:

>docker-compose --build-arg Usuarios=Usuarios --build-arg Reservas=Reservas --build-arg password=password

Once all the images have been built, deploy them with the following command:

>docker-compose up

After that, Konga must be configurated. Create an user, and add a conexion called '_Kong_' and URL = _'http://Kong:8001'_

The app should be running correctly at that point. If there are no users in the database, one will be created. Email for that user is '_admin@admin.es_', and the
password is '_admin_'.

To stop the application, run the following command:

>docker-compose down

If you not only want to stop the application, but also remove the volumes declarated in the '_docker-compose'_ file, that is, databases data, run the following:

>docker-compose down -v
