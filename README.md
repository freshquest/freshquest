Getting started
===============

Follow these steps to set up a local development environment:

0. `git submodule init && git submodule update` if you haven't already.
1. [Install Mongo][] any way you like and get it running.
1. Confirm that Mongo is running. The easiest way is to run 'mongo' in a terminal.
   In case of success, you'll see a Mongo prompt `>`. In case of failure you'll
   get a connection error instead.
2. `cd db; ./import_sample_data` (May overwrite content in `freshquest`
    database.)
3. [Install Node.js][install node].
4. Clone this repository.
5. From the repository folder, run `npm install` to install the modules you need.
6. Run `node index.js`.
7. Open [http://localhost:5000/](http://localhost:5000/) and you should see the
   home page. [http://localhost:5000/api/farm/](http://localhost:5000/api/farm/)
   should give you a bunch of JSON.
   [http://localhost:5000/farmers/](http://localhost:5000/farmers/)
   should give you a list of several farms.

[install node]: http://nodejs.org/
[install mongo]: http://docs.mongodb.org/manual/installation/

*Note:* On Windows, `import_sample_data` should run in Cygwin, though we should make a PowerShell version so Cygwin isn't required.

Learning Angular.js
===================

First, watch some of these [great introductory videos][egghead].

To learn Angular.js you might want to work with the simpler example Jake set up. It's now
in the [angular_example branch][angular_example].

[angular_example]: https://bitbucket.org/freshquest/freshquest-node/commits/all/tip/angular_example
[egghead]: http://www.egghead.io/

API Overview
============

Here's a quick description of the REST API:

`GET /api/:collection/:id?query`

So, for example:

`curl freshquest.herokuapp.com/api/farm`

Gets all the farms

`curl freshquest.herokuapp.com/api/farm/5169e40b9f9477588676e81d`

Gets Lan's Flower Farm

`curl freshquest.herokuapp.com/api/farm?slug=huck_farm`

Gets all the farms with slug property equal to "huck_farm" (there are currently 3 of them).

`POST /api/:collection`

Creates a new object in the db under the specified collection.

`PUT /api/:collection/:id`

Updates the object with the specified id in the specified collection.

`DELETE /api/:collection/:id`

Deletes the object with the specified id in the specified collection.

The collections we have right now are:
* `/api/farm`
* `/api/product_detail`
* `/api/user`

I just stuck the JSON files straight into the database, without really worrying about whether this would be the schema we'd like to stick with - this is a topic that requires a separate discussion.

Getting set up for deployment
=============================

`heroku git:remote -a freshquest`

Deployment
==========

1. `git push heroku master`
2. Open http://freshquest.herokuapp.com

API Documentation
=================

 -  [Express](http://expressjs.com/api.html)
 -  [Node.js Native Mongo driver](http://mongodb.github.io/node-mongodb-native/)
 -  [Angular.js](http://docs.angularjs.org/api/)
 -  [Restangular](https://github.com/mgonto/restangular)
