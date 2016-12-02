/* global d3, window, XMLHttpRequest */

/**
 * Define a Tooltip component and interface with Tinier.
 */

var tinier = require('tinier')
var createComponent = tinier.createComponent
var createInterface = tinier.createInterface
var typ = tinier.interfaceTypes
var h = tinier.createElement
var render = tinier.render

// Define styles
var containerStyle = {
  'min-width': '300px',
  'min-height': '120px',
  'border-radius': '4px',
  'border': '2px solid #333',
  'padding': '7px',
  'background-color': '#fff',
  'opacity': '0.9',
  'text-align': 'left',
  'font-size': '18px',
  'font-family': 'sans-serif',
  'color': '#111',
}

var idStyle = {
  'font-size': '22px',
}

var buttonStyle = {
  'border-radius': '3px',
  'background-color': '#eee',
  'border': '1px solid #ddd',
}

// Deal with the BiGG Models button
function getButtonText (status, biggId) {
  if (status === 'error') {
    return biggId + ' not found in BiGG Models'
  } else {
    return ((status === 'checking' ? '(Checking) ' : '') +
            'Open ' + biggId + ' in BiGG Models.')
  }
}

// Create the component
var DefaultTooltip = createComponent({
  displayName: 'DefaultTooltip',

  init: function () {
    return {
      biggId: '',
      name: '',
      loc: { x: 0, y: 0 },
      data: null,
      type: null,
      status: null,
    }
  },

  reducers: {
    setContainerData: function (args) {
      return Object.assign({}, args.state, {
        biggId: args.biggId,
        name: args.name,
        loc: args.loc,
        data: args.data,
        type: args.type,
        status: args.status,
      })
    },

    changeBiggStatus: function (args) {
      return Object.assign({}, args.state, {
        status: args.status,
        url: args.status === 'found' ? args.url : null,
      })
    },
  },

  methods: {
    checkOpenBigg: function (args) {
      var url = ('http://bigg.ucsd.edu/universal/' + args.state.type + 's/' +
                 args.state.biggId)
      if (args.state.status === 'found') {
        window.open(url)
      } else {
        args.reducers.changeBiggStatus({ status: 'checking' })
        const req = new XMLHttpRequest()
        d3.xhr(url, function (error, data) {
          if (error) {
            args.reducers.changeBiggStatus({ status: 'error' })
          } else {
            window.open(url)
            args.reducers.changeBiggStatus({ status: 'found', url: url })
          }
        })
      }
    },
  },

  render: function (args) {
    console.log(args.state.biggId)
    return render(
      args.el,
      h('div',
        { style: containerStyle },
        h('span', { style: idStyle }, args.state.biggId),
        h('br'),
        'name: ' + args.state.name,
        h('br'),
        'data: ' + (args.state.data ? args.state.data : 'no data'),
        h('br'),
        h('button',
          { style: buttonStyle,
            onClick: (args.state.status === 'checking' ? null :
                      args.methods.checkOpenBigg), },
          getButtonText(args.state.status, args.state.biggId)))
    )
  },
})

module.exports = {
  DefaultTooltip: DefaultTooltip,
}
