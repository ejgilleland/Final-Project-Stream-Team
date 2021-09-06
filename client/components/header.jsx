import React from 'react';

function Header(props) {
  return (
    <div className="font-white background-black header-font font-size-22px center-text padding-1rem flex flex-align-center">
      <i className="dropdown fas fa-bars bars-icon hover flex-10" onClick={props.dropdownHandler}></i>
      <h1 className="margin-0 flex-80 title-breakpoint" >Stream Team</h1>
    </div>
  );
}

export default Header;
