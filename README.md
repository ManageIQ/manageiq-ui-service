# ManageIQ Self Service UI

[![Build Status](https://travis-ci.org/ManageIQ/manageiq-ui-self_service.svg)](https://travis-ci.org/ManageIQ/manageiq-ui-self_service)
[![Code Climate](https://codeclimate.com/github/ManageIQ/manageiq-ui-self_service/badges/gpa.svg)](https://codeclimate.com/github/ManageIQ/manageiq-ui-self_service)
[![Dependency Status](https://gemnasium.com/ManageIQ/manageiq-ui-self_service.svg)](https://gemnasium.com/ManageIQ/manageiq-ui-self_service)
[![Security](https://hakiri.io/github/ManageIQ/manageiq-ui-self_service/master.svg)](https://hakiri.io/github/ManageIQ/manageiq-ui-self_service/master)

[![Chat](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ManageIQ/manageiq-ui-self_service?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Translate](https://img.shields.io/badge/translate-zanata-blue.svg)](https://translate.zanata.org/zanata/project/view/manageiq-ui-self_service)
[![License](http://img.shields.io/badge/license-APACHE2-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0.html)

The Self Service UI for the [ManageIQ](http://github.com/ManageIQ/manageiq) project

## Installation

### Prerequisites

- Install nodejs 6.x and npm 3.x (or newer)
- Install bower and gulp globally: `npm install -g bower gulp`
- Have the [ManageIQ](http://github.com/ManageIQ/manageiq) repo cloned into a
  directory named `manageiq`, and ready to be started.

### Repository and dependencies

- Clone this repo as a sibling to the `manageiq` directory:
  `git clone git@github.com:ManageIQ/manageiq-ui-self_service.git`
- `cd manageiq-ui-self_service`
- `bundle install`
- `npm install`

## Development

- In the `manageiq` directory, start the ManageIQ application with either
  `bundle exec rake evm:start` or `bundle exec rails server`.  This will start
  the server listening on http://localhost:3000, in order to serve up the REST
  API.
- In the `manageiq-ui-self_service` directory, start the development version of
  the self service UI with `gulp serve-dev`, which will start the UI listening
  on http://localhost:3001, and talking to the REST API at
  http://[::1]:3000.  This command will also open a browser page to
  http://localhost:3001/self_service/login.  
  The REST API host can be overriden via a PROXY\_HOST environment variable, for
  example: `PROXY_HOST=127.0.0.1:3000 gulp serve-dev`.

## Deployment

- In the `manageiq-ui-self_service` directory, build the production version of
  the self service UI with `gulp build`.  This will compile the assets and drop
  them into the `manageiq/public/self_service` directory.  The ManageIQ
  application can then be run with either `bundle exec rake evm:start` or
  `bundle exec rails server`, and the self service UI can be accessed at
  http://localhost:3000/self_service.

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
