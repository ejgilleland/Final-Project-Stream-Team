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
      { (props.addModal.isOpen)
        ? <AddProfileModal modalCloser={props.modalCloser}>
            <AddProfileContent screen={props.addScreen} addData={props.addData}
            addError={props.addError} addProfileValidator={props.addProfileValidator}
            urlChange={props.addProfileChange} submit={props.addProfileSubmit}
            clickReset={props.clickReset} clickYes={props.clickYes}
            clickClose={props.clickClose} />
          </AddProfileModal>
        : null
      }
      <Subheader handleSearchbarChange={props.handleSearchbarChange} />
      <Body data={props.profileInfo} favIds={props.favIds}
      starClick={props.starClick} modalProfileClick={props.modalProfileClick}
      modalCloser={props.modalCloser} modalData={props.modalData}
      searchData={props.searchData} deleteModalClick={props.deleteModalClick}
      deleteModal={props.deleteModal} deleteModalClose={props.deleteModalClose}
      deleteYes={props.deleteYes}/>
    </div>
  );
}
