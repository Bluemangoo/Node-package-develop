# Node Package Develop

Manage your npm modules, especially work on testing, building and publishing.

## Install

```shell
$ npm install -g node-package-develop
```

## Use

Test project:
```shell
$ npd test
```

Build project:
```shell
$ npd build
```

Publish project:
```shell
$ npd build
```

*The publish command will automatically run test and build by default*

## Config

Create file `npd.json` at project's root.

- [test](#test)
- [build](#build)
- [publish](#publish)

### test

- gitTag(boolean, true): whether to check if git tag is existed;  
- npm(boolean, true): whether to check if this version is existed on the registry;
- npmIgnore(boolean, true): whether to check if `npd.json` file is in `.npmignore`;
- projectScripts(boolean, true): whether to run script `test` in `package.json`.

### build

- projectScripts(boolean, true): whether to run script `build` in `package.json`.

### publish

- pretest(boolean, true): whether to run test before publish;
- prebuild(boolean, true): whether to run build before publish;
- gitTag(boolean, true): whether to tag the current commit;
- pushGitTag(boolean, true): whether to push tag to origin after tagging;
- npm(boolean, true): whether to publish to npm;
- changeRegistry(boolean, true): whether to check the registry, and if not npm, change it to npm;
- projectScripts(boolean, true): whether to run script `publish` in `package.json`.

## Args

- --skip-test: Skip testing before publishing;
- --skip-build: Skip building before publishing.
