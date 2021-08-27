import React from 'react';

function SmallProfile(props) {
  return (
    <div className="background-rainbow border-radius padding-3px rainbow-wh scaledown-breakpoint">
      <div className="background-black border-radius font-white center-text width-height flex flex-wrap flex-justify-center">
        <div className="header-font flex-80 overflow-wrap height-70px flex flex-justify-center flex-align-center padding-halfrem hover">
          {props.name}
        </div>
        <div className="hover">
          <img className="border-radius-180 max-width-img" src={props.imgUrl} />
        </div>
        <ul className="flex liststyle-none padding-halfrem margin-0 flex-align-center">
          <li className="padding-quarter-rem font-size-26px">
            { (props.twitch)
              ? <i className="fab fa-twitch font-purple "></i>
              : <i className="fab fa-youtube font-red"></i>
            }
          </li>
          <li className="padding-quarter-rem">
            <a href={
              (props.twitch)
                ? props.recentVideo
                : `https://www.youtube.com/watch?v=${props.recentVideo}`
              } className="font-yellow" target="_blank" rel="noreferrer">Recent Video&nbsp;
              <i className="fas fa-external-link-alt"></i>
            </a>
          </li>
          <li className="active font-yellow padding-quarter-rem font-size-26px hover" id={props.id} onClick={props.starClick}>
            { (props.isFav)
              ? <i className="fas fa-star"></i>
              : <i className="far fa-star"></i>
            }
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SmallProfile;
