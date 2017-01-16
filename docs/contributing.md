# Contributing
Any contribution should observe the convention set fourth in the [Code Tour](code_tour.md).
The following must complete without error prior to making a pull request:

1. `yarn vet`
2. `yarn test`

## Testing
When adding or modifying functionality, unit and integration tests must accompany any changes.
Examples of both state and component tests can be found in `tests/`.
If any notional data is required for the test ensure an appropriately titled folder is created in `tests/mock/`.

If you would like to run unit tests for the project, you can run   
```yarn test ```  

If you would like to run the integration tests for the project please ensure you have selenium server installed and running  

- ``` yarn global add protractor ```
- ``` webdriver-manager update ```  
- ``` webdriver-manager start```

Now that your selenium server is running and listening open another terminal window and from the projects root directory, run   
```yarn test:e2e ```