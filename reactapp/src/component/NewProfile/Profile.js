import React, { Component } from 'react';
import './Profile.css'
import Nav from '../Nav'
import Search from '../Search'
import SignUpButton from '../Signup/SignUpButton'
import LoginButton from '../Login/LoginButton'
import DropDownMenu from '../DropDownMenu'
import EditProfileButton from './EditProfileButton'
import AddFriendButton from './AddFriendButton'
import UserCheckins from './UserCheckins'
import FriendsList from './FriendsList'
import Footer from '../Footer'
import Album from './Album'
import {Link} from "react-router-dom";

class Profile extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            login_status: sessionStorage.getItem('login_status'),
            username: sessionStorage.getItem('username'),
            profile_id: this.props.match.params['id'],
            profile_username: '',
            profile_bio: '',
            profile_picture: null,
            is_self: false,
            error: null,
            isLoaded: false,

        }
    }

    componentDidMount(){
        const profile_api_url = '/api/profile/'+this.state.profile_id+'/'
        fetch(profile_api_url)
        .then(res => res.json())
        .then(
            result =>{
                if (result['detail']==='Not found.') {
                    this.setState({
                        error: "No such user"
                    });
                    return;
                } else {
                    this.setState({
                        profile_bio:result['bio'],
                        profile_picture:result['picture'],
                    },()=>{console.log(this.state)})
                }
            }
        )
        
        const user_api_url = '/api/user/'+this.state.profile_id+'/'
        fetch(user_api_url)
        .then(res => res.json())
        .then(
            result =>{
                this.setState({
                    profile_username:result['username'],
                },()=>{console.log(this.state)})
            }
        )
    }

    
    render() {
        
        const renderLoginButton = ()=>{
            if(this.state.login_status!=='true'){return (<LoginButton />)} 
            else {return (<p className="welcome-msg">Hello, {this.state.username}! :)</p>)}
          }
      
          const renderSignupButton = ()=>{
            if(this.state.login_status!=='true'){return (<SignUpButton />)} 
            else {return (<DropDownMenu />)}
          }

          const renderEditButton = ()=>{
            if(this.state.profile_id===sessionStorage.getItem('id')){
              return (
                <EditProfileButton profileId={this.state.profile_id} ini_picture={this.state.profile_picture} ini_bio={this.state.profile_bio}/>
              )
            } else {
              return (<AddFriendButton profileId={this.state.profile_id}/>)
            }
          }

        return (
            <div>
                <div className='header-container'>
                    <div><h3 className='title'><Link to='/'>HIKERRANK</Link></h3></div>
                    <Nav />
                    {/* <Search /> */}
                    <div className="welcome-or-buttons">
                    {renderLoginButton()}
                    {renderSignupButton()}
                    </div>
                </div>

                { this.state.error!=null ?
                    (
                        <h3 className="no-such-user-msg">No such user</h3>
                    )
                    :
                    (
                        <div className='content'>
                    <div className='left'>
                        <p id="username">{this.state.profile_username}</p>
                        <img id="profile-page-profile-picture" src={this.state.profile_picture} alt="image" style={{width: 170, height: 170, borderRadius: 170/ 2}} ></img>
                        <div className="bio-box">
                            <p id="bio">{this.state.profile_bio}</p>
                        </div>
                        {renderEditButton()}
                        <FriendsList profileId={this.state.profile_id}/>
                        
                    </div>

                    <div className='right'>
                        <UserCheckins profileId={this.state.profile_id}/>
                        <Album profileId={this.state.profile_id}/>
                    </div>
                </div>
                    )
                    
                }
                

                <Footer />
            </div>
        );
    }
}

export default Profile;