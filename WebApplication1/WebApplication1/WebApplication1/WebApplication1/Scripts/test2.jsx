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
    indexToColour: function(value) {
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
    printResistance: function() {
        var resistance = parseFloat(this.props.resistance);
        if(resistance >= 1000000) {
            return(resistance / 1000000).toFixed(1) + "MΩ";
        }
        else if(resistance >= 1000){
            return (resistance / 1000).toFixed(1) + "KΩ";
        } else {
            return resistance.toFixed(1) + "Ω";
        }
    },
    render: function() {
        return (
            <div id="resistorValue">{this.printResistance()}</div>
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
                    color: option.color
                };
                return <option value={option.index } style={divStyle}>{option.text}</option>
            }          
        })
    return (
      <div className="commentList">
          <select value={this.state.indexSelected} onChange={this.handleChange } ref="selector">          
            {optionNodes}
          </select>
      </div>
    );
  }
});



//component big brother, component calculator
var CalculateBox = React.createClass({

//fetch data from server side
  loadCommentsFromServer: function() {
  console.log("loadCommentsFromServer");
    var xhr = new XMLHttpRequest();
    xhr.open('get', this.props.url, true);
    xhr.onload = function() {
      var data = JSON.parse(xhr.responseText);
      this.setState({ data: data });
    }.bind(this);
    xhr.send();
  },

//send data to server
	onListSubmit: function(e) {
		e.preventDefault();
        //var author = this.refs.author.getDOMNode().value.trim();
        //var text = this.refs.text.getDOMNode().value.trim();
        if (!this.state.bands[0] || !this.state.bands[1] || !this.state.bands[2] || !this.state.bands[3]) {
            return;
        }

        this.handleListSubmit({bandA: this.state.bands[0], bandA: this.state.bands[1], bandA: this.state.bands[2], bandA: this.state.bands[3],});
        //this.refs.author.getDOMNode().value = '';
        //this.refs.text.getDOMNode().value = '';
        return;
	}


  handleListSubmit: function(comment) {
  console.log("handleListSubmit");
    var comments = this.state.data;
    var newComments = comments.concat([comment]);
	console.log(comment.toString());
	console.log(comments.toString());
    this.setState({data: newComments});

    var data = new FormData();
	//console.log(typeof(comment.bandA));
    data.append('bandA', comment.bandA);
    data.append('bandB', comment.bandB);
    data.append('bandC', comment.bandC);
    data.append('bandD', comment.bandD);

    var xhr = new XMLHttpRequest();
    xhr.open('post', this.props.submitUrl, true);
    xhr.onload = function() {
      this.loadCommentsFromServer();
    }.bind(this);
    xhr.send(data);
  },
  getInitialState: function () {
      return { bands: [0, 0, 0, 0], resistance: 0, tolerence: 0, data:[] };
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    window.setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },

  calculateResistance: function () {
      return ((100 * this.state.bands[0]) + (10 * this.state.bands[1]) + (1 * this.state.bands[2]))
              * bandColor[this.state.bands[3]].multiplier;
  },
  calculateTolerence: function () {
      return bandColor[this.state.bands[3]].tolerence;
  },
  updateBandState: function (band, value) {
      var state = this.state;
      state.bands[band] = value;
      this.setState(state);
  },



  render: function() {
    return (
      <div className="commentBox">
        <h1>Electronic Color Code Calculator</h1>
        <Resistor bandColor={bandColor} bands={this.state.bands} />
         <form className="commentForm" onSubmit={this.handleListSubmit}>
          <Selector bandColor={bandColor} hidden={[10,11,12]} band={1} changeHandler={this.updateBandState} />
          <Selector bandColor={bandColor} hidden={[10,11,12]} band={2} changeHandler={this.updateBandState} />
          <Selector bandColor={bandColor} hidden={[10,11,12]} band={3} changeHandler={this.updateBandState} />
          <Selector bandColor={bandColor} hidden={[3,4,9,12]} band={4} changeHandler={this.updateBandState} />
          <input type="submit" value="Post" />
         </form>
        <OhmValue resistance={1} />
        <Tolerence tolerence={1} />
      </div>
    );
  } 
});

ReactDOM.render(
  <CalculateBox url="/comments" submitUrl="/comments/new" pollInterval={2000} />,
  document.getElementById('content')
);