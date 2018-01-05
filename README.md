# NetJSON Plugin

Plugin developed by [Aditya Giri](https://github.com/brainbuzzer).

---

## Getting Started

This plugin provides a single function, `sigma.parsers.netjson()`, that will load a NetJSON encoded file, parse it, eventually instantiate sigma and fill the graph with the `graph.read()` method. The main goal is to allow use of NetJSON files in sigma.js.

### Installing

First, add Sigma.js and sigma.parsers.netjson.js to your document.

The most basic way to use this helper is to call it with a path and a container. It will then instanciate sigma, but after having added the graph into the config object.

````javascript
sigma.parsers.netjson(
  'myGraph.json',
  'myContainer'
);
````

## Built With

* [Sigma.js](http://www.sigmajs.org/) - A graphing library

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Aditya Giri** - *Initial work* - [BrainBuzzer](https://github.com/BrainBuzzer)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
