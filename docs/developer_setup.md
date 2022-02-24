# Developer Setup

Logging in to the SUI requires a running instance of ManageIQ. Instructions on how to install ManageIQ can be found
[here](https://github.com/ManageIQ/guides/blob/master/developer_setup.md).

### Install Repository and Prerequisites

- Have the [ManageIQ](http://github.com/ManageIQ/manageiq) repo cloned into a
  directory named `manageiq`, and ready to be started. See [here](https://github.com/ManageIQ/guides/blob/master/developer_setup.md)
  for the steps required to setup ManageIQ.
- Have the SUI repo at the same level as `manageiq/`, this ensures the SUI builds, `yarn build`, into the correct manageiq folder.
  ```
  git clone git@github.com:ManageIQ/manageiq-ui-service.git
  ```
- Have nodejs **v14.x** and npm **6.x.x** installed (npm should be installed with NodeJS)
- If using [nvm](https://github.com/creationix/nvm) you can ensure you are using the correct node version with `nvm use`
- Have yarn (^v1.0.1) globally installed.
  ```
  npm install -g yarn
  ```

### Install Dependencies

```
cd manageiq-ui-service
```
```
yarn
```

### Setup

- From the `manageiq-ui-service` directory, build the production version of
  the SUI. This task  will compile the assets and drop them into the `manageiq/public/ui/service` directory.
  ```
  yarn build
  ```
- If you already have `manageiq` core running on port `:3000` you can verify that the build worked correctly by visiting:
	[http://localhost:3000/ui/service/login](http://localhost:3000/ui/service/)

### Development

- From the `manageiq` directory, start the ManageIQ application to initiate the server listening on
  http://localhost:3000 .

- From the `manageiq-ui-service` directory, start the development version of
  the service UI, which will initiate the UI listening on _http://localhost:3001_, and talking to the REST API at
  _http://[::1]:3000_.  This command will also open a browser page to  _http://localhost:3001/login_.

  ```
  yarn start
  ```

- To use a remote database prepend the `yarn start` command as follows, where the PROXY_PROTOCOL is the asset protocol,
if left empty defaults to `http://`, and PROXY_HOST is the IP address of the asset.

    ```
    PROXY_PROTOCOL=https:// PROXY_HOST=0.0.0.0 yarn start
    ```
