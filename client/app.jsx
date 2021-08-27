import React from 'react';
import Home from './pages/home';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      favorites: [],
      favIds: [],
      likes: [],
      streamers: [],
      loading: true,
      userId: 0
    };
    this.retrieveData = this.retrieveData.bind(this);
    this.starClickHandler = this.starClickHandler.bind(this);
  }

  retrieveData() {
    const favorites = [];
    fetch('/api/favorites')
      .then(response => response.json())
      .then(data => {
        const resData = data.flat(2);
        for (let i = 0; i < (resData.length); i++) {
          favorites.push(resData[i]);
        }
        return fetch('/api/likes');
      })
      .then(response => response.json())
      .then(data => {
        const resData = data.flat(2);
        const likes = [];
        for (let i = 0; i < (resData.length); i++) {
          likes.push(resData[i]);
        }
        const combination = [];
        combination.push(favorites, likes);
        const streamers = combination.flat(2);
        const favIds = favorites.map(element => {
          return element.streamerId;
        });
        this.setState({
          favorites,
          favIds,
          likes,
          streamers,
          loading: false
        });
      })
      .catch(err => console.error(err));
  }

  componentDidMount() {
    this.setState({ userId: 1 });
    // userId temporarily hard coded to 1 until authorization is set up
    this.retrieveData();
  }

  starClickHandler(event) {
    const streamerId = parseInt(event.target.closest('li').id, 10);
    const init = {
      method: 'POST'
    };
    fetch(`/api/favorites/${this.state.userId}/${streamerId}`, init)
      .then(response => {
        if (response.status === 201) {
          this.retrieveData();
        }
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      (this.state.loading)
        ? null
        : <Home profileInfo={this.state.streamers} favIds={this.state.favIds} starClick={this.starClickHandler}/>
    );
  }
}
