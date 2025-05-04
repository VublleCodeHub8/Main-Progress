# Backend Tests

This directory contains unit and integration tests for the backend API using Vitest.

## Test Structure

The tests are organized into several categories:

1. **Basic Tests** (`basic.test.js`): Simple tests that demonstrate Vitest functionality including mocking, assertions, and async testing.

2. **Validators Tests** (`validators.test.js`): Unit tests for input validation functions that verify email formats, passwords, usernames, container names, and port numbers.

3. **Utility Tests** (`utils.test.js`): Unit tests for utility functions like date formatting, uptime calculations, cost calculations, pagination, and data filtering.

4. **Integration Tests** (`integration.test.js`): Tests that verify interactions between components, such as the authentication middleware and container controllers working together.

5. **Component Tests**: Individual tests for database, auth, container, and user module functionality.

## Running Tests

You can run the tests using the following npm scripts:

```bash
# Run all tests
npm test

# Run only the passing tests (basic, validators, utils, integration)
npm run test:pass

# Run tests in watch mode (auto-reruns when files change)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## CI Pipeline

The project includes a CI pipeline configured with GitHub Actions that automatically runs the tests and linting on each push and pull request:

- **Linting**: The CI pipeline runs ESLint to enforce code style and catch potential issues.
- **Testing**: The passing tests are run to ensure functionality works as expected.
- **Coverage Reports**: Test coverage reports are generated and uploaded as artifacts.

The CI workflow files are located in the `.github/workflows` directory:
- `lint.yml`: Runs ESLint on the backend code
- `test.yml`: Runs the tests and generates coverage reports
- `ci.yml`: Combined workflow that runs both linting and testing

## Mocking Approach

Our tests use Vitest's mocking capabilities to isolate components:

- **Function Mocks**: Using `vi.fn()` to create mock functions that can be tracked
- **Module Mocks**: Using `vi.mock()` to replace entire modules with mock implementations
- **Spies**: Tracking function calls without altering their behavior

## Test Data

All test data is self-contained within the test files to avoid dependencies on external systems. No database connection is required to run the tests.

## Test Coverage

The unit tests focus on testing:

1. **Input validation**: Ensuring all inputs are properly validated
2. **Error handling**: Verifying errors are caught and handled appropriately
3. **Business logic**: Testing core functionality works as expected
4. **API responses**: Ensuring responses match expected format and status codes

## Adding New Tests

When adding new tests:

1. Create a new test file in the `tests` directory named `<feature>.test.js`
2. Import the functions to test and Vitest testing utilities
3. Create test suites using `describe()` and test cases using `it()`
4. Use `beforeEach()` and `afterEach()` for setup and cleanup
5. Add the test to the appropriate npm scripts if needed

## Testing Best Practices

- Keep tests independent of each other
- Mock external dependencies
- Test both success and failure paths
- Use descriptive test names
- Keep test setup code minimal and focused
- Avoid testing implementation details when possible 