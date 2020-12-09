import React, { Component } from 'react';
import Modal from 'react-modal';
import MyModal from './upload-modal';
import './UploadPhotoButton.css'

const MODAL_A = 'modal_a';

class UploadPhotoButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
          currentModal: null,
          modal_stay_open: null
        };
      }

      componentDidMount(){
        if(sessionStorage.getItem('upload_modal_stay_open')==='true'){
          this.setState({
            currentModal: MODAL_A,
            modal_stay_open: true
          },()=>console.log(this.state));
          sessionStorage.setItem('upload_modal_stay_open','false')
        } else {
          this.setState({
            currentModal: null,
            modal_stay_open: false
          },()=>console.log(this.state))
        }
      }


      toggleModal = key => event => {
        // alert(`${this.props.ini_picture}`)
        event.preventDefault();
        if (this.state.currentModal) {
          this.handleModalCloseRequest();
          return;
        }
    
        this.setState({
          ...this.state,
          currentModal: key,
        },()=>{console.log(this.state)});
        
      }
    
      handleModalCloseRequest = () => {
        // opportunity to validate something and keep the modal open even if it
        // requested to be closed
        this.setState({
          ...this.state,
          currentModal: null
        });
        // sessionStorage.removeItem('stay_open')
      }
    
      handleInputChange = e => {
        let text = e.target.value;
        if (text == '') {
        }
        this.setState({ ...this.state});
      }
    
      handleOnAfterOpenModal = () => {
        // when ready, we can access the available refs.
        this.heading && (this.heading.style.color = '#F00');
      }

    render() {
        const { currentModal } = this.state;
        return (
            <div>
                <button className="btn btn-primary" id="upload-photo-btn" onClick={this.toggleModal(MODAL_A)}> Upload Photo</button>
                <MyModal
                    // isOpen={currentModal == MODAL_A }
                    isOpen={currentModal == MODAL_A || this.modal_stay_open}
                    onAfterOpen={this.handleOnAfterOpenModal}
                    onRequestClose={this.handleModalCloseRequest}
                    askToClose={this.toggleModal(MODAL_A)}
                    onChangeInput={this.handleInputChange} 
                    profileId={this.props.profileId}/>
            </div>
        );
    }
}

export default UploadPhotoButton;