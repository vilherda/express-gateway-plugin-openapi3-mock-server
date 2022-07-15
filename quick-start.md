# QUICK-START

## 0. DISCLAIMER

Next procedure is necessary only if [the usual plugin installation procedure](https://www.express-gateway.io/docs/cli/plugins/install/) fails.

## 1. Plugin installation (local clonation)

Clone the repo of the plugin locally:

```shell
> git clone https://github.com/vilherda/express-gateway-plugin-openapi3-mock-server.git express-gateway-plugin-openapi3-mock-server
```

Modify the file `package.json` deleting the attribute `bundledDependencies`.

Delete the file `package-lock.json` and execute the NPM install command:

```shell
> rm package-lock.json # I'm not entirely sure if this step is necessary...
> npm install
```

## 2. Base installation of Express-Gateway

Create an instance of `Express-Gateway` in other location outside of the plugin directory:

```shell
> eg gateway create --name <gateway name> --dir <gateway directory path> --type getting-started
```

## 3. Plugin configuration on Express-Gateway instance

- Navigate inside the directory of the new `Express-Gateway` instance:

```shell
> cd <gateway directory path>
```

- Modify the file `package.json` to add the plugin as a dependency but referencing the local directory where its repo has cloned:

```json
...
    "dependencies": {
        ...
        "express-gateway-plugin-custom-openapi3-mock-server": "file:../express-gateway-plugin-custom-openapi3-mock-server",
        ...
    }
...
```

- Create the OpenAPIv3 compliant custom API definition, by example on `config/custom_mock_openapiv3.yaml`.

- Modify the file `config/system.config.yml` to add a reference to the installed plugin and set up its configuration with the attribute `definitionFile`. But also defining the attribute `package` which indicates where to find its manifest. It must be based on the relative path to the clonation directory:

```yaml
...
plugins:
  express-gateway-plugin-openapi3-mock-server:
    definitionFile: './config/custom_mock_openapi3.yml'
    package: '../express-gateway-plugin-openapi3-mock-server/manifest.js'
...
```

- Due to its implementation, it is **not necessary** to add the usual reference to the policies section nor the policies section of the pipeline to the `config / gateway.config.yml` file. But you can continue adding and configure others.

```yaml
...
policies:
  ...
  - log
  ...
pipelines:
  ...
  a_pipeline:
    policies:
      - ...
      - log:
          - action:
              - message: ...
      - ...
  ...
...
```

## 4. Execution

- Continuing inside the directory of the new `Express-Gateway` instance, execute:

```shell
> npm start
```

- If you want/need to increase the trace information to debug the execution, then execute next commands on linux based systems:

```shell
> export LOG_LEVEL="debug"
> npm start
```

or the next one on Windows systems with PowerShell command line:

```shell
> $env:LOG_LEVEL="debug"
> npm start
```
