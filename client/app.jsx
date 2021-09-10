import React from 'react';
import Home from './pages/home';
// import AddProfileContent from './components/add-profile-content';

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
      },
      dropdown: false,
      profileAdd: {
        isOpen: true,
        urlValue: ''
      }
    };
    this.retrieveData = this.retrieveData.bind(this);
    this.starClickHandler = this.starClickHandler.bind(this);
    this.modalProfileHandler = this.modalProfileHandler.bind(this);
    this.modalCloser = this.modalCloser.bind(this);
    this.handleSearchbarChange = this.handleSearchbarChange.bind(this);
    this.dropdownHandler = this.dropdownHandler.bind(this);
    this.addProfileModalHandler = this.addProfileModalHandler.bind(this);
    // this.addProfileModalContent = this.addProfileModalContent.bind(this);
    this.addProfileSubmit = this.addProfileSubmit.bind(this);
    this.addProfileChange = this.addProfileChange.bind(this);
    this.addProfileValidator = this.addProfileValidator.bind(this);
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

  modalProfileHandler(event) {
    const streamerId = parseInt(event.target.closest('div.small-profile').id, 10);
    this.setState({
      modal: {
        isOpen: true,
        streamerId
      }
    });
  }

  addProfileModalHandler(event) {
    this.setState({
      profileAdd: {
        isOpen: true
      }
    });
  }

  addProfileChange(event) {
    this.setState({
      profileAdd: {
        isOpen: true,
        urlValue: event.target.value
      }
    });
  }

  addProfileSubmit(event) {
    const splitUrl = this.state.profileAdd.urlValue.split('/');
    const channelId = splitUrl[splitUrl.length - 1].toLowerCase();
    fetch(`/api/streamers/${channelId}`)
      .then(response => response.json())
      // eslint-disable-next-line no-console
      .then(data => console.log(data));
    event.preventDefault();
  }

  // addProfileModalContent() {
  //   return <AddProfileContent addProfileValidator={this.addProfileValidator()} urlChange={this.addProfileChange} submit={this.addProfileSubmit}/>
  // }

  addProfileValidator() {
    // const twitch = /https:\/\/www\.twitch\.tv\/.+/i;
    const twitch = /https:\/\/www\.twitch\.tv\/[\w]{3,24}$/;
    const yt = /https:\/\/www\.youtube\.com\/channel\/.+/i;
    const urlCheck = (yt.test(this.state.profileAdd.urlValue) || twitch.test(this.state.profileAdd.urlValue));
    return urlCheck;
  }

  modalCloser(event) {
    if (event.target.className.includes('modal-shadow') ||
    event.target.className.includes('close')) {
      this.setState({
        modal: {
          isOpen: false,
          streamerId: 0
        },
        profileAdd: {
          isOpen: false
        }
      });
    }
  }

  dropdownHandler(event) {
    if (event.target.classList.contains('dropdown')) {
      const newDropdown = !(this.state.dropdown);
      this.setState({ dropdown: newDropdown });
    }
  }

  handleSearchbarChange(event) {
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
        starClick={this.starClickHandler} modalProfileClick={this.modalProfileHandler}
        modalCloser={this.modalCloser} modalData={this.state.modal}
        handleSearchbarChange={this.handleSearchbarChange} dropdown={this.state.dropdown}
        dropdownHandler={this.dropdownHandler} addModalClick={this.addProfileModalHandler}
        addModalOpen={this.state.profileAdd}
        searchData={this.state.search}
        addProfileValidator={this.addProfileValidator()} addProfileChange={this.addProfileChange} addProfileSubmit={this.addProfileSubmit}/>

    );
  }
}
