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
      <div className="flex flex-align-end">
        <form className="flex-50" name="search" action="">
          <input type="text" placeholder="Search..." className="width-100pct body-font
          font-size-inherit"
          onChange={props.handleSearchbarChange} />
        </form>
        <div className="flex-20"></div>
        <form className="flex-30" name='sort' action="">
          <label htmlFor="favorite">Prioritize Favorites? </label>
          <input type="checkbox" id="favorite" defaultChecked value="favorite"
            className="body-font font-size-inherit margin-bottom-halfrem"/>
          <select className="width-100pct body-font font-size-inherit">
            <option value="alpha-asc">Alphabetical (ascending)</option>
          </select>
        </form>
      </div>
    </div>
  );
}

export default Subheader;
