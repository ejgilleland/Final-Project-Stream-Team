import React from 'react';
import Header from '../components/header';
import Subheader from '../components/subheader';
import Body from '../components/body';
import DropdownModal from '../components/dropdown-modal';
import AddProfileModal from '../components/add-profile-modal';
import AddProfileContent from '../components/add-profile-content';

export default function Home(props) {
  return (
    <div>
      <Header dropdownHandler={props.dropdownHandler} />
      { (props.dropdown)
        ? <DropdownModal dropdownHandler={props.dropdownHandler}
        addModalClick={props.addModalClick} />
        : null
      }
      { (props.addModalOpen.isOpen)
        ? <AddProfileModal
        modalCloser={props.modalCloser}>
          <AddProfileContent addProfileValidator={props.addProfileValidator} urlChange={props.addProfileChange} submit={props.addProfileSubmit} />
        </AddProfileModal>
        : null
      }
      <Subheader handleSearchbarChange={props.handleSearchbarChange} />
      <Body data={props.profileInfo} favIds={props.favIds}
      starClick={props.starClick} modalProfileClick={props.modalProfileClick}
      modalCloser={props.modalCloser} modalData={props.modalData}
      searchData={props.searchData}/>
    </div>
  );
}
