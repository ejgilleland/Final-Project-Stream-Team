import React from 'react';

function DropdownModal(props) {
  return (
    <div className="dropdown background-grayed-out font-white width-100pct
    height-100pct position-fixed toptest left-0 z-index"
    onClick={props.dropdownHandler}>
      <div className="height-100pct dropdown-width-breakpoint background-white ">
        <ul className="body-font liststyle-none center-text padding-1rem margin-0">
          <li className="dropdown margin-top-1rem margin-bottom-1rem font-size-26px overflow-hidden">
            <a href='#' className="font-yellow dropdown" onClick={props.addModalClick}>
              Add a profile
            </a>
          </li>
          <li className="dropdown margin-top-1rem margin-bottom-1rem font-size-26px">
            <a href='#' className="font-red dropdown">
              Log Out &nbsp;
              <i className="fas fa-sign-out-alt"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default DropdownModal;
