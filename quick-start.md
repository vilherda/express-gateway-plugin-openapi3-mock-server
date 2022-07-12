# QUICK-START

## 1. Plugin installation

Clone the repo of the plugin locally:

```shell
> git clone https://github.com/vilherda/express-gateway-plugin-openapi3-mock-server.git express-gateway-plugin-openapi3-mock-server
```

Modify the file `package.json` deleting the attribute `bundledDependencies`.

Delete the file `package-lock.json` and execute the NPM install command:

```shell
> rm package-lock.json # I'm not sure if this step is necessary...
> npm install
```

## 2. Base installation

Create an instance of `Express-Gateway`:

```shell
> eg gateway create --name <gateway name> --dir <gateway directory path> --type getting-started
```

## 3. Plugin configuration

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

- Create the OpenAPIv3 compliant custom API definition, by example on `config/custom_openapiv3.yaml`.

- Modify the file `config/system.config.yml` to add a reference to the installed plugin and set up its configuration with the attribute `definitionFile`. But also defining the attribute `package` which indicates where to find its manifest. It must be based on the relative path to the clonation directory:

```yaml
...
plugins:
  express-gateway-plugin-openapi3-mock-server:
    definitionFile: './config/mock-openapi3.yml'
    package: '../express-gateway-plugin-openapi3-mock-server/manifest.js'
...
```

- Modify the file `config/gateway.config.yml` to add the plugin policy references:

```yaml
...
policies:
  ...
  - mock
  ...
pipelines:
  ...
  a_pipeline:
    policies:
      - ...
      - mock:
      - ...
  ...
...
```

## Execution

- Continuing inside the directory of the new `Express-Gateway` instance, execute:

```shell
> npm start
```
