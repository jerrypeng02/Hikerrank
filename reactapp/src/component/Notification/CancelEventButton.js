import React, { Component }from 'react';
import Modal from 'react-modal';
import MyModal from './cancel-event-modal';

const MODAL_A = 'modal_a';

class CancelEventButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
          currentModal: null,
        };
      }

      toggleModal = key => event => {
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
        window.location.reload();
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
                <button type="button" className="btn btn-primary" onClick={this.toggleModal(MODAL_A)}>Cancel</button>
                <MyModal
                    title={this.state.title1}
                    // isOpen={currentModal == MODAL_A }
                    isOpen={currentModal == MODAL_A}
                    onAfterOpen={this.handleOnAfterOpenModal}
                    onRequestClose={this.handleModalCloseRequest}
                    askToClose={this.toggleModal(MODAL_A)}
                    onChangeInput={this.handleInputChange} 
                    cancel_url = {this.props.cancel_url}
                    />
            </div>
        );
    }
}


  export default CancelEventButton;