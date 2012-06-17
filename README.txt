The application is released under Diagramo Free License ( http://diagramo.com/license.php )

Details
---------
Bellow is an overview of the application.

If you want to read how to install application read INSTALL.txt
If you want to read the license read LICENSE.txt
If you want to know more about Diagramo copyright read COPYRIGHT.txt



This folder contains:

[/] - this folder
   |--[documents] - all documents related to diagramo: design, specs, sql, etc
   |    |- [apache2_config] - some copy/paste Apache2 settings 
   |    |- [compressor] - used to compress javascripts (based on YUI compressor)
   |    |- [design] - sources for design (images, etc)
   |    |- [google_web_store] - a "shoot in the night" attempt to make Diagramo cloud(y)
   |    |- [httpserver] - a Ptyhon attempt to create a "battery included" diagramo server
   |    |- [jsdoc-toolkit] - the JSDocumentation generator (see http://code.google.com/p/jsdoc-toolkit/w/list)
   |    |- [mailserver] - a fake Python mail server to test emails
   |    |- [qa] - (old) testing QA scenarious
   |    |- [specs] - a lot of heterogeneous specifications
   |    |- [sql] - the MySQL schema and it's diagram (hey, was made before diagramo was created)
   |    |- keycoders.ods - a list of key codes in JavaScript
   |    |- links.txt - various collected links
   |    
   |--[web] - the Diagramo itself
   |    |--[assets] - css, images and othe look & feel files
   |    |--[editor] - the editor itself
   |    |   |--[assets] - css, images and othe look & feel files
   |    |   |--[common] - all the PHP files that makes the server side of the application
   |    |   |--[diagrams] - the place where all the diagrams will be stored
   |    |   |--[exporter] - the SVG to PNG exporter
   |    |   |--[lib] - all the JavaScripts of the web app engine
   |    |   |--[test] - all the tests developer created over time
   |    |   
   |    |--[install] - installer of the application
   |        |-- [assets] - installer's JS, images and CSS
   |        |-- [help] - a basic help for users
   |        |-- [sql]
   |        |       |-- db.bat - creates database, tables and add some fake data
   |        |       |-- create-database.sql - creates ONLY the database
   |        |       |-- create-tables.sql - creates ONLY the tables. Used by installer
   |        |       |-- fake-date.sql - creates some fake users
   |        |-- Echo.class - a simple Java program to see if Java is installed
   |        |-- stepX.php - different steps of installation process
   |        |-- + other
   |    
   |    
   |--README.txt - this file
   |--COPYRIGHT.txt - describe copyright
   |--INSTALL.txt - describes how to install the application
   |--LICENSE.txt - the text version of Diagramo Free License
   |--alex-to-do.txt - Alex's personal mind stack saved in file
    