import React, {useState} from 'react';
import Modal from 'react-modal';
import ProfilePic from '../../pictures/profile-picture.png'
import './EditProfileButton.css'

 function UploadModal(props) {
  
  const {
    isOpen, askToClose,
    onAfterOpen, onRequestClose, onChangeInput,profileId
  } = props;

  const [caption, setCaption] = useState("");
  const [picture, setPicture] = useState();


  const being_update = false

  const uploadPhoto = () => {
    const uploadData = new FormData();

    uploadData.append('picture',picture, picture.name)
    uploadData.append('caption',caption)
    uploadData.append('user',profileId)

    fetch('/api/album/',{
      method: 'POST', 
      body: uploadData
    })
    .then(res =>{
      console.log(res);
      sessionStorage.setItem('upload_modal_stay_open','true')
    })
    .catch(error => {
      console.log(error)
      sessionStorage.setItem('upload_modal_stay_open','true')
    })

  }

  return (
    <Modal
      contentLabel="modalA"
      closeTimeoutMS={150}
      isOpen={isOpen}
      onAfterOpen={onAfterOpen}
      onRequestClose={onRequestClose}
      id="upload-modal">
      <h3>Upload a new photo:</h3>
      {/* <img src={ini_picture} width="170px"></img> */}
      <form className="edit-photo-form">
        <input id="edit-caption" type="text" onChange={(event) => setCaption(event.target.value)} placeholder="What's in this photo?"/><br></br>
        <input className="upload-picture" type="file"  accept="image/jpg, image/jpeg, image/png" onChange={(event) => setPicture(event.target.files[0])}></input>
        <button className="btn btn-primary" onClick={()=> uploadPhoto()}>Submit</button>
      </form>
      <button className="close-edit-button" onClick={askToClose}>X close</button>
    </Modal>
  );
}

export default UploadModal
