import React, { Component } from 'react'
import checkMark from '../../pictures/checkMark.png'
import axios from 'axios';
import CheckinButton from './CheckinButton'

class displayCheckins extends Component {
    constructor(props) {
        super(props)
        this.state = {
             checkins_list:[],
             trail_id : this.props.trailId,
             no_checkin_msg:"No one has been to this trail yet. Why don't you be the first one to check in?"
        }
    }

    componentDidMount(){
        var list = new Array()
        axios.get(`/api/checkin/`)
        .then(res=>{
            // console.log(res.data)
            var size = Object.keys(res.data).length
            for(let i=0;i<size;i++){
                const fetched_element = res.data[i]
                let fetched_trail_id = String(fetched_element['trail'])
                let timestamp=fetched_element.Time.substring(0,10)
                // console.log(`timestamp is ${fetched_element.Time.substring(0,10)}`)
                // console.log(fetched_trail_id)
                // console.log(`current trail id is: ${this.state.trail_id}`)
                if(fetched_trail_id.split("/").includes(String(this.state.trail_id))){
                    //User id is the second to the last element in the list formed by splitting the url
                    // by "/"
                    this.setState({
                        no_checkin_msg:null
                    })
                    let profile_url_splitted_list=fetched_element.User.split("/")
                    let fetched_user_id = String(profile_url_splitted_list[profile_url_splitted_list.length-2])
                    // console.log(`The id of this user is ${fetched_user_id}`)
                    let fetched_user_url = `/api/user/${fetched_user_id}/`
                    // console.log(fetched_user_url)
                    axios.get(`/api/user/${fetched_user_id}/`)
                    .then(res=>{
                        var checkin_dict = {}
                        checkin_dict['username']=res.data.username
                        checkin_dict['profile_url']=`/profile/${fetched_user_id}/`
                        checkin_dict['timestamp']=timestamp
                        list.push(checkin_dict)
                        // console.log(checkin_dict)
                        this.setState({
                            checkins_list:list
                        })
                        // console.log(this.state)
                    })
                }
            }
        })

    }
    
    render() {
        return (
            <div className='checkin-container'>
                <p className='section-header'>
                    RECENT CHECK-INS 
                    <img src={checkMark} className="trail-page-icon"/>
                </p>
                <h4 className='no-checkin-msg'>{this.state.no_checkin_msg}</h4>
                
                {
                    this.state.checkins_list.map((element)=>{
                        return(
                            <div className="user-checkin">
                                <a href={element.profile_url} >{element.username}</a>
                                <span> --- {element.timestamp}</span>
                                <br></br>
                            </div>
                        )
                    })
                }
                <CheckinButton trail_id= {this.state.trail_id}/>
            </div>
        )
    }
}

export default displayCheckins


