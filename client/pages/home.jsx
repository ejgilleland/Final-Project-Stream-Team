import React from 'react';
import Header from '../components/header';
import Subheader from '../components/subheader';
import Body from '../components/body';

export default function Home(props) {
  return (
    <div>
      <Header />
      <Subheader />
      <Body data={props.profileInfo} favIds={props.favIds} starClick={props.starClick} modalClick={props.modalClick} modalCloser={props.modalCloser} modalData={props.modalData} />
    </div>
  );
}
