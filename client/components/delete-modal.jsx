import React from 'react';

function DeleteProfileModal(props) {
  const indexArray = props.data.map(element => element.streamerId);
  const index = indexArray.indexOf(props.deleteModal.streamerId);
  return (
    <div className="modal-shadow background-grayed-out font-white width-100pct
      height-100pct position-fixed top-0 left-0 z-index" onClick={props.deleteModalClose}>
      <div className="modal-content background-white border-radius
      position-fixed breakpoint-modal-content font-black">
        <div className="center-text flex column padding-halfrem height-100pct">
          <ul className="flex liststyle-none padding-halfrem flex-10
            padding-bottom-0 margin-0 margin-bottom-halfrem">
            <li className="flex-10"></li>
            <li className="flex-80"></li>
            <li className="close flex-10 font-size-26px font-gray"
              onClick={props.deleteModalClose}>
              <i className="fas fa-times-circle close"></i>
            </li>
          </ul>
          <div >
            <h3 className="header-font margin-0 margin-bottom-halfrem">
              Delete this profile?
            </h3>
            <div className="body-font font-size-26px margin-0 padding-halfrem">
              {props.data[index].displayName}
            </div>
            <div className="margin-top-halfrem">
              <img className="border-radius-180 max-width-img larger-image-breakpoint"
                src={(props.data[index].isTwitch)
                  ? `./images/${props.data[index].twitchId}.png`
                  : `./images/${props.data[index].channelId}.png`} />
            </div>
          </div>
          <ul className="flex liststyle-none flex flex-20 padding-0 margin-top-1rem
          padding-bottom-0 margin-0 margin-bottom-halfrem flex-justify-around">
            <li className="flex-10">
              <button className="button hover margin-top-1rem margin-lr-1rem
            font-size-inherit body-font border-radius padding-button font-black
            background-gray border" onClick={props.deleteYes}>
                Yes
              </button>
            </li>
            <li className="flex-10">
              <button className="button delete-closer hover margin-top-1rem margin-lr-1rem
              font-size-inherit body-font border-radius padding-button font-black
              background-gray border" onClick={props.deleteModalClose}>
                No
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DeleteProfileModal;
