import React from 'react';

function Subheader(props) {
  return (
    <div className="header-font margin-lr-5pct">
      <div>
        <h4 className="margin-top-1rem margin-bottom-halfrem">
          Hello, welcome to your Stream Team! Unsure where to start?
          &nbsp;<a href="#" className="font-yellow">Click here!</a>
        </h4>
      </div>
      <div>
        <form action="">
          <input type="text" placeholder="Search..." className="width-50pct"
          onChange={props.handleChange} />
        </form>
      </div>
    </div>
  );
}

export default Subheader;
