import React from 'react';

function AddProfileModal(props) {
  return (
    <div className="modal-shadow background-grayed-out font-white width-100pct
    height-100pct position-fixed top-0 left-0 z-index" onClick={props.modalCloser}>
      <div className="modal-content background-white border-radius
      position-fixed breakpoint-modal-content font-black">
        {props.children}
      </div>
    </div>
  );
}

export default AddProfileModal;
