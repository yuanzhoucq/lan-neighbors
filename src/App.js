import React, {Component} from 'react';
import {Line as LineChart} from 'react-chartjs'
import './App.css';

class App extends Component {
  state = {
    hosts: [],
    currentHost: '',
    labels: [],
    data: []
  };

  componentDidMount() {
    this.fetchData()
  }


  fetchData() {
    let {currentHost} = this.state;
    let hosts = new Set();
    let labels = [];
    let data = [];

    fetch('/neighbors').then(r => r.json()).then(records => {
      // console.log(records);
      records.reverse();
      records.every((record) => {
        const newHosts = JSON.parse(record[2].split(`'`).join(`"`));
        if (currentHost === '' && newHosts.length > 0) {
          currentHost = newHosts[0]
        }
        return currentHost !== ''
      });
      records.forEach((record, idx) => {
        labels.push((parseInt(record[1].substring(11, 13))+8)%24 + record[1].substring(13, 16));
        const newHosts = JSON.parse(record[2].split(`'`).join(`"`));
        newHosts.forEach(host => hosts.add(host));
        data.push(newHosts.indexOf(currentHost) === -1 ? 0 : 1)
      });
      hosts = Array.from(hosts).sort((a, b) => a.toUpperCase() > b.toUpperCase() ? 1 : -1);
      this.setState({labels, data, hosts, currentHost})
    })
  }

  setHost(host) {
    this.setState({currentHost: host}, () => this.fetchData());
  }

  render() {
    const {labels, data, hosts, currentHost} = this.state;

    const chartOption = {};

    const labels1 = labels.slice(-12);
    const data1 = data.slice(-12);

    const times = Math.ceil(labels.length / 30);
    let tmp = 0;
    let labels2 = [];
    let data2 = [];
    for (let i=0;i<labels.length;i++) {
      tmp += data[i];
      if ((i+1) % times === 0) {
        labels2.push(labels[i]);
        data2.push(tmp);
        tmp = 0
      }
    }

    const dataOptions = {
      fillColor: "rgba(220,220,220,0.2)",
      strokeColor: "rgba(220,220,220,1)",
      pointColor: "rgba(220,220,220,1)",
      pointStrokeColor: "#fff",
      pointHighlightFill: "#fff",
      pointHighlightStroke: "rgba(220,220,220,1)",
    };

    const chartData1 = {
      labels: labels1,
      datasets: [
        {
          data: data1,
          ...dataOptions
        }
      ]
    };

    const chartData2 = {
      labels: labels2,
      datasets: [
        {
          data: data2,
          ...dataOptions
        }
      ]
    };


    const selectableHosts = hosts.map(h =>
      <button disabled={currentHost === h} key={h} onClick={(e) => this.setHost(e.target.innerText)}>{h}</button>);


    const windowWidth = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;

    const width = Math.min(windowWidth * 0.8, 800);

    return (
      <div className="App">
        <header className="App-header">
          <h1>Dorm devices</h1>
          <div>{selectableHosts}</div>
          <p>{currentHost}</p>
          <button onClick={() => this.fetchData()}>Refresh</button>
          <p>Last hour</p>
          <LineChart data={chartData1} option={chartOption} width={width} height="180"/>
          <p>Last 10 hours</p>
          <LineChart data={chartData2} option={chartOption} width={width} height="180"/>

        </header>
        <div>
        </div>
      </div>
    );
  }
}

export default App;
