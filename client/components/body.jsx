import React from 'react';
import SmallProfile from './small-profile';

function Body(props) {
  const profileElements = props.data.map(element => {
    return <SmallProfile key={element.streamerId} id={element.streamerId}
    name={element.displayName} imgUrl={element.profileImgUrl}
    twitch={element.isTwitch} isFav={props.favIds.includes(element.streamerId)}
    recentVideo={element.recentVideo} starClick={props.starClick}
    modalClick={props.modalClick} modalCloser={props.modalCloser}
    modal={((props.modalData.streamerId === element.streamerId) && props.modalData.isOpen)}
    description={element.description}
    channel={(element.isTwitch) ? element.twitchLogin : element.channelId}/>;
  });
  return (
    <div className="border-radius background-gray body-font flex flex-wrap
    flex-justify-center gap padding-1rem body-margin-breakpoint margin-top-1rem
    margin-bottom-1rem">
      {profileElements}
    </div>
  );
}

export default Body;
