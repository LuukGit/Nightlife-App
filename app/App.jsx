import React from "react";
import ReactDOM from "react-dom";
import ajax from "./common/ajax-functions.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: undefined, area: undefined, data: undefined };
    this.handleInput = this.handleInput.bind(this);
    this.submitInput = this.submitInput.bind(this);
  }

  componentDidMount() {
      ajax('GET', "/api/user/:id", "", function(user){
        user = JSON.parse(user);
        if (user){
          this.setState({ user: user });
          if (typeof(Storage) !== "undefined")
          {
              var data = JSON.parse(sessionStorage.getItem("_my_bars"));
              if (data != null) {
                  this.setState({data: data});
              }
          }
        }
      }.bind(this))

  }

  handleInput(e) {
      this.setState({ area: e.target.value})
  }

  submitInput(e) {
      e.preventDefault();
      if (this.state.area !== "" && this.state.area !== undefined) {
        var location = this.state.area.split(" ").join("+");
        ajax("POST", "api/" + location, "", function(data) {
            data = JSON.parse(data);
            this.setState({ data: data.businesses });
        }.bind(this));
      }
  }

  render() {
      var barList = <div></div>;
      if (this.state.data !== undefined) {
          barList = <BarList data={this.state.data} user={this.state.user}/>
      }
      return (
          <div id="content" className="container">
              <div id="index">
                  <h3>Find all bars in your area!</h3>
                  <form onSubmit={this.submitInput}>
                      <div class="input-group">
                        <input type="text" class="form-control" placeholder="What area are you in?" onChange={this.handleInput}></input>
                        <span class="input-group-btn">
                          <button class="btn btn-default" type="submit">Go!</button>
                        </span>
                      </div>
                  </form>
              </div>
              <hr></hr>
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
        var bars = this.props.data.map(function(barData, index) {
            return <Bar key={index} data={this.props.data} index={index} user={this.props.user} />;
        }.bind(this));
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
      this.state = {going: 0};
      this.addUserToGoing = this.addUserToGoing.bind(this);
    }

    componentDidMount() {
        var name = this.props.data[this.props.index].name;
        ajax("GET", "/database/" + name, "", function(data) {
            if (data != "not found") {
                data = JSON.parse(data);
                this.setState({ going: data });
            }
        }.bind(this));
    }

    addUserToGoing() {
        if (!this.props.user) {
            window.location.href = window.location.href + "auth/github";
            sessionStorage.setItem("_my_bars", JSON.stringify(this.props.data));
        }
        else {
            // Add user to going (maybe offer choice yes/no first??)
            var bar = this.props.data[this.props.index];
            ajax("POST", "/database", JSON.stringify({ user: this.props.user, bar: bar}), function(data) {
                data = JSON.parse(data);
                this.setState({ going: data });
            }.bind(this));
        }
    }

    render() {
        // Get the amount of users that are going to this business from the database.
        var data = this.props.data[this.props.index];
        return (
            <div id="bar">
                <img src={data.image_url} alt="bar-thumbnail"></img>
                <p id="name">{data.name}</p>
                <p id="description">{data.snippet_text}</p>
                <button className="btn btn-default" onClick={this.addUserToGoing}>Going {this.state.going}</button>
            </div>
        );
    }
}

ReactDOM.render((
  <App />
  ), document.getElementById("app"));
