
# Contributing Guidelines

Thank you for your interest in contributing to the VSCode Befunge extension! Please read, understand, and agree to the following before making your contribution.

## Workflow

The workflow for this project is pretty standard:

```none
        open issue
            │
            v
           fork
            │
            v
    commit to fix issue
            │
            v
     open pull request
            │
            v
       code review<────────┐
            │   │          │
            │   └─> address feedback
            v
approved, merged, issue closed
            │
            v
         deployed
```

## Bug Reports

Please make sure all bug reports have not already been reported or fixed, and come with a clear description of the situation, effect, expected experience, and, if at all possible, steps to reproduce the bug.

## Feature Requests

Please make sure all feature requests are clear, concise, feasible, useful, and not already implemented or requested.

## Pull Requests

Pull requests for bugs or features are encouraged, but please open an issue first and ensure it has been discussed & approved. Your code will be reviewed as soon as possible; please be willing to accept feedback & and change your pull request as needed.

This project uses TSLint to ensure consistent code style, adapted from the AirBnB code style. Please make sure any contributions match this. You can check whether your code matches this style by running `npm install && npm run lint`.

Make sure the tests pass by using the `npm test` command, and consider adding a new test if appropriate, especially if your PR is a bugfix.

Also ensure that the extension still runs properly after your changes, by using the built in extension debugger in VS Code.

Ideally, we'd like to work with a branch-per-issue policy, as well as a one-commit-per-issue policy. Feel free to make a separate commit when addressing code review comments, or to amend your existing commit. If a new commit is made, it will be squashed into the original before merging.

Preferably you should be using [signed commits](https://help.github.com/en/articles/signing-commits), although this is not required.
