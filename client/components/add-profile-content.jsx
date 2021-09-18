import React, { useEffect } from 'react';
import { gsap } from 'gsap';

function AddProfileContent(props) {
  useEffect(() => {
    if (props.screen === 1) {
      gsap.to('.load-spinner', { rotation: 360, duration: 1.5, ease: 'none', repeat: -1 });
    }
  });

  const currentScreen = [
    (
      <div className="padding-1rem margin-top-1rem" key={0}>
        <form onSubmit={props.submit} className="padding-1rem">
          <label htmlFor="streamer-url">
            <h3 className="header-font margin-0 margin-bottom-1rem ">
              Please enter a channel&apos;s URL
            </h3>
          </label>
          <input className="width-90pct margin-top-1rem margin-bottom-1rem
          body-font font-size-inherit"
            type="url" id="streamer-url" placeholder="https://www.twitch.tv/userName"
            onChange={props.urlChange}></input>
          <br />
          <input className="button margin-top-1rem font-size-inherit body-font
          border-radius padding-button font-black background-gray border"
            type="submit" value="Submit" required disabled={!props.addProfileValidator} />
        </form>
      </div>
    ),
    (
      <div className="padding-1rem margin-top-1rem margin-bottom-1rem" key={1}>
        <div className="padding-1rem margin-top-1rem margin-bottom-1rem">
          <h3 className="header-font margin-0">Please wait...</h3>
        </div>
        <h1>
          <i className="fas fa-circle-notch load-spinner"></i>
        </h1>
      </div>
    ),
    (
      <div key={3}>
        <div className="flex-80">
          <h3 className="header-font margin-0 margin-bottom-halfrem">
            Is this the correct profile?
          </h3>
          <div className="body-font font-size-26px margin-0 padding-halfrem">
            {props.addData.name}
          </div>
          <div>
            <img className="border-radius-180 max-width-img" src={props.addData.imgUrl} />
          </div>
        </div>
        <ul className="flex liststyle-none flex flex-20 padding-0 margin-top-1rem
          padding-bottom-0 margin-0 margin-bottom-halfrem flex-justify-around">
          <li className="flex-10">
            <button className="button margin-top-1rem margin-lr-1rem
            font-size-inherit body-font border-radius padding-button font-black
            background-gray border" onClick={props.clickYes}>
              Yes
            </button>
          </li>
          <li className="flex-10">
            <button className="button margin-top-1rem margin-lr-1rem
            font-size-inherit body-font border-radius padding-button font-black
            background-gray border" onClick={props.clickReset}>
              No
            </button>
          </li>
        </ul>
      </div>
    ),
    (
      <div className="flex column flex-80" key={3}>
        <div className="flex-80"></div>
        <div className="flex-80">
          <h3 className="header-font margin-0 margin-top-1rem margin-bottom-1rem">
            An error has occurred:
          </h3>
          <div className="font-red body-font font-size-22px padding-1rem">
            {`"${props.addError}"`}
          </div>
          <div className="body-font font-size-22px margin-top-1rem margin-bottom-1rem">
            Try again?
          </div>
        </div>
        <ul className="flex liststyle-none padding-0 padding-bottom-0 flex-80
           margin-0 margin-bottom-halfrem flex-justify-around margin-top-1rem">
          <li className="flex-10">
            <button className="button margin-top-1rem font-size-inherit body-font
            border-radius padding-button font-black background-gray border"
            onClick={props.clickReset}>
              Yes
            </button>
          </li>
          <li className="flex-10">
            <button className="button margin-top-1rem  font-size-inherit body-font
            border-radius padding-button font-black background-gray border"
            onClick={props.clickClose}>
              No
            </button>
          </li>
        </ul>
      </div>
    )
  ];

  return (
    <div className="center-text flex column padding-halfrem height-100pct">
      <ul className="flex liststyle-none padding-halfrem flex-10
          padding-bottom-0 margin-0 margin-bottom-halfrem">
        <li className="flex-10"></li>
        <li className="flex-80"></li>
        <li className="close flex-10 font-size-26px font-gray"
          onClick={props.modalCloser}>
          <i className="fas fa-times-circle close"></i>
        </li>
      </ul>
      <div>
        {currentScreen[props.screen]}
      </div>
    </div>
  );
}

export default AddProfileContent;
