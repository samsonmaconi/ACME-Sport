import React from 'react';
import axios from 'axios';
import './App.css';
import Footer from './Footer/Footer';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teams: [],
      columns: [],
      search_column: "",
      search_string: ""
    }

  }

  componentDidMount() {
    this.refresh();
  }

  refresh() {
    this.getColumns();
    this.getTeams();
  }

  getColumns() {
    let tempColumns = [];
    axios.get('/api/teams/datacolumns')
      .then((res) => {
        let data = res.data;
        for (let key in data) {
          if (!data.hasOwnProperty(key) || key=="id") continue; //does not filter by team id
          let value = data[key];
          tempColumns.push([key, this.capitalizeFirstLetter(value)]);
        }
        this.setState({ ...this.state, columns: [...tempColumns], search_column: tempColumns[0][0] })
      }).catch((err) => {
        console.log(err)
      });
  }


  getTeams() {
    axios.get('/api/teams')
      .then((res) => {
        this.setState({ ...this.state, teams: res.data })
      }).catch((err) => {
        console.log(err)
      });
  }


  find(e) {
    e.preventDefault()
    axios.get(`/api/teams/filter/${this.state.search_column}/${this.state.search_string}`)
      .then((res) => {
        this.setState({ ...this.state, teams: res.data })
      }).catch((err) => {
        if (err.response.status == 404) {
          alert("No Teams Found Matching Specified Criteria");
        }
      });
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  render() {
    return (
      <div className="App">
        <header>
          <nav className="navbar navbar-expand-md navbar-dark fixed-top">
            <a className="navbar-brand" href="#">ACME Sports</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
              <form className="form-inline mt-2 mt-md-0 ml-auto" onSubmit={this.find.bind(this)}>
                <div className="input-group">
                  <div className="input-group-prepend">
                  <input className="form-control" type="text" value={this.state.search_string}
                    onChange={(e) => this.setState({ search_string: e.target.value })} placeholder="Filter Teams" aria-label="Search" />
                    {/* binding the value of this component to the search_column state value */}
                    <select className="form-control mr-sm-2" value={this.state.search_column}
                      onChange={(e) => this.setState({ search_column: e.target.value })} name="searchColumn" id="searchColumn">
                      {/* Iterates through the columns and add tham as options for the search_column select component */}
                      {
                        this.state.columns.map((column, i) =>
                          <option key={i} value={column[0]}>{"By " + column[1]}</option>
                        )
                      }
                    </select>
                  </div>
                  {/* binding the value of this component to the search_string state value */}
                </div>
                <button className="btn btn-outline-light my-2 my-sm-0" type="submit">Search</button>
              </form>
            </div>
          </nav>
        </header>

        <div className="jumbotron p-4 p-md-5 text-white bg-dark">
          <div className="col-md-6 px-0">
            <h1 className="display-4 font-italic">Title of a longer featured blog post</h1>
            <p className="lead my-3">Multiple lines of text that form the lede, informing new readers quickly and efficiently about what’s most interesting in this post’s contents.</p>
            <p className="lead mb-0"><a href="#" className="text-white font-weight-bold">Continue reading...</a></p>
          </div>
        </div>
        <h1 className="mt-5 pt-4 p-2" style={{ color: "darkblue" }}>The NFL Teams</h1>
        <div className="container mt-5">
          <h4 className="mt-5 pt-4 text-left" style={{ color: "black", fontWeight: 300 }}>AFC Conference</h4>
          <hr />
          <div className="row">
            {/* Iterates through the teams and render their respective display components if they belong to the AFC Conference*/}
            {
              this.state.teams.map((team, i) => team.conference == "AFC" ?
                <div key={i} data-id={team.id} className="col-lg-3 mb-3 mt-5">
                  <svg className="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 140x140"><title>Placeholder</title><rect width="100%" height="100%" fill="#777"></rect></svg>
                  <h3>{team.display_name}</h3>
                  <h4 className="nickname">{team.name + " " + team.nickname}</h4>
                  <span>{team.division + " Division"}</span><br />
                  <p className="mt-4"><a className="btn btn-secondary" href="#" role="button">View stats »</a></p>
                </div>
                : ""
              )
            }
          </div>

          <h4 className="mt-5 pt-4 text-left" style={{ color: "black", fontWeight: 300 }}>NFC Conference</h4>
          <hr />
          <div className="row">
            {/* Iterates through the teams and render their respective display components if they belong to the NFC Conference*/}
            {
              this.state.teams.map((team, i) => team.conference == "NFC" ?
                <div key={i} data-id={team.id} className="col-lg-3 mb-3 mt-5">
                  <svg className="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 140x140"><title>Placeholder</title><rect width="100%" height="100%" fill="#777"></rect></svg>
                  <h3>{team.display_name}</h3>
                  <h4 className="nickname">{team.name + " " + team.nickname}</h4>
                  <span>{team.division + " Division"}</span><br />
                  <p className="mt-4"><a className="btn btn-secondary" href="#" role="button">View stats »</a></p>
                </div>
                : ""
              )
            }
          </div>
          <hr className="featurette-divider" />
          <Footer />
        </div>
      </div>
    );
  }
}



export default App;
