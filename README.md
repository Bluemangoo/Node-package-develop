# Node Package Develop

Manage your npm modules, especially work on testing, building and publishing.

## Install

```shell
$ npm install -g node-package-develop
```

## Use

Check project:
```shell
$ npd check
```

Build project:
```shell
$ npd build
```

Publish project:
```shell
$ npd build
```

*The publish command will automatically run check and build by default*

## Config

Create file `npd.json` at project's root.

- [check](#check)
- [build](#build)
- [publish](#publish)

### check

- gitTag(boolean, true): whether to check if git tag is existed;  
- npm(boolean, true): whether to check if this version is existed on the registry;
- npmIgnore(boolean, true): whether to check if `npd.json` file is in `.npmignore`;
- projectScripts(boolean, true): whether to run script `check` in `package.json`.

### build

- projectScripts(boolean, true): whether to run script `build` in `package.json`.

### publish

- pretest(boolean, true): whether to run check before publish;
- prebuild(boolean, true): whether to run build before publish;
- gitTag
  - use(boolean, true): whether to tag the current commit;
  - push(boolean, true): whether to push tag to origin after tagging;
  - ignoreError(boolean, false): whether to ignore error on pushing to origins;
  - origins(string[], \[\"origin\"\]):origins to push;
  - output(boolean, false):whether to show git output;
- npm
  - use(boolean, true): whether to publish to npm;
  - changeRegistry(boolean, true): whether to check the registry, and if not npm, change it to npm;
  - output(boolean, true): weather to show npm output;
- projectScripts(boolean, true): whether to run script `publish` in `package.json`.

## Args

- --skip-check: Skip testing before publishing;
- --skip-build: Skip building before publishing.

## Thanks
<a href="https://jb.gg/OpenSourceSupport">
   <img src="https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.png" alt="JetBrains Logo (Main) logo." width="200px" height="200px">
</a>