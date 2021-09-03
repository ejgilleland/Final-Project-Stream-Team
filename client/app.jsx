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
      userId: 0,
      modal: {
        isOpen: false,
        streamerId: 0
      },
      search: {
        isSearching: false,
        value: ''
      }
    };
    this.retrieveData = this.retrieveData.bind(this);
    this.starClickHandler = this.starClickHandler.bind(this);
    this.modalClickHandler = this.modalClickHandler.bind(this);
    this.modalCloser = this.modalCloser.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
    const streamerId = parseInt(event.target.closest('div.small-profile').id, 10);
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
      this.setState(favIds);
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

  modalClickHandler(event) {
    const streamerId = parseInt(event.target.closest('div.small-profile').id, 10);
    this.setState({
      modal: {
        isOpen: true,
        streamerId
      }
    });
  }

  modalCloser(event) {
    if (event.target.className.includes('modal-shadow') ||
    event.target.className.includes('close')) {
      this.setState({
        modal: {
          isOpen: false,
          streamerId: 0
        }
      });
    }
  }

  handleChange(event) {
    this.setState({
      search: {
        isSearching: !!event.target.value.length,
        value: event.target.value.toLowerCase()
      }
    });
  }

  render() {
    return (
      (this.state.loading)
        ? null
        : <Home profileInfo={this.state.streamers} favIds={this.state.favIds}
        starClick={this.starClickHandler} modalClick={this.modalClickHandler}
        modalCloser={this.modalCloser} modalData={this.state.modal}
        handleChange={this.handleChange} searchData={this.state.search}/>
    );
  }
}
