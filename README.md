Getting started
===============

Follow these steps to set up a local development environment:

1. Install Mongo.
2. `cd db; ./import_sample_data` (May overwrite content in `freshquest`
    database.)
3. [Build and install Node.js][node_installation] or use one of the pre-built packages.
4. Clone this repository.
5. From the repository folder, run `npm install` to install the modules you need.
6. Run `node index.js`.
7. Open http://localhost:5000/ and you should see the home page.http://localhost:5000/farmers/ should give you a list of several farms.

[node_installation]: https://github.com/joyent/node/wiki/Installation

*Note:* On Windows, `import_sample_data` should run in Cygwin, though we should make a PowerShell version so Cygwin isn't required.

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
