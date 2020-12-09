import React, {useState} from 'react';
import Modal from 'react-modal';


 function EventModal(props) {
  
  const {
    isOpen, askToClose,
    onAfterOpen, onRequestClose, eventId
  } = props;

  const [application, setApplication] = useState("");
 

  const apply = () => {
    
    const data = {'user': sessionStorage.getItem('id'), 'event': eventId, 'text': application}
    fetch('/api/pending-request/',{
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
      })
    .then(res =>{
      console.log(res);
      sessionStorage.setItem('new_event_stay_open','false')
    })
    .catch(error => {
      console.log(error)
      sessionStorage.setItem('new_event_stay_open','true')
    })
  }

  return (
    <Modal
      contentLabel="modalA"
      closeTimeoutMS={150}
      isOpen={isOpen}
      onAfterOpen={onAfterOpen}
      onRequestClose={onRequestClose}
      id="event-modal">
      <h3>Your request to attend:</h3>
      <form className="edit-profile-form">
        <input
            id="edit-apply"
            type="text"
            onChange={(event) => setApplication(event.target.value)}
            placeholder="Please tell the initiator Why you want to attend this event"/><br/>
        <button className="btn btn-primary" onClick={()=> apply()}>Send request</button>
      </form>
      <button className="close-edit-button" onClick={askToClose}>X close</button>
    </Modal>
  );
}

export default EventModal
