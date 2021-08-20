import React from 'react';
import Home from './pages/home';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      streamers: [],
      loading: true
    };
  }

  componentDidMount() {
    // const init = {
    //   method: 'GET'
    // }
    fetch('/api/likes')
      .then(response => response.json())
      .then(data => {
        this.setState({
          streamers: data,
          loading: false
        });
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      (this.state.loading)
        ? null
        : <Home profileInfo={this.state.streamers}/>
    );
  }
}
