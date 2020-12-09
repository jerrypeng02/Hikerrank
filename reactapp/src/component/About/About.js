import React, { Component } from 'react';
import Footer from '../Footer'
import DropDownMenu from '../DropDownMenu'
import SignUpButton from '../Signup/SignUpButton'
import LoginButton from '../Login/LoginButton'
import Nav from '../Nav'
import evan from '../../pictures/evan.jpg'
import jerry from '../../pictures/jerry.jpeg'
import ariadne from '../../pictures/ariadne.jpeg'
import laura from '../../pictures/laura.jpg'
import prettyPic from '../../pictures/project-intro.png'
import restLogo from '../../pictures/django.png'
import channelLogo from '../../pictures/django-channels.png'
import reactLogo from '../../pictures/react.png'
import mapboxLogo from '../../pictures/mapbox.png'
import websocketLogo from '../../pictures/websocket.png'
import mysqlLogo from '../../pictures/mysql.png'
import awsLogo from '../../pictures/aws.png'
import './About.css'
import {Link} from "react-router-dom";

class About extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
          login_status: sessionStorage.getItem('login_status'),
          username: sessionStorage.getItem('username'),
        }

      }

    render() {
        const renderLoginButton = ()=>{
            if(this.state.login_status!=='true'){
              return (
                  <LoginButton />
              )
            } else {
              return (<p className="welcome-msg">Hello, {this.state.username}! :)</p>)
            }
          }
      
          const renderSignupButton = ()=>{
            if(this.state.login_status!=='true'){
              return (
                  <SignUpButton />
              )
            } else {
              return (<DropDownMenu />)
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
                
                <h2 className="about-heading">About HikerRank</h2>
                <div className="project-intro">
                    <img src={prettyPic} width="200px" height="180px"></img>
                    <p>HikerRank is a map-based website where one can view all available options of nearby hiking trails and also have immediate information about the trail features at the same time. We also want to add social networking features, such as personal hiking reviews, personal page, and friends circle, build a sharing platform, and enable more interactions between hiking fans. 
                        <br></br>
                        <br></br>
                        Start your journey right now by exploring our trails and maps, and create your own profile!
                    </p>
                    
                </div>
                

                <h2>About Us</h2>
                <h3>Team 6 Members</h3>

                <div className="team-intro">
                    <div className="row1">
                        <div className="row-left">
                            <img src={evan} width="150px" className="intro-left"></img>
                            <div className="intro-right">
                                <p className="people-name">Ningduo Zhao</p>
                                <p className="people-intro">This is Evan here. I am a first-year MISM-BIDA student at CMU. Hope you like our site and enjoy your next hiking trip!</p>
                            </div>
                            
                            
                        </div>
                        <div className="row-right">
                            <img src={ariadne} width="150px" className="intro-left"></img>
                            <div className="intro-right">
                                <p className="people-name">Ruoqi Bai</p>
                                <p className="people-intro">This is Ariadne who studied architecture design but started coding everyday since arriving at CMU. Going out for a hike is the best activity in this time of quarantine, isn't it?</p>
                            </div>
                        </div>
                    </div>

                    <div className="row2">
                    <div className="row-left">
                        <img src={jerry} width="150px" className="intro-left"></img>
                        <div className="intro-right">
                            <p className="people-name">Ningyang Peng</p>
                            <p className="people-intro">My name is Jerry. I am studying Electrical and Computer Engineering at CMU. Wish you the best experience in browing our hiking website!</p>
                        </div>
                    </div>
                    <div className="row-right">
                        <img src={laura} width="150px" className="intro-left"></img>
                        <div className="intro-right">
                            <p className="people-name">Yuchen Xie</p>
                            <p className="people-intro">This is Laura, I am a second year MISM-BIDA student in Heinz College. We spent a lot of time working on this project, so please give us a thumbs-up!</p>
                        </div>
                    </div>
                        
                    </div>
                </div>

                
                <div className="powered">
                    <h2>Powered By</h2>
                    <img src={restLogo} height="70px"></img>
                    <img src={channelLogo} height="70px"></img>
                    <img src={reactLogo} height="70px"></img>
                    <img src={mysqlLogo} height="70px"></img>
                    <img src={mapboxLogo} height="70px"></img>
                    <img src={websocketLogo} height="70px"></img>
                    <img src={awsLogo} height="70px"></img>
                </div>

                <div className='footer-container'>
                    <Footer />
                </div>
            </div>
        );
    }
}

export default About;