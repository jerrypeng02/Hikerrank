import React, { Component } from 'react'
import axios from 'axios';

class DisplayReviewUserName extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             user_id:this.props.user_id,
             user_name:null,
             profile_url:this.props.profile_url
        }
    }
    componentDidMount(){
        axios.get(`/api/user/${this.state.user_id}/`)
        .then(res=>{
            var username=String(res.data.username)
            this.setState({
                user_name:username
            })
            // console.log(`username is set to be ${this.state.user_name}`)
        })
    }

    render() {
        return (
            <a href={this.state.profile_url} className='username'>{this.state.user_name}</a>
        )
    }
}

export default DisplayReviewUserName
