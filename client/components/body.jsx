import React from 'react';
import SmallProfile from './small-profile';

function Body(props) {
  const profileElements = props.data.map(element => {
    return <SmallProfile key={element.streamerId} name={element.displayName} imgUrl={element.profileImgUrl} twitch={element.isTwitch} recentVideo={element.recentVideo}/>;
  });
  return (
    <div className="border-radius background-gray body-font padding-1rem flex margin-top-1rem">
      {profileElements}
    </div>
  );
}

export default Body;
