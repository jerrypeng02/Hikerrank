import React, {useState} from 'react';
import Modal from 'react-modal';


 function NewEventmodal(props) {
  
  const {
    title, isOpen, askToClose,
    onAfterOpen, onRequestClose, onChangeInput,userId,trailId
  } = props;

  const [eventName, setEventName] = useState("");
  const [eventIntro, setEventIntro] = useState("");
  const [eventDate, setEventDate] = useState();
  const [eventHc, setEventHc] = useState();
 

  const apply = () => {
    // console.log(trailId)
    const data = {'name':eventName, 
                  'description': eventIntro, 
                  'event_time': eventDate, 
                  'headcount':eventHc,
                  'initiator':sessionStorage.getItem('id'),
                  'trail_id':trailId}
                  console.log(data)
    // alert(`${eventDate}`)
    fetch('/api/event/',{
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
      })
    .then(res =>{
      // alert(`${res}`)
      // console.log(res);
      sessionStorage.setItem('stay_open','false')
    })
    .catch(error => {
      // console.log(error)
      // alert(`${error}`)
      sessionStorage.setItem('stay_open','true')
    // })
    })
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().substring(0,11) + "00:00"

  return (
    <Modal
      contentLabel="modalA"
      closeTimeoutMS={150}
      isOpen={isOpen}
      onAfterOpen={onAfterOpen}
      onRequestClose={onRequestClose}
      id="new-event-modal">
      <h3>Initiate an event on this trail:</h3>
      <form className="new-event-form">
        <label className="new-event-input">Event Name:  </label>
        <input className="new-event-input" id="event-name" type="text" onChange={(event) => setEventName(event.target.value)} required/><br></br>
        <label className="new-event-input">Event Description:  </label><br></br>
        <input className="new-event-input" id="event-intro" type="text" onChange={(event) => setEventIntro(event.target.value)} required/><br></br>
        <label className="new-event-input">Event Date:  </label>
        <input className="new-event-input" id="event-date" type="datetime-local" min={minDate} onChange={(event) => setEventDate(event.target.value)} required/><br></br>
        <label className="new-event-input">Headcount:  </label>
        <input className="new-event-input" id="event-hc" type="text" onChange={(event) => setEventHc(event.target.value)} required/><br></br>
        <button id="new-event-btn" className="btn btn-primary" onClick={()=> apply()}>Initiate</button>
      </form>
      <button className="close-edit-button" onClick={askToClose}>X close</button>
    </Modal>
  );
}

export default NewEventmodal
