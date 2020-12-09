import React, { Component } from 'react';

class CancelRequestButton extends Component {

    cancelRequest = () =>{

        fetch(this.props.cancel_url,{
            method: 'DELETE', 
        })
        .then(res =>{
            console.log(res)
        })
        .then(data => {
            console.log(data)
        window.location.reload();
        })
        .catch((error) => {
            console.error('Error: ', error)
        });
        
    }

    render() {
        return (
            <div>
                <td><button id="cancel-request-btn" className="btn btn-primary" onClick={this.cancelRequest}> Cancel</button></td>
            </div>
        );
    }
}

export default CancelRequestButton;