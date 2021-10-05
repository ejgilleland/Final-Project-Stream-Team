import React from 'react';

function LargeProfilePopup(props) {
  const link = (props.twitch)
    ? `https://www.twitch.tv/${props.channel}`
    : `https://www.youtube.com/channel/${props.channel}`;
  return (
    <div className="modal-shadow background-grayed-out font-white width-100pct
    height-100pct position-fixed top-0 left-0" onClick={props.modalCloser}>
      <div className="modal-content background-rainbow border-radius
      position-fixed breakpoint-modal-rainbow">
        <div className="flex column background-black border-radius
        position-fixed breakpoint-modal-content center-text">
          <ul className="flex-10 flex liststyle-none padding-1rem
          padding-bottom-0 margin-0 flex-align-center">
            <li className="flex-10 font-size-26px hover font-red"
            onClick={props.deleteModalClick}>
              <i className="fas fa-trash-alt" ></i>
            </li>
            <li className="flex-80"></li>
            <li className="close flex-10 font-size-26px font-gray"
            onClick={props.modalCloser}>
              <i className="fas fa-times-circle close"></i>
            </li>
          </ul>
          <div className="flex-80">
            <div className="header-font font-weight-600 overflow-wrap
            font-size-26px padding-halfrem">
              <a href={link} target="_blank" className="font-white
              text-decoration-none" rel="noreferrer">{props.name}</a>
            </div>
            <div className="padding-1rem-breakpoint">
              <a href={link} target="_blank" rel="noreferrer">
                <img className="border-radius-180 larger-image-breakpoint"
                src={props.imgUrl} />
              </a>
            </div>
            <div className="modal-text-container-breakpoint margin-lr-1rem">
              <p className="scrolltext scrollbar body-font font-size-22px
              margin-0 text-overflow-scroll hyphens overflow-wrap">
                {props.description}
              </p>
            </div>
          </div>
          <ul className="flex-10 flex liststyle-none padding-1rem margin-0
          flex-align-center">
            <li className="flex-10 font-size-26px">
              {(props.twitch)
                ? <a href={link} target="_blank" rel="noreferrer"><i
                className="fab fa-twitch font-purple "></i></a>
                : <a href={link} target="_blank" rel="noreferrer"><i
                className="fab fa-youtube font-red"></i></a>
              }
            </li>
            <li className="flex-80">
              <a href={
                (props.twitch)
                  ? props.recentVideo
                  : `https://www.youtube.com/watch?v=${props.recentVideo}`
              } className="font-yellow" target="_blank" rel="noreferrer">
                Recent Video&nbsp;
                <i className="fas fa-external-link-alt"></i>
              </a>
            </li>
            <li className="flex-10 font-size-26px hover font-yellow"
            onClick={props.starClick}>
              {(props.isFav)
                ? <i className="fas fa-star"></i>
                : <i className="far fa-star"></i>
              }
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default LargeProfilePopup;
