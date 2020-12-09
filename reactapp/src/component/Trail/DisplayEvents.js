import React, { Component } from 'react'
import axios from 'axios';
import calender from '../../pictures/calender.png'
import JoinEventButton from './JoinEventButton';
import NewEventButton from './NewEventButton'

class DisplayEvents extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            event_list:[],
            trail_id : this.props.trailId,
            no_event_msg:"Currently, there's no upcoming events for this trail. You can use the button below to initiate a new event and ask your friends to join!"
        }
    }

    componentDidMount(){
        var list = new Array()
        axios.get(`/api/event/`)
        .then(res=>{
            // console.log(res.data)
            var size = Object.keys(res.data).length
            for(let i=0;i<size;i++){
                const fetched_element = res.data[i]
                let fetched_trail_id = String(fetched_element.trail)
                let fetched_event_status = String(fetched_element.status)
                // console.log(`the current event status is ${fetched_event_status}`)
                let event_date=fetched_element.event_time.substring(0,10)
                let event_name=String(fetched_element.name)
                let participants_count = fetched_element.participants.length
                let event_url_splitted_list=fetched_element.url.split("/")
                let event_id=String(event_url_splitted_list[event_url_splitted_list.length-2])
                // console.log(`event time is ${fetched_element.event_time.substring(0,10)}`)
                // console.log(fetched_trail_id)
                // console.log(`current trail id is: ${this.state.trail_id}`)
                if(fetched_trail_id.split("/").includes(String(this.state.trail_id))&&fetched_event_status==="normal"){
                    this.setState({
                        no_event_msg:null
                    })
                    let profile_url_splitted_list=fetched_element.initiator.split("/")
                    let fetched_user_id = String(profile_url_splitted_list[profile_url_splitted_list.length-2])
                    // console.log(`The id of this user is ${fetched_user_id}`)
                    axios.get(`/api/user/${fetched_user_id}/`)
                    .then(res=>{
                        var event_dict = {}
                        event_dict['initiator_name']=res.data.username
                        event_dict['profile_url']=`/profile/${fetched_user_id}/`
                        event_dict['event_date']=event_date
                        event_dict['event_name']=event_name
                        event_dict['participants_count']=participants_count
                        event_dict['event_id']=event_id
                        event_dict['event_url']=`/event/${event_id}/`
                        list.push(event_dict)
                        // console.log(event_dict)
                        this.setState({
                            event_list:list
                        })
                        // console.log(this.state)
                    })
                }
            }
        })
    }
    
    render() {
        return (

            <div className='events-container'>
            <span className='section-header'>
                UPCOMING EVENTS: 
            </span>
            <span className='section-sub-header'>
                Join your hikers crew to go for a ride together
            </span>
            <h4>{this.state.no_event_msg}</h4>

            {
                this.state.event_list.map((element)=>{
                    return (
                        <div>
                            <div className='event'>
                                <img className='calender-pic'src={calender}/>
                    <div className='event-date-name'>{element.event_date} - <a href = {element.event_url}>{element.event_name}</a></div>
                    <div className='event-orgnizer'>
                        <span>Initiated by: </span>
                        <a href={element.profile_url}>{element.initiator_name}</a>
                    </div>
                    <div className='event-participants'>Current number of participants: {element.participants_count}</div>
                                {/* <a className='see-participants-list' href=''>See participants list</a> */}
                                <JoinEventButton event_id={element.event_id}/>
                            </div>
                            <hr></hr>
                        </div>
                    )
                })
            }
            <NewEventButton trailId = {this.state.trail_id}/>
        </div>
        )
    }
}

export default DisplayEvents
