JS-VASTCLIENT
============

This is a Digital Video Ad Serving Template (VAST) client library in javascript.

To start using it, just download the file in the *build* folder (js-vastclient.js or js-vastclient.min.js) and add it to your project as a regular external js file (in that case it will be in the global variable windows['js-vastclient']), using CommonJS or AMD.



How to build
------------

First you need to init the node_modules (see https://gruntjs.com/getting-started if you are not familiar with Grunt).

    > ./init.sh


Build the library.

    > grunt build


Run the unit tests.

    > grunt test
