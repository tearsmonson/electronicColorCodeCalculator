var SVGResistor = React.createClass({
    valueToColour: function(value) {
        return this.props.bandOptions[value].color;
    },
    renderBand4:function() {
    	if (this.props.resType == "4bands") {
    		return <rect id="band4" x={160} y={0} rx={0} width={7} height={57} fill={this.valueToColour(this.props.bands[3])} />
    	} else {
    		return <rect id="band4" x={160} y={0} rx={0} width={7} height={57} fill="#FDF7EB" />
    	}
    },
    renderLines:function() {
        return (
            <svg>
            <rect x={72} y={60} rx={0} width={3} height={5} fill="#d1d1d1" />
            <rect x={0} y={62} rx={0} width={73} height={3} fill="#d1d1d1" />
            <rect x={0} y={62} rx={0} width={3} height={50} fill="#d1d1d1" />

            <rect x={102} y={60} rx={0} width={3} height={15} fill="#d1d1d1" />
            <rect x={77} y={72} rx={0} width={25} height={3} fill="#d1d1d1" />
            <rect x={77} y={72} rx={0} width={3} height={45} fill="#d1d1d1" />

            <rect x={132} y={60} rx={0} width={3} height={20} fill="#d1d1d1" />
            <rect x={132} y={77} rx={0} width={20} height={3} fill="#d1d1d1" />
            <rect x={150} y={77} rx={0} width={3} height={30} fill="#d1d1d1" />

            <rect x={162} y={60} rx={0} width={3} height={15} fill="#d1d1d1" />
            <rect x={162} y={72} rx={0} width={65} height={3} fill="#d1d1d1" />
            <rect x={225} y={72} rx={0} width={3} height={50} fill="#d1d1d1" />

            <rect x={212} y={60} rx={0} width={3} height={5} fill="#d1d1d1" />
            <rect x={212} y={62} rx={0} width={100} height={3} fill="red" />
            <rect x={297} y={62} rx={0} width={3} height={50} fill="red" />
            </svg>
        );
    },
    render: function() {
        return (
            <svg width={300} height={70} version="1.1" xmlns="http://www.w3.org/2000/svg">
            <rect x={0} y={26} rx={5} width={300} height={7} fill="#d1d1d1" />
            <rect x={50} y={0} rx={15} width={200} height={57} fill="#FDF7EB" />
            <rect id="band1" x={70} y={0} rx={0} width={7} height={57} fill={this.valueToColour(this.props.bands[0])} />
            <rect id="band2" x={100} y={0} rx={0} width={7} height={57} fill={this.valueToColour(this.props.bands[1])} />
            <rect id="band3" x={130} y={0} rx={0} width={7} height={57} fill={this.valueToColour(this.props.bands[2])} />
            { this.renderBand4() }
            <rect id="band5" x={210} y={0} rx={0} width={7} height={57} fill={this.valueToColour(this.props.bands[4])} />
            </svg>
        );
    }
});


//this is Ohm component
var Ohm = React.createClass({
    formatResult: function() {
        var r = parseFloat(this.props.r);
        if(r >= 1000000) {
            return(r / 1000000).toFixed(1) + "MΩ";
        }
        else if(r >= 1000){
            return (r / 1000).toFixed(1) + "KΩ";
        } else {
            return r.toFixed(1) + "Ω";    
        }
    },
    render: function() {
        return (
            <div>{this.formatResult()}</div>
        );
    }
});

//this is tolerance component
var Tolerance = React.createClass({
    formatTolerance: function() {
        return this.props.tolerance === 0 ? "?" : "±" + this.props.tolerance + "%";
    },
    render: function() {
        return (
            <span>{this.formatTolerance()}</span> 
        );
    }
});

//this is the selector
var Selector = React.createClass({
    getInitialState: function() {
        return {selected: 0};
    },
    handleChange: function() {
        var newValue = this.refs.menu.getDOMNode().value;
        this.setState({selected: newValue});
        this.props.changeHandler(this.props.band - 1, newValue);
    },
    render: function(){
        var that = this;
        var optionNodes = this.props.bandOptions.map(function(option){
            if(that.props.omitOptions.indexOf(option.value) === -1)
                return <option value={option.value}>{option.label}</option>;
        });
        return (
            <div className="bandOption">
                <label>{this.props.band == 5 ? <span>Tolerance</span>:<span>Band {this.props.band}</span>}</label>
                <select ref="menu" value={this.state.selected} onChange={this.handleChange}>
                    {optionNodes}
                </select>
            </div>
        );
    }
});

//calculator component
var ResistanceCalculator = React.createClass({
    calculateResistance: function() {
    	if (this.state.resType == "3bands") { // 3 bands
    		//3 bands
    		return ((10 * this.state.bands[0]) + (1  * this.state.bands[1]))
        			* this.bandOptions[this.state.bands[2]].multiplier;
    	} else {
        	return ((100 * this.state.bands[0]) + (10  * this.state.bands[1]) + (1* this.state.bands[2]))
        			* this.bandOptions[this.state.bands[3]].multiplier;
        }
    },
    calculateTolerance: function() {
        return this.bandOptions[this.state.bands[4]].tolerance;
    },

    bandOptions: [
        {value: 0, 	tolerance: 0, 		multiplier:1,				color: "black", 	label: "Black" },
        {value: 1, 	tolerance: 1, 		multiplier:10,				color: "brown", 	label: "Brown"},
        {value: 2, 	tolerance: 2, 		multiplier:100,				color: "red", 		label: "Red"},
        {value: 3, 						multiplier:1000,			color: "orange", 	label: "Orange"},
        {value: 4, 						multiplier:10000,			color: "yellow", 	label: "Yellow"},
        {value: 5, 	tolerance: 0.5, 	multiplier:100000,			color: "green", 	label: "Green"},
        {value: 6, 	tolerance: 0.25, 	multiplier:1000000,			color: "blue", 		label: "Blue"},
        {value: 7, 	tolerance: 0.10, 	multiplier:10000000,		color: "violet", 	label: "Violet"},
        {value: 8, 	tolerance: 0.05, 								color: "grey", 		label: "Grey"},
        {value: 9, 													color: "white", 	label: "White"},
        {value: 10,	tolerance: 5, 		multiplier:0.1,				color: "#FFD700", 	label: "Gold"},
        {value: 11,	tolerance: 10, 		multiplier:0.01,			color: "#C0C0C0", 	label: "Silver"},
    ],

    updateBandState: function(band, value) {
        var state = this.state;
        state.bands[band] = value;
        state.resistance = this.calculateResistance();
        state.tolerance = this.calculateTolerance();
        this.setState(state);
    },
    getInitialState: function() {
        return {bands: [0,0,0,0,0], resistance: 0, tolerance: 0, resType:"3bands"};
    },
    updateType: function(event) {
    	var state = this.state;
        state.resType = event.target.value;
        state.resistance = this.calculateResistance();
        state.tolerance = this.calculateTolerance();
        this.setState(state);
    },
    renderThridBand: function() {
    	if (this.state.resType == "4bands") {
        	return <BandSelector bandOptions={this.bandOptions} omitOptions={[8,9]}   band={4} changeHandler={this.updateBandState} />
        } else {
        	return <div></div>
        }
    },

    render: function() {
        return (
            <div className={"resistorComputer"}>
                <div className={"resType"}>
                  <label>
                    My resistor has 
                    <input type="radio" checked={this.state.resType == "3bands" ? true: null} onChange={this.updateType} name="resType" value="3bands"/>3 bands
                    <input type="radio" checked={this.state.resType == "4bands" ? true: null} onChange={this.updateType} name="resType" value="4bands"/>4 bands
                  </label>
                </div>
                <BandSelector bandOptions={this.bandOptions} omitOptions={[10,11, 12]} band={1} changeHandler={this.updateBandState} />
                <BandSelector bandOptions={this.bandOptions} omitOptions={[10,11, 12]} band={2} changeHandler={this.updateBandState} />
                <BandSelector bandOptions={this.bandOptions} omitOptions={[10,11, 12]} band={3} changeHandler={this.updateBandState} />
                {this.renderThridBand()}
                <BandSelector bandOptions={this.bandOptions} omitOptions={[3,4,9,12]} band={5} changeHandler={this.updateBandState} />
                <div className={"resistor"}>
                    <SVGResistor bandOptions={this.bandOptions} bands={this.state.bands} resType={this.state.resType}/>
                </div>
                <OhmageIndicator resistance={this.state.resistance} />
                <div className="tolerance-area">(<ToleranceIndicator tolerance={this.state.tolerance} />)</div>

            </div>
            );
    }
});