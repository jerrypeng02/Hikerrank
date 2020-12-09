import React, {useState} from 'react';
import Modal from 'react-modal';

 function CancelEventModal(props) {
  
  const { isOpen, askToClose, onAfterOpen, onRequestClose, cancel_url} = props;

  const event_id = String(cancel_url).split("/")[5]

  const cancel = (event) => {
    // get the info about this event
    var event_name = "";
    var event_participants = [];

    fetch(cancel_url,{
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({'event_id':event_id,'status':"cancelled"})
    })
    .then(res =>{
      console.log(res)
    })
    .then(data => {
      alert("The event is cancelled")
      window.location.reload()
    })
    .catch((error) => {
      console.error('Error: ', error)
    });
    
    
  }

  return (
    <Modal
      contentLabel="modalA"
      closeTimeoutMS={150}
      isOpen={isOpen}
      onAfterOpen={onAfterOpen}
      onRequestClose={onRequestClose}
      id="cancel-event-modal">
      <h3>Are you sure you want to cancel this event?</h3>
      <button className="btn btn-primary" onClick={(event)=> cancel()}>Yes</button>
      <button className="close-edit-button" onClick={askToClose}>X close</button>
    </Modal>
  );
}

export default CancelEventModal
