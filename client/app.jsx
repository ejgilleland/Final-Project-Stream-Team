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
    const starContainer = event.target.closest('li');
    starContainer.classList.add('font-gray');
    const streamerId = parseInt(starContainer.id, 10);
    const favIds = this.state.favIds;
    const starPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(starContainer.classList.remove('font-gray'));
        reject(new Error('Something went wrong'));
      }, 500);
    });
    if (favIds.includes(streamerId)) {
      const index = favIds.findIndex(element => element === streamerId);
      favIds.splice(index, 1);
      const init = {
        method: 'DELETE'
      };
      fetch(`/api/favorites/${this.state.userId}/${streamerId}`, init)
        .then(response => {
          if (response.status === 204) {
            this.retrieveData();
            return starPromise;
          }
        })
        .catch(err => console.error(err));
    } else {
      favIds.push(streamerId);
      this.setState({ favIds });
      const init = {
        method: 'POST'
      };
      fetch(`/api/favorites/${this.state.userId}/${streamerId}`, init)
        .then(response => {
          if (response.status === 201) {
            this.retrieveData();
            return starPromise;
          }
        })
        .catch(err => console.error(err));
    }
  }

  render() {
    return (
      (this.state.loading)
        ? null
        : <Home profileInfo={this.state.streamers} favIds={this.state.favIds} starClick={this.starClickHandler}/>
    );
  }
}
