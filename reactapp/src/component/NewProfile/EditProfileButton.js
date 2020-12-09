import React, { Component }from 'react';
import Modal from 'react-modal';
import MyModal from './profile-modal';

const MODAL_A = 'modal_a';

class EditProfileButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
          currentModal: null,
          modal_stay_open: null
        };
      }

      componentDidMount(){
        if(sessionStorage.getItem('stay_open')==='true'){
          this.setState({
            currentModal: MODAL_A,
            modal_stay_open: true
          },()=>console.log(this.state));
          sessionStorage.setItem('stay_open','false')
        } else {
          this.setState({
            currentModal: null,
            modal_stay_open: false
          },()=>console.log(this.state))
        }
      }


      toggleModal = key => event => {
        console.log(this.state)
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
        sessionStorage.setItem('stay_open','false')
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
                <button type="button" className="btn btn-primary" onClick={this.toggleModal(MODAL_A)}>Edit Profile</button>
                <MyModal
                    title={this.state.title1}
                    // isOpen={currentModal == MODAL_A }
                    isOpen={currentModal == MODAL_A || this.modal_stay_open}
                    onAfterOpen={this.handleOnAfterOpenModal}
                    onRequestClose={this.handleModalCloseRequest}
                    askToClose={this.toggleModal(MODAL_A)}
                    onChangeInput={this.handleInputChange} 
                    profileId={this.props.profileId}
                    ini_picture={this.props.ini_picture}
                    ini_bio={this.props.ini_bio}/>
            </div>
        );
    }
}


  export default EditProfileButton;