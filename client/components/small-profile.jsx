import React from 'react';

function SmallProfile(props) {
  return (
    <div className="background-rainbow border-radius padding-3px hover">
      <div className="background-black border-radius font-white center-text">
        <div className="header-font">{props.name}</div>
        <div>
          <img className="border-radius-180 max-width-img" src={props.imgUrl} />
        </div>
        <ul className="flex liststyle-none padding-0 margin-0">
          <li className="flex-10">
            { (props.twitch)
              ? <i className="fab fa-twitch"></i>
              : <i className="fab fa-youtube"></i>
            }
          </li>
          <li className="flex-80">
            <a href={
              (props.twitch)
                ? props.recentVideo
                : `https://www.youtube.com/watch?v=${props.recentVideo}`
              } className="font-yellow" target="_blank" rel="noreferrer">Recent Video&nbsp;
              <i className="fas fa-external-link-alt"></i>
            </a>
          </li>
          <li className="flex-10"><i className="font-yellow far fa-star"></i></li>
        </ul>
      </div>
    </div>
  );
}

export default SmallProfile;
