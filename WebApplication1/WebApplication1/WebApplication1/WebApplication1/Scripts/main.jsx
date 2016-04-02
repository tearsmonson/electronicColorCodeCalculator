//initial data of band Color
var bandColor = [
        { index: 0, tolerence: 0, multiplier: 1, color: "black", text: "Black" },
        { index: 1, tolerence: 1, multiplier: 10, color: "brown", text: "Brown" },
        { index: 2, tolerence: 2, multiplier: 100, color: "red", text: "Red" },
        { index: 3, multiplier: 1000, color: "orange", text: "Orange" },
        { index: 4, multiplier: 10000, color: "yellow", text: "Yellow" },
        { index: 5, tolerence: 0.5, multiplier: 100000, color: "green", text: "Green" },
        { index: 6, tolerence: 0.25, multiplier: 1000000, color: "blue", text: "Blue" },
        { index: 7, tolerence: 0.10, multiplier: 10000000, color: "violet", text: "Violet" },
        { index: 8, tolerence: 0.05, color: "grey", text: "Grey" },
        { index: 9, color: "white", text: "White" },
        { index: 10, tolerence: 5, multiplier: 0.1, color: "#FFD700", text: "Gold" },
        { index: 11, tolerence: 10, multiplier: 0.01, color: "#C0C0C0", text: "Silver" },
];



//component image of resistor
var Resistor = React.createClass({
    indexToColour: function (value) {
        return this.props.bandColor[value].color;
    },

    render: function() {
        return (
            <svg width={300} height={70} >
            <rect x={0} y={26} rx={5} width={300} height={7} fill="#d1d1d1" />
            <rect x={50} y={0} rx={15} width={200} height={57} fill="#FDF7EB" />
            <rect id="band1" x={70} y={0} rx={0} width={7} height={57} fill={this.indexToColour(this.props.bands[0])} />
            <rect id="band2" x={100} y={0} rx={0} width={7} height={57} fill={this.indexToColour(this.props.bands[1])} />
            <rect id="band3" x={130} y={0} rx={0} width={7} height={57} fill={this.indexToColour(this.props.bands[2])} />
            <rect id="band4" x={210} y={0} rx={0} width={7} height={57} fill={this.indexToColour(this.props.bands[3])} />
            </svg>
        );
    }

});

//component result of ohm value
var OhmValue = React.createClass({
    ohmResult: function(){
        return this.props.result + "Ω" ;
    },
    render: function() {
        return (
            <div>{this.ohmResult()}</div>
        );
    }
});


//component tolerence
var Tolerence = React.createClass({
    printTolerence: function() {
        return this.props.tolerence === 0 ? "?" : "±" + this.props.tolerence + "%";
    },
    render: function() {
        return (
            <span>{this.printTolerence()}</span>
        );
    }
});

//component selector
var Selector = React.createClass({
    //initialize state
    getInitialState: function () {
        return { indexSelected: 0 };
    },

    //if content in any selector changed
    handleChange: function () {
	console.log("handle Change");
        var index = this.refs.selector.getDOMNode().value;
        this.setState({ indexSelected: index });
        this.props.changeHandler(this.props.band - 1, index);
    },

    render: function () {
        var omit = this;
        var optionNodes = this.props.bandColor.map(function (option) {
            if (omit.props.hidden.indexOf(option.index) === -1) {
                var divStyle = {
                    backgroundColor: option.color
                };
                return <option value={option.index } style={divStyle}>{option.text}</option>
            }          
        })
    return (
      <div>
          <select value={this.state.indexSelected} onChange={this.handleChange } ref="selector">          
            {optionNodes}
          </select>
      </div>
    );
  }
});



//component big brother, component calculator
var CalculateBox = React.createClass({
  getInitialState: function () {
      return { bands: [0, 0, 0, 0], resistance: 0, tolerence: 0, colors: ["black","black","black","black"], data:[] };
  },


//fetch data from server side
  loadTolFromServer: function() {
      console.log("loadTolFromServer");
  var xhr = new XMLHttpRequest();
  xhr.open('get', this.props.urlTol, true);
  xhr.onload = function () {
        var data = JSON.parse(xhr.responseText);    
        this.setState({ tolerence: data });
  }.bind(this);
    xhr.send();

  },

  loadResultFromServer: function () {
      console.log("loadResultFromServer");
      var xhr = new XMLHttpRequest();
      xhr.open('get', this.props.resultUrl, true);
      xhr.onload = function () {
          var data = JSON.parse(xhr.responseText);
          this.setState({ result: data });
      }.bind(this);
      xhr.send();

  },

//send data to server
	onListSubmit: function(e) {
		e.preventDefault();
		var a = this.state.colors[0];
		var b = this.state.colors[1];
		var c = this.state.colors[2];
		var d = this.state.colors[3];
        if (!a || !b || !c || !d) {
            return;
        }
        this.handleListSubmit({bandA: a, bandB: b, bandC: c, bandD: d});
        return;
	},


  handleListSubmit: function(comment) {
    var data = new FormData();
    data.append('bandA', comment.bandA);
    data.append('bandB', comment.bandB);
    data.append('bandC', comment.bandC);
    data.append('bandD', comment.bandD);
	console.log(data.toString());

    var xhr = new XMLHttpRequest();
    xhr.open('post', this.props.submitUrl, true);
    xhr.onload = function() {
        this.loadTolFromServer();
        this.loadResultFromServer();
    }.bind(this);
    xhr.send(data);
  },
      
      
  componentDidMount: function () {
      this.loadTolFromServer();
      this.loadResultFromServer();
      //window.setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },

  calculateTolerence: function () {
      return bandColor[this.state.bands[3]].tolerence;
  },
  updateBandState: function (band, value) {
      var state = this.state;
      state.bands[band] = value;
	  state.colors[band] = bandColor[value].color;
      this.setState(state);
  },



  render: function() {
    return (
      <div className="commentBox">
        <h1>Electronic Color Code Calculator</h1>
        <Resistor bandColor={bandColor} bands={this.state.bands} />
         <form className="commentForm" onSubmit={this.onListSubmit}>
          <Selector bandColor={bandColor} hidden={[10,11,12]} band={1} changeHandler={this.updateBandState} />
          <Selector bandColor={bandColor} hidden={[10, 11, 12]} band={2} changeHandler={this.updateBandState} />
          <Selector bandColor={bandColor} hidden={[10, 11, 12]} band={3} changeHandler={this.updateBandState} />
          <Selector bandColor={bandColor} hidden={[3, 4, 9, 12]} band={4} changeHandler={this.updateBandState} />
          <input type="submit" value="Post" />
         </form>
        <OhmValue result={this.state.result} />
        <Tolerence tolerence={this.state.tolerence} />
      </div>
    );
  } 
});

ReactDOM.render(
  <CalculateBox urlTol="/eletronicColorCode/tol" submitUrl="/eletronicColorCode/submit" resultUrl="/eletronicColorCode/result" pollInterval={2000} />,
  document.getElementById('content')
);