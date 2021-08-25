import React from 'react';
import Home from './pages/home';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      favorites: [],
      likes: [],
      streamers: [],
      loading: true
    };
  }

  componentDidMount() {
    const favorites = [];
    fetch('/api/favorites')
      .then(response => response.json())
      .then(data => {
        // this.setState({
        //   streamers: data,
        //   loading: false
        // });
        // console.log('favdata', data);
        favorites.push(data);
        // this.favorites.concat(data);
        // console.log('favs after push: ', favorites)
        return fetch('/api/likes');
      })
      .then(response => response.json())
      .then(data => {
        // this.setState({
        //   streamers: data,
        //   loading: false
        // });
        const likes = data;
        // likes.concat(data);
        const combination = [];
        combination.push(favorites, likes);
        const streamers = combination.flat(2);
        this.setState({
          favorites,
          likes,
          streamers,
          loading: false
        });
      })
      .catch(err => console.error(err));
    // fetch('/api/likes')
    //   .then(response => response.json())
    //   .then(data => {
    //     // this.setState({
    //     //   streamers: data,
    //     //   loading: false
    //     // });
    //     console.log('likesdata' data)
    //     likes.push(data);
    //   })
    //   .catch(err => console.error(err));
    // console.log('favorites', favorites);
    // console.log('likes', likes);
    // const streamers = favorites.concat(likes);
    //   this.setState({
    //     favorites,
    //     likes,
    //     streamers,
    //     loading: false
    //   });
    // this.setState({
    //   streamers: data,
    //   loading: false
    // });
  }

  render() {
    return (
      (this.state.loading)
        ? null
        : <Home profileInfo={this.state.streamers}/>
    );
  }
}
