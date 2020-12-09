import React, { Component } from 'react';
import './FriendsList.css'

class FriendsList extends Component {
    constructor(props) {
        super(props);
        
        this.state={
            profile_id: this.props.profileId,
            dict:{},
            no_friend_msg: null
        }
    }
    
    componentDidMount(){
        var dict = {};
        fetch('/api/follow-unfollow/')
        .then(res => res.json())
        .then( data =>{
            var data_size = Object.keys(data).length

            for (let index = 0; index < data_size; index++) {
                const element = data[index];
                let user_url = element['user']
                let following_url = element['following']
                fetch(user_url)
                .then(res => res.json())
                .then(data => {
                    let fetched_user_id = data['id']
                    if (String(fetched_user_id)===String(this.state.profile_id)) {
                        fetch(following_url)
                        .then(res => res.json())
                        .then(data => {
                            var name = data['username']
                            var id = data['id']
                            dict[name] = '/profile/'+String(id)+'/'
                            this.setState({
                                ...this.state,
                                dict: dict,
                                no_friend_msg:null
                            },console.log(this.state))
                        })
                    } else {
                        console.log("not matched user")
                    }
                })
            }
        })

        if(Object.keys(this.state.dict).length===0 && sessionStorage.getItem('id')===this.state.profile_id){
            this.setState({
                ...this.state,
                no_friend_msg: "You have no friends. Go add some friends!"
            },console.log(this.state))
            return;
        }
        
        if(Object.keys(this.state.dict).length===0 && sessionStorage.getItem('id')!=this.state.profile_id){
            this.setState({
                ...this.state,
                no_friend_msg: "This user currently has no friends"
            },console.log(this.state))
            return;
        }
    }
    

    render() {
         
        return (
            <div className="fl-box">
                <p className="fl-header">CURRENTLY FOLLOWING</p>
                <h4>{this.state.no_friend_msg}</h4>
                {
                    Object.keys(this.state.dict).map((key, index) => (
                        <div>
                            <a key={index} href={this.state.dict[key] } className="friends-list" >{key}</a>
                            <br></br>
                        </div>
                        
                    // <p key={index}> this is my key {key} and this is my value {this.state.dict[key]}</p> 
                    ))
                }
            </div>
        );
    }
}

export default FriendsList;