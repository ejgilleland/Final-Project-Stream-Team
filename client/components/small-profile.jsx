import React from 'react';
import PopupModal from './popup-modal';

function SmallProfile(props) {
  return (
    <div className="small-profile background-rainbow border-radius padding-3px
    rainbow-wh scaledown-breakpoint" id={props.id}>
      <div className="background-black border-radius font-white center-text
      width-height flex flex-wrap flex-justify-center">
        <div className="header-font flex-80 overflow-wrap height-70px flex
        flex-justify-center flex-align-center padding-halfrem hover"
        onClick={props.modalClick}>
          {props.name}
        </div>
        <div className="hover" onClick={props.modalClick}>
          <img className="border-radius-180 max-width-img" src={props.imgUrl} />
        </div>
        <ul className="flex liststyle-none padding-halfrem margin-0
        flex-align-center">
          <li className="padding-quarter-rem font-size-26px">
            { (props.twitch)
              ? <a href={`https://www.twitch.tv/${props.channel}`}
              target="_blank" rel="noreferrer"><i className="fab fa-twitch
              font-purple "></i></a>
              : <a href={`https://www.youtube.com/channel/${props.channel}`}
              target="_blank" rel="noreferrer"><i className="fab fa-youtube
              font-red"></i></a>
            }
          </li>
          <li className="padding-quarter-rem">
            <a href={
              (props.twitch)
                ? props.recentVideo
                : `https://www.youtube.com/watch?v=${props.recentVideo}`
              } className="font-yellow" target="_blank" rel="noreferrer">
                Recent Video&nbsp;
              <i className="fas fa-external-link-alt"></i>
            </a>
          </li>
          <li className="active font-yellow padding-quarter-rem font-size-26px
          hover" onClick={props.starClick}>
            { (props.isFav)
              ? <i className="fas fa-star"></i>
              : <i className="far fa-star"></i>
            }
          </li>
        </ul>
      </div>
      {(props.modal)
        ? <PopupModal name={props.name} imgUrl={props.imgUrl} twitch={props.twitch}
        recentVideo={props.recentVideo} starClick={props.starClick}
        modalCloser={props.modalCloser} isFav={props.isFav}
        description={props.description} channel={props.channel} />
        : null
      }
    </div>
  );
}

export default SmallProfile;
