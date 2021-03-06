;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize package:
  sigma.utils.pkg('sigma.parsers');
  sigma.utils.pkg('sigma.utils');

  /**
   * Just an XmlHttpRequest polyfill for different IE versions.
   *
   * @return {*} The XHR like object.
   */
  sigma.utils.xhr = function() {
    if (window.XMLHttpRequest)
      return new XMLHttpRequest();

    var names,
        i;

    if (window.ActiveXObject) {
      names = [
        'Msxml2.XMLHTTP.6.0',
        'Msxml2.XMLHTTP.3.0',
        'Msxml2.XMLHTTP',
        'Microsoft.XMLHTTP'
      ];

      for (i in names)
        try {
          return new ActiveXObject(names[i]);
        } catch (e) {}
    }

    return null;
  };

  /**
   * This function loads a NetJSON file and creates a new sigma instance or
   * updates the graph of a given instance. It is possible to give a callback
   * that will be executed at the end of the process.
   *
   * @param  {string}       url      The URL of the NetJSON file.
   * @param  {object|sigma} sig      A sigma configuration object or a sigma
   *                                 instance.
   * @param  {?function}    callback Eventually a callback to execute after
   *                                 having parsed the file. It will be called
   *                                 with the related sigma instance as
   *                                 parameter.
   */
  sigma.parsers.netjson = function(url, container, callback) {
    var graph = {
            nodes: [],
            edges: []
          },
        file,
        sig = {},
        xhr = sigma.utils.xhr();

    if (!xhr)
      throw 'XMLHttpRequest not supported, cannot load the file.';

    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        file = JSON.parse(xhr.responseText);

        file.nodes.forEach(function (node, i, a) {
          graph.nodes.push({
            id: 'n' + node.id,
            label: 'Node ' + node.id,
            x: Math.cos(Math.PI * 2 * i / a.length),
            y: Math.sin(Math.PI * 2 * i / a.length),
            size: Math.random() + 0.5,
            color: '#' + (
              Math.floor(Math.random() * 16777215).toString(16) + '000000'
            ).substr(0, 6),
            data: {
              ip: node.id
            }
          });
        });
        file.links.forEach(function (link, i) {
          graph.edges.push({
            id: 'e' + i,
            source: 'n' + link.source,
            target: 'n' + link.target,
            size: 1,
            color: '#ccc',
            hover_color: '#000',
            data: {
              source: link.source,
              target: link.target,
              cost: link.cost
            }
          });
        });

        if (typeof sig === 'object') {
          // Set the sigma graph object to graph
          sig.graph = graph;

          // Setup renderer
          sig.renderer = {
            container: container,
            type: 'canvas'
          }

          sig.settings = {
            minEdgeSize: 0.5,
            maxEdgeSize: 4,
            enableEdgeHovering: true,
            edgeHoverSizeRatio: 1,
            edgeHoverExtremities: true,
          }


          // Initiate Sigma
          sig = new sigma(sig);
          
          sig.refresh();

          // Configure the Fruchterman-Reingold algorithm:
          var frListener = sigma.layouts.fruchtermanReingold.configure(sig, {
            iterations: 500,
            easing: 'quadraticInOut',
            duration: 800
          });

          // Bind the events:
          frListener.bind('start stop interpolate', function(e) {
            console.log(e.type);
          });

          // Start the Fruchterman-Reingold algorithm:
          sigma.layouts.fruchtermanReingold.start(sig);

          // Configuration for tooltips
          var config = {
            node: {
              show: 'clickNode',
              cssClass: 'sigma-tooltip',
              position: 'top',
              template:
              '<div class="arrow"></div>' +
              ' <div class="sigma-tooltip-header">{{label}}</div>' +
              '  <div class="sigma-tooltip-body">' +
              '    <table>' +
              '      <tr><th>IP:</th> <td>{{data.ip}}</td></tr>' +
              '    </table>' +
              '  </div>' +
              '  <div class="sigma-tooltip-footer">Number of connections: {{degree}}</div>',
              renderer: function(node, template) {
                // The function context is sig.graph
                node.degree = this.degree(node.id);
                // Returns an HTML string:
                return Mustache.render(template, node);
              }
            },
            edge: {
              show: 'overEdge',
              hide: 'outEdge',
              cssClass: 'sigma-tooltip',
              position: 'top',
              template:
              '<div class="arrow"></div>' +
              ' <div class="sigma-tooltip-header">label</div>' +
              '  <div class="sigma-tooltip-body">' +
              '    <table>' +
              '      <tr><th>Source:</th> <td>{{data.source}}</td></tr>' +
              '      <tr><th>Target:</th> <td>{{data.target}}</td></tr>' +
              '      <tr><th>Cost:</th> <td>{{data.cost}}</td></tr>' +
              '    </table>' +
              '  </div>',
              renderer: function(edge, template) {
                // Returns an HTML string:
                return Mustache.render(template, edge);
              }
            }
          };

          // Instanciate the tooltips plugin with a Mustache renderer for node tooltips:
          var tooltips = sigma.plugins.tooltips(sig, sig.renderers[0], config);
          sig.refresh();
        } else if (typeof sig === 'function') {
          callback = sig;
          sig = null;
        }

        // Call the callback if specified:
        if (callback)
          callback(sig || graph);
      }
    };
    xhr.send();
  };
}).call(this);
