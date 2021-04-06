# OpenEcomm Web

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.7.

## Run on local machine
Install npm modules

  `npm install --save`
## Tips to fix npm related issues

### To Upgrade all dependencies
To update to a new major version all the packages, install the npm-check-updates package globally:
`npm install -g npm-check-updates`

then run it
`ncu -u`

this will upgrade all the version hints in the package.json file, to dependencies and devDependencies, so npm can install the new major version.

You are now ready to run the update:
`npm update`

If you just downloaded the project without the node_modules dependencies and you want to install the shiny new versions first, just run
`npm install --save`

### How to install specific typescript verision. e.g In this project we currently use 4.0.5
`npm install -g typescript@4.0.5`
Check ng version
`ng --version`

### How to upgrade Angular version for your computer/project
`ng update @angular/cli @angular/core`

### How to install latest typescript
`npm install -g typescript@latest`

### How to check outdated dependencies in your project
`npm outdated`



## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
