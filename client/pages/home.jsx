import React from 'react';
import Header from '../components/header';
import Subheader from '../components/subheader';
import Body from '../components/body';
import PopupModal from '../components/popup-modal';

export default function Home(props) {
  // console.log("homeprops", props);
  // let modalStreamer = props.modalData.streamerId;
  // console.log("homeprops specificmodal id?", props.profileInfo[modalStreamer])
  return (
    <div>
      <Header />
      <Subheader />
      <Body data={props.profileInfo} favIds={props.favIds} starClick={props.starClick} modalClick={props.modalClick} modalData={props.modalData} />
      {/* { (props.modalData.isOpen)
        ? <PopupModal data={props.profileInfo[modalStreamer]} />
        : null
      } */}
    </div>
  );
}
