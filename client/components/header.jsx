import React from 'react';

function Header(props) {
  return (
    <div className="font-white background-black header-font center-text padding-1rem flex flex-align">
      <i className="fas fa-bars bars-icon hover flex-10"></i>
      <h1 className="margin-0 flex-80" >Stream Team</h1>
    </div>
  );
}

export default Header;
