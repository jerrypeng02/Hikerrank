import React, {useState} from 'react';
import Modal from 'react-modal';
import ProfilePic from '../../pictures/profile-picture.png'
import './EditProfileButton.css'

 function ProfileModal(props) {
  
  const {
    title, isOpen, askToClose,
    onAfterOpen, onRequestClose, onChangeInput,profileId,ini_picture,ini_bio
  } = props;

  const [bio, setBio] = useState("");
  const [picture, setPicture] = useState();


  const updateProfile = (event) => {
    const uploadData = new FormData();

    uploadData.append('picture',picture, picture.name)
    uploadData.append('bio',bio)
    uploadData.append('user',profileId)

    fetch('/api/profile/',{
      method: 'POST', 
      body: uploadData
    })
    .then(res =>{
      sessionStorage.setItem('stay_open','true')
    })
    .catch(error => {
      sessionStorage.setItem('stay_open','true')
    })

  }

  return (
    <Modal
      contentLabel="modalA"
      closeTimeoutMS={150}
      isOpen={isOpen}
      onAfterOpen={onAfterOpen}
      onRequestClose={onRequestClose}
      id="profile-modal">
      <h3>Edit Profile</h3>
      <img src={ini_picture} style={{width: 170, height: 170, borderRadius: 170/ 2}}></img>
      <form className="edit-profile-form">
        <input id="edit-bio" type="text" onChange={(event) => setBio(event.target.value)} placeholder={ini_bio} required/><br></br>
        <input className="upload-picture" type="file"  accept="image/jpg, image/jpeg, image/png" onChange={(event) => setPicture(event.target.files[0])} required></input>
        <button className="btn btn-primary" onClick={(event)=> updateProfile()}>Submit</button>
      </form>
      <button className="close-edit-button" onClick={askToClose}>X close</button>
    </Modal>
  );
}

export default ProfileModal
