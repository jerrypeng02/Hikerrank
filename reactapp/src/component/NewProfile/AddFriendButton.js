import React, { Component } from 'react';

class AddFriendButton extends Component {
    constructor(props) {
        super(props);
        
        this.state={
            profile_id: this.props.profileId,
            user_id:sessionStorage.getItem('id'),
            button_display: null,
            url: null
        }
    }

    componentDidMount(){
        fetch('/api/follow-unfollow/')
        .then(res => res.json())
        .then(data =>{
            var data_size = Object.keys(data).length
            if (data_size===0) {
                this.setState({
                    ...this.state,
                    button_display: 'Follow'
                },()=>{console.log(this.state)})
                return;
            } 
            for (let index = 0; index < data_size; index++) {
                const element = data[index];
                let user_url = String(element['user'])
                let following_url = String(element['following'])
                // if following
                if (user_url.split("/").includes(String(this.state.user_id)) & 
                    following_url.split("/").includes(String(this.state.profile_id))){
                        this.setState({
                            ...this.state,
                            button_display: 'Unfollow',
                            url: element['url']
                        },()=>{console.log(this.state)})
                        break;
                }
                this.setState({
                    ...this.state,
                    button_display: 'Follow'
                },()=>{console.log(this.state)})
            }
        })
    }

    changeFollowStatus = event => {
        if (this.state.button_display==='Unfollow') {
            fetch(this.state.url, {
                method: 'DELETE',
            })
            .then(res => res.json())
            .then(data => {
                this.setState({
                    button_display: 'Follow',
                    url: null
                },()=>console.log(this.state))
            })
            .catch((error) => {
                console.error('Error: ', error)
            });
        } else {
            const data = {'user_id': this.state.user_id, 'following_id': this.state.profile_id}
            fetch('/api/follow-unfollow/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(data => {
                this.setState({
                    button_display: 'Unfollow',
                },()=>console.log(this.state))
            })
            .catch((error) => {
                console.error('Error: ', error)
            });
        }
        window.location.reload();
    }
    

    render() {
        
        return (
            <div>
                <button className="btn btn-primary" onClick={this.changeFollowStatus}> {this.state.button_display}</button>

            </div>
        );
    }
}

export default AddFriendButton;