import React from "react";
import ReactDOM from "react-dom";
import ajax from "./common/ajax-functions";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: undefined, city: undefined, data: undefined };
  }

  render() {
      return (
          var barList = <div></div>;
          if (city !== undefined) {
              // barList = <BarList data={this.state.data}/>
          }
          <div id="content">
              <div id="index">

              </div>

              {barList}
          </div>
      );
  }
}

class BarList extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
        var bars = this.props.data.map(function(barData) {
            return <Bar data={barData} />;
        });
        return (
            <div id="barList">
                {bars};
            </div>
        );
    }
}

class Bar extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
        return (
            <div id="bar">
                Bar
            </div>
        );
    }
}

ReactDOM.render((
  <App />
  ), document.getElementById("app"));
