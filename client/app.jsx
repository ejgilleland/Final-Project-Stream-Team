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
          loading: false,
          userId: 1
          // userId temporarily hard coded to 1 until authorization is set up
        });
      })
      .catch(err => console.error(err));
  }

  componentDidMount() {
    this.retrieveData();
  //   const favorites = [];
  //   fetch('/api/favorites')
  //     .then(response => response.json())
  //     .then(data => {
  //       // this.setState({
  //       //   streamers: data,
  //       //   loading: false
  //       // });
  //       // console.log('favdata', data.flat(2));
  //       const resData = data.flat(2)
  //       for(let i = 0; i < (resData.length); i++) {
  //         favorites.push(resData[i]);
  //       }
  //       return fetch('/api/likes');
  //     })
  //     .then(response => response.json())
  //     .then(data => {
  //       const resData = data.flat(2);
  //       const likes = [];
  //       for (let i = 0; i < (resData.length); i++) {
  //         likes.push(resData[i]);
  //       }
  //       const combination = [];
  //       combination.push(favorites, likes);
  //       const streamers = combination.flat(2);
  //       const favIds = favorites.map(element => {
  //         console.log("element:", element);
  //         return element.streamerId;
  //       });
  //       this.setState({
  //         favorites,
  //         favIds,
  //         likes,
  //         streamers,
  //         loading: false,
  //         userId: 1
  //         //userId temporarily hard coded to 1 until authorization is set up
  //       });
  //     })
  //     .catch(err => console.error(err));
  //   // fetch('/api/likes')
  //   //   .then(response => response.json())
  //   //   .then(data => {
  //   //     // this.setState({
  //   //     //   streamers: data,
  //   //     //   loading: false
  //   //     // });
  //   //     console.log('likesdata' data)
  //   //     likes.push(data);
  //   //   })
  //   //   .catch(err => console.error(err));
  //   // console.log('favorites', favorites);
  //   // console.log('likes', likes);
  //   // const streamers = favorites.concat(likes);
  //   //   this.setState({
  //   //     favorites,
  //   //     likes,
  //   //     streamers,
  //   //     loading: false
  //   //   });
  //   // this.setState({
  //   //   streamers: data,
  //   //   loading: false
  //   // });
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
