import React from 'react';
import Header from '../components/header';
import Subheader from '../components/subheader';
import Body from '../components/body';
import DropdownModal from '../components/dropdown-modal';

export default function Home(props) {
  return (
    <div>
      <Header dropdownHandler={props.dropdownHandler} />
      { (props.dropdown)
        ? <DropdownModal dropdownHandler={props.dropdownHandler}/>
        : null
      }
      <Subheader handleChange={props.handleChange} />
      <Body data={props.profileInfo} favIds={props.favIds}
      starClick={props.starClick} modalProfileClick={props.modalProfileClick}
      modalCloser={props.modalCloser} modalData={props.modalData}
      searchData={props.searchData}/>
    </div>
  );
}
