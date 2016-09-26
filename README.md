# ManageIQ Self Service UI

[![Build Status](https://travis-ci.org/ManageIQ/manageiq-ui-self_service.svg)](https://travis-ci.org/ManageIQ/manageiq-ui-self_service)
[![Code Climate](https://codeclimate.com/github/ManageIQ/manageiq-ui-self_service/badges/gpa.svg)](https://codeclimate.com/github/ManageIQ/manageiq-ui-self_service)
[![Dependency Status](https://gemnasium.com/ManageIQ/manageiq-ui-self_service.svg)](https://gemnasium.com/ManageIQ/manageiq-ui-self_service)
[![Security](https://hakiri.io/github/ManageIQ/manageiq-ui-self_service/master.svg)](https://hakiri.io/github/ManageIQ/manageiq-ui-self_service/master)
[![Test Coverage](https://codeclimate.com/github/ManageIQ/manageiq-ui-self_service/badges/coverage.svg)](https://codeclimate.com/github/ManageIQ/manageiq-ui-self_service/coverage)

[![Chat](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ManageIQ/manageiq-ui-self_service?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Translate](https://img.shields.io/badge/translate-zanata-blue.svg)](https://translate.zanata.org/zanata/project/view/manageiq-ui-self_service)
[![License](http://img.shields.io/badge/license-APACHE2-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0.html)

The Service UI (SUI) for the [ManageIQ](http://github.com/ManageIQ/manageiq) project.

## Developer Setup
Logging in to the SUI requires a running instance of ManageIQ. Instructions on how to install ManageIQ can be found 
[here](https://github.com/ManageIQ/guides/blob/master/developer_setup.md).

### Install Repository and Prerequisites

- Have the [ManageIQ](http://github.com/ManageIQ/manageiq) repo cloned into a
  directory named `manageiq`, and ready to be started.
- Have this repo as a sibling to the `manageiq` directory:
`git clone git@github.com:ManageIQ/manageiq-ui-self_service.git`.
- Have nodejs **0.10.46** and npm **3.10.7** installed ([NVM](https://github.com/creationix/nvm) is a popular solution 
to manage node and npm versions).
- Have Ruby version **2.2.2+** and the latest Bundler installed.
  - `gem install bundler`
- Have bower and gulp globally installed.
  - `npm install -g bower gulp`

### Install Dependencies

- `cd manageiq-ui-self_service`
- `bundle install`
- `npm install`
- `bower install`

### Setup
    
- From the `manageiq-ui-self_service` directory, build the production version of
  the SUI. This task  will compile the assets and drop them into the `manageiq/public/self_service` directory.
  - `gulp build`


### Deployment

- From the `manageiq` directory, start the ManageIQ application to initiate the server listening on 
http://localhost:3000 order and serve up the REST API.
  Either one of the following commands can be used.
  - `bundle exec rails server`
  - `bundle exec rake evm:start`
 
- From the `manageiq-ui-self_service` directory, start the development version of
  the self service UI, which will initiate the UI listening on _http://localhost:3001_, and talking to the REST API at
  _http://[::1]:3000_.  This command will also open a browser page to  _http://localhost:3001/self_service/login_.
  - `gulp serve-dev`

### Troubleshooting
- When running ManageIQ with `bundle exec rake evm:start`, it may be necessary to override the REST API host via a 
PROXY\_HOST environment variable.
  - `PROXY_HOST=127.0.0.1:3000 gulp serve-dev`
  
- `ActiveRecord::ConnectionTimeoutError: could not obtain a connection from the pool within 5.000 seconds; all pooled 
connections were in use` or `Error: socket hang up`
might be caused to by lower than expected connection pool size this is remiedie by navitating to 
`manageiq/config/database.yml` and increasing the `pool: xx` value.
- For a full list of gulp tasks available to the SUI.
  - `gulp help`

## Documentation

* [Coding Style and Standards](https://github.com/ManageIQ/manageiq/issues/8781)
* [Internationalization Guidelines](i18n.md)
* [Complete ManageIQ Documentation](https://github.com/ManageIQ/guides/blob/master/README.md)


## License

See [LICENSE.txt](LICENSE.txt)

## Export Notice

By downloading ManageIQ software, you acknowledge that you understand all of the
following: ManageIQ software and technical information may be subject to the
U.S. Export Administration Regulations (the "EAR") and other U.S. and foreign
laws and may not be exported, re-exported or transferred (a) to any country
listed in Country Group E:1 in Supplement No. 1 to part 740 of the EAR
(currently, Cuba, Iran, North Korea, Sudan & Syria); (b) to any prohibited
destination or to any end user who has been prohibited from participating in
U.S. export transactions by any federal agency of the U.S. government; or (c)
for use in connection with the design, development or production of nuclear,
chemical or biological weapons, or rocket systems, space launch vehicles, or
sounding rockets, or unmanned air vehicle systems. You may not download ManageIQ
software or technical information if you are located in one of these countries
or otherwise subject to these restrictions. You may not provide ManageIQ
software or technical information to individuals or entities located in one of
these countries or otherwise subject to these restrictions. You are also
responsible for compliance with foreign law requirements applicable to the
import, export and use of ManageIQ software and technical information.
