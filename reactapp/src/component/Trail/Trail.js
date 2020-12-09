import React, {Component} from "react";
import '../../App.css';
import './Trail.css';
// import trailPagePic from '../../pictures/TrailPagePic.png';
import sampleMap from '../../pictures/sample-map.png'
import checkMark from '../../pictures/checkMark.png'
import reviewIcon from '../../pictures/reviewIcon.png'
import maleProfileIcon from '../../pictures/maleProfileIcon.png'
import femaleProfileIcon from '../../pictures/femaleProfileIcon.png'
import catPic from '../../pictures/catPic.png'
import calender from '../../pictures/calender.png'
import Nav from '../Nav'
import Search from '../Search'
import SignUpButton from '../Signup/SignUpButton'
import LoginButton from '../Login/LoginButton'
import axios from 'axios';
import PicSlogan from './PicSlogan';
import TrailInfo from './TrailInfo';
import DropDownMenu from '../DropDownMenu'
import DisplayCheckins from "./DisplayCheckins";
import DisplayReviews from "./DisplayReviews"
import DisplayEvents from './DisplayEvents'
import Footer from '../Footer'
import TrailMapWrapper from '../TrailMap/TrailMapWrapper'
import {Link} from "react-router-dom";



class Trail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            login_status: sessionStorage.getItem('login_status'),
            username: sessionStorage.getItem('username'),
            trail:{},
            checkins:{},
            trail_id:this.props.match.params['id'],
            trail_exist:false
        }
        // console.log(`the current loggedd in user is: ${sessionStorage.getItem('username')}`)
    }

    componentDidMount(){
        axios.get(`/api/trail/${this.state.trail_id}/`)
            .then(res=>{
                // console.log(res.data)
                this.setState({
                    trail:res.data,
                    trail_exist:true
                })
            })
        axios.get(`/api/checkin/`)
            .then(res=>{
                this.setState({
                    checkins:res.data.filter(a=>a.trail==this.state.trail_id)
                })
                // console.log(this.state.checkins)
            })
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

        if(this.state.trail_exist===false){
            // console.log("trail does not exist")
            return(
                <div className = 'container'>
                <div className='header-container'>
                    <div><h3 className='title'><Link to='/'>HIKERRANK</Link></h3></div> 
                    <Nav />
                    {/* <Search /> */}
                    <div className="welcome-or-buttons">
                    {renderLoginButton()}
                    {renderSignupButton()}
                    </div>
                </div>

                <p className="no-such-trail-msg">Sorry! This trail does not exist.</p>

                <div className='trail-footer-container'>
                    <Footer />
                </div>

            </div>

            )
        }else{
            // console.log("trail exist")
            return(
                <div className = 'container'>
                    <div className='header-container'>
                        <div><h3 className='title'><Link to='/'>HIKERRANK</Link></h3></div>
                        <Nav />
                        {/* <Search /> */}
                        <div className="welcome-or-buttons">
                            {renderLoginButton()}
                            {renderSignupButton()}
                        </div>
                    </div>

                    <PicSlogan name={this.state.trail.tname} summary={this.state.trail.description}/>

                    <div className='trail-info-and-map-section'>
                        <TrailInfo type={this.state.trail.tclass}
                                surface={this.state.trail.surface}
                                length={this.state.trail.length}
                                backpack={this.state.trail.backpack}
                                bicycle={this.state.trail.bicycle}
                                mountainbike={this.state.trail.mountainbike}
                                ski={this.state.trail.ski}
                                width={this.state.trail.width}
                                difficulty={this.state.trail.difficulty}
                        />
                        <div className='trail-map-container'>
                            <TrailMapWrapper trail_id={this.state.trail_id} />
                            {/* <img src={sampleMap}></img> */}
                        </div>

                        <div className="checkin-and-review-section">
                            <DisplayCheckins trailId = {this.state.trail_id}/>
                            <DisplayReviews trailId = {this.state.trail_id}/>
                        </div>

                        <DisplayEvents trailId = {this.state.trail_id}/>

                        <div className='trail-footer-container'>
                            <Footer />
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default Trail;