# Contributing
Any contribution should observe the convention set fourth in the [Code Tour](code_tour.md).
The following must complete without error prior to making a pull request:

1. `yarn run vet`
2. `yarn test`

## Testing
When adding or modifying functionality, unit and integration tests must accompany any changes.
Examples of both state and component tests can be found in `tests/`.
If any notional data is required for the test ensure an appropriately titled folder is created in `tests/mock/`.
