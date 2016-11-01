# Developer Setup

Logging in to the SUI requires a running instance of ManageIQ. Instructions on how to install ManageIQ can be found
[here](https://github.com/ManageIQ/guides/blob/master/developer_setup.md).

### Install Repository and Prerequisites

- Have the [ManageIQ](http://github.com/ManageIQ/manageiq) repo cloned into a
  directory named `manageiq`, and ready to be started. See [here](https://github.com/ManageIQ/guides/blob/master/developer_setup.md)
  for the steps required to setup ManageIQ.
- Have this repo as a sibling to the `manageiq` directory:
`git clone git@github.com:ManageIQ/manageiq-ui-service.git`.
- Have nodejs **v6.7.0** and npm **3.10.3** installed (npm should be installed with NodeJS)
- Have yarn and gulp globally installed.
  - `npm install -g yarn gulp`

### Install Dependencies

- `cd manageiq-ui-service`
- `yarn install`

### Setup

- From the `manageiq-ui-service` directory, build the production version of
  the SUI. This task  will compile the assets and drop them into the `manageiq/public/ui/service` directory.
  - `gulp build`


### Deployment

- From the `manageiq` directory, start the ManageIQ application to initiate the server listening on
http://localhost:3000 order and serve up the REST API.
  Either one of the following commands can be used.
  - `MIQ_SPARTAN=minimal rake evm:start`
  - `rails s`

- From the `manageiq-ui-service` directory, start the development version of
  the service UI, which will initiate the UI listening on _http://localhost:3001_, and talking to the REST API at
  _http://[::1]:3000_.  This command will also open a browser page to  _http://localhost:3001/ui/service/login_.
  - `gulp serve`
- If you have a local copy of Manage IQ Server installed and would like to start it up at the same time you bring up the service ui web server, run
	- ``` gulp start-manageiq-server ```

If you would like to override the default port (3000) that ManageIQ runs on you can set an environmental variable ``` export MANAGEIQPORT=4000```.  If you are running manageiq in a folder other than _../manageiq/_ then you can override this path set in _gulp/config.js_ and update the _manageiqDir_ variable path.
### Troubleshooting
- When running ManageIQ with `bundle exec rake evm:start`, it may be necessary to override the REST API host via a
PROXY\_HOST environment variable.
  - `PROXY_HOST=127.0.0.1:3000 gulp serve`

- `ActiveRecord::ConnectionTimeoutError: could not obtain a connection from the pool within 5.000 seconds; all pooled
connections were in use` or `Error: socket hang up` or ` Error: connect ECONNREFUSED`
might be caused to by lower than expected connection pool size this is remedied by navigating to
`manageiq/config/database.yml` and increasing the `pool: xx` value.
- For a full list of gulp tasks available to the SUI.
  - `gulp help`
