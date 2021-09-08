import React from 'react';

function AddProfileContent(props) {
  return (
    <div className="center-text flex column padding-halfrem height-100pct">
      <ul className="flex liststyle-none padding-halfrem flex-20
          padding-bottom-0 margin-0 margin-bottom-halfrem">
        <li className="flex-10"></li>
        <li className="flex-80"></li>
        <li className="close flex-10 font-size-26px font-gray"
          onClick={props.modalCloser}>
          <i className="fas fa-times-circle close"></i>
        </li>
      </ul>

      <div className="padding-1rem">
        <form>
        <label htmlFor="streamer-url">
          <h3 className="header-font margin-0">Please enter a channel&apos;s URL</h3>
        </label>
          <input className="width-90pct margin-top-1rem body-font font-size-inherit"
            type="url" id="streamer-url" placeholder="https://www.twitch.tv/userName" onChange={props.urlChange}></input>
          <br />
          <input className="button margin-top-1rem font-size-inherit body-font
          border-radius padding-button font-black background-gray border"
            type="submit" value="Submit" required disabled={!props.addProfileValidator} onSubmit={props.submit}/>
        </form>
      </div>

    </div>
  );
}

export default AddProfileContent;
