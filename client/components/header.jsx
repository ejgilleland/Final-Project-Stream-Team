import React from 'react';

function Header(props) {
  return (
    <div className="font-white background-black header-font font-size-22px
    center-text padding-1rem flex flex-align-center">
      <button className="background-black no-border font-white flex-10 hover"
      onClick={props.dropdownHandler}>
        <i className="dropdown fas fa-bars bars-icon "></i>
      </button>
      <h1 className="margin-0 flex-80 title-breakpoint" >Stream Team</h1>
    </div>
  );
}

export default Header;
