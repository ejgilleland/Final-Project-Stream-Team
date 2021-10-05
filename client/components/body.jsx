import React from 'react';
import SmallProfile from './small-profile';
import DeleteProfileModal from './delete-modal';

function Body(props) {
  const profileElements = props.data.map(element => {
    return <SmallProfile key={element.streamerId} id={element.streamerId}
    name={element.displayName} imgUrl={element.profileImgUrl}
    twitch={element.isTwitch} isFav={props.favIds.includes(element.streamerId)}
    recentVideo={element.recentVideo} starClick={props.starClick}
    modalProfileClick={props.modalProfileClick} modalCloser={props.modalCloser}
    modal={((props.modalData.streamerId === element.streamerId) && props.modalData.isOpen)}
    description={element.description} deleteModalClick={props.deleteModalClick}
    channel={element.channelId}/>;
  });
  const searchedProfiles = profileElements.filter(element => element.props.name.toLowerCase().includes(props.searchData.value));
  return (
    <div className="border-radius background-gray body-font flex flex-wrap
    flex-justify-center gap padding-1rem body-margin-breakpoint margin-top-1rem
    margin-bottom-1rem">
      {(props.searchData.isSearching)
        ? (searchedProfiles.length > 0) ? searchedProfiles : 'There\'s nothing here!'
        : profileElements
      }
      {(props.deleteModal.isOpen)
        ? <DeleteProfileModal deleteModal={props.deleteModal} data={props.data}
          deleteModalClose={props.deleteModalClose} deleteYes={props.deleteYes}/>
        : null
      }
    </div>
  );
}

export default Body;
