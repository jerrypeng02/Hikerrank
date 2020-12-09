import React, { Component } from 'react';

class AcceptButton extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            user_id: null,
            event_id: null,
            status: null
        }
    }
    
    componentWillMount(){
        fetch(this.props.request_url)
        .then(res => res.json())
        .then(data => {
            this.setState({
                user_id: String(data['user']).split("/")[5],
                event_id: String(data['event']).split("/")[5],
            })
        },()=>{console.log(this.state)})
    }

    acceptRequest = () =>{
        const data = {'user_id': this.state.user_id, 'event_id': this.state.event_id, 'status':"Accepted"}
        fetch('/api/processed-request/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => console.log('Success: ', data))
            .catch((error) => {
                console.error('Error: ', error)
            });
        
        fetch(this.props.request_url,{
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

    declineRequest = () =>{
        // console.log("Decline")
        const data = {'user_id': this.state.user_id, 'event_id': this.state.event_id, 'status':"Declined"}
        fetch('/api/processed-request/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => console.log('Success: ', data))
            .catch((error) => {
                console.error('Error: ', error)
            });
        
        fetch(this.props.request_url,{
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
                <td><button className="btn btn-primary" onClick={this.acceptRequest}> Accept</button></td>
                <td><button id="decline-request-btn" className="btn btn-primary" onClick={this.declineRequest}> Decline</button></td>
            </div>
        );
    }
}

export default AcceptButton;