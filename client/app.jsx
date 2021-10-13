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
      },
      dropdown: false,
      profileAdd: {
        isOpen: false,
        urlValue: ''
      },
      addScreen: 0,
      addedStreamer: {
        name: '',
        imgUrl: '',
        streamerId: -1
      },
      profileDelete: {
        isOpen: false,
        streamerId: 0
      },
      error: ''
    };
    this.retrieveData = this.retrieveData.bind(this);
    this.starClickHandler = this.starClickHandler.bind(this);
    this.modalProfileHandler = this.modalProfileHandler.bind(this);
    this.modalCloser = this.modalCloser.bind(this);
    this.handleSearchbarChange = this.handleSearchbarChange.bind(this);
    this.dropdownHandler = this.dropdownHandler.bind(this);
    this.addProfileModalHandler = this.addProfileModalHandler.bind(this);
    this.addProfileSubmit = this.addProfileSubmit.bind(this);
    this.addProfileChange = this.addProfileChange.bind(this);
    this.addProfileValidator = this.addProfileValidator.bind(this);
    this.clickReset = this.clickReset.bind(this);
    this.clickYes = this.clickYes.bind(this);
    this.clickClose = this.clickClose.bind(this);
    this.deleteProfileModalHandler = this.deleteProfileModalHandler.bind(this);
    this.deleteProfileModalCloser = this.deleteProfileModalCloser.bind(this);
    this.deleteProfile = this.deleteProfile.bind(this);
    this.checkUpdatedProfile = this.checkUpdatedProfile.bind(this);
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

  checkUpdatedProfile() {
    const init = {
      method: 'PUT'
    };
    fetch('/api/streamers/current', init)
      .then(response => {
        if (response.ok) { this.retrieveData(); }
      })
      .catch(err => console.error(err));
  }

  componentDidMount() {
    this.setState({ userId: 1 });
    // userId temporarily hard coded to 1 until authorization is set up
    this.checkUpdatedProfile();
    window.setInterval(this.checkUpdatedProfile, 600000);
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

  deleteProfileModalHandler(event) {
    const streamerId = parseInt(event.target.closest('div.small-profile').id, 10);
    this.setState({
      profileDelete: {
        isOpen: true,
        streamerId
      }
    });
  }

  deleteProfileModalCloser(event) {
    if (event.target.className.includes('modal-shadow') ||
      event.target.className.includes('close') ||
      event.target.className.includes('delete-closer')) {
      this.setState({
        profileDelete: {
          isOpen: false,
          streamerId: 0
        }
      });
    }
  }

  deleteProfile() {
    const init = {
      method: 'DELETE'
    };
    if (this.state.favIds.includes(this.state.profileDelete.streamerId)) {
      fetch(`/api/favorites/${this.state.userId}/${this.state.profileDelete.streamerId}`, init)
        .then(response => {})
        .catch(err => console.error(err));
    }
    fetch(`/api/likes/${this.state.userId}/${this.state.profileDelete.streamerId}`, init)
      .then(response => {
        if (response.status === 204) {
          this.setState({
            profileDelete: {
              isOpen: false,
              streamerId: 0
            },
            modal: {
              isOpen: false,
              streamerId: 0
            }
          });
          this.retrieveData();
        }
      }
      )
      .catch(err => console.error(err));
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
    this.setState({ addScreen: 1 });
    event.preventDefault();
    const ytRegex = /(?<!.)(?:https:\/\/(?:www\.|m.)|www\.|m\.)?youtu\.?be\.com\/c(?:hannel)?\/((?:[\w]|-){24})$/i;
    const twitchRegex = /(?<!.)(?:https:\/\/www\.|www.)?(?:twitch\.tv\/)([\w]{3,24})$/i;
    const ytProfile = this.state.profileAdd.urlValue.match(ytRegex);
    const twitchProfile = this.state.profileAdd.urlValue.match(twitchRegex);
    const platform = (ytProfile) ? 'youtube' : 'twitch';
    const channelId = (ytProfile) ? ytProfile[1] : twitchProfile[1].toLowerCase();
    fetch(`/api/streamers/${channelId}/${platform}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          const errorMessage = data.error;
          const cleanText = errorMessage.replace(/\xA0/g, ' ');
          this.setState({
            addedStreamer: {
              name: '',
              imgUrl: '',
              streamerId: -1
            },
            addScreen: 3,
            error: cleanText
          });
        } else {
          this.setState({
            addScreen: 2,
            addedStreamer: {
              name: data.displayName,
              imgUrl: data.profileImgUrl,
              streamerId: data.streamerId
            },
            profileAdd: {
              isOpen: true,
              urlValue: ''
            }
          });
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  clickReset() {
    this.setState({
      addScreen: 0,
      addedStreamer: {
        name: '',
        imgUrl: '',
        streamerId: -1
      }
    });
  }

  clickYes() {
    const init = {
      method: 'POST'
    };
    fetch(`/api/likes/${this.state.userId}/${this.state.addedStreamer.streamerId}`, init)
      .then(response => {
        if (response.ok) {
          this.retrieveData();
          setTimeout(() => {
            this.setState({
              addScreen: 0,
              addedStreamer: {
                name: '',
                imgUrl: '',
                streamerId: -1
              },
              profileAdd: {
                isOpen: false,
                urlValue: ''
              }
            });
          }, 750);
        } else {
          return response.json();
        }
      })
      .then(data => {
        const errorMessage =
        (data)
          ? data.error
          : null;
        if (errorMessage) {
          const cleanText = errorMessage.replace(/\xA0/g, ' ');
          this.setState({
            addedStreamer: {
              name: '',
              imgUrl: '',
              streamerId: -1
            },
            addScreen: 3,
            error: cleanText
          });
        }
      });
  }

  clickClose() {
    this.setState({
      profileAdd: {
        isOpen: false,
        urlValue: ''
      },
      addScreen: 0,
      addedStreamer: {
        name: '',
        imgUrl: '',
        streamerId: -1
      },
      error: ''
    });
  }

  addProfileValidator() {
    const twitch = /(?<!.)(?:https:\/\/www\.|www.)?(?:twitch\.tv\/)(?:[\w]{3,24})$/i;
    const yt = /(?<!.)(?:https:\/\/(?:www\.|m.)|www\.|m\.)?youtu\.?be\.com\/c(?:hannel)?\/((?:[\w]|-){24})$/i;
    const urlCheck = (yt.test(this.state.profileAdd.urlValue) ||
    twitch.test(this.state.profileAdd.urlValue));
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
        addModal={this.state.profileAdd} addScreen={this.state.addScreen}
        addData={this.state.addedStreamer} addError={this.state.error}
        searchData={this.state.search} addProfileChange={this.addProfileChange}
        addProfileValidator={this.addProfileValidator()} addProfileSubmit={this.addProfileSubmit}
        clickReset={this.clickReset} clickYes={this.clickYes} clickClose={this.clickClose}
        deleteModalClick={this.deleteProfileModalHandler}
        deleteModalClose={this.deleteProfileModalCloser}
        deleteModal={this.state.profileDelete} deleteYes={this.deleteProfile}/>

    );
  }
}
