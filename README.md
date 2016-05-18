# health1
habit folder contains the react app


# Code layout
There are two main part to this project (can be viewed as independent of each other)

  - root folder(entry points index html) mainly focus on jquery, css, zurb foundation, Restful api server
  - habit folder (entry points habit.html) focus on ReactJS, Redux and javascript, with modularized codes

1. habit folder -	https://github.com/veagletsui/health1/tree/master/habit/habit
   - environment:
       - Webpack (with babel as loader for es6's import/export and react JSX preset). To build please follow package.json and install the nesscary packages using node.js
       - xampp for localhost server
   - Framework: implemented with ReactJS and ReduxJS and zurb foundation. Modularized codes, minor jquery mainly for two jquery plugins
   - currently it is hardcoded as user (123) for development purposes, if logged in via main page in (root folder Health1 index.html), it will use that user account instead
   - Communication with server (RestApi) is done with ajax

2. root folder (entry points index.html)

3. server
   - environment: xampp
   - framework: Slim
   - RestFul Api

4. Database (mysql)
   - the database schema: http://imgur.com/mDDEqJA
