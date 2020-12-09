import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import ProcessRequestButtons from './ProcessRequestButtons';
import CancelEventButton from './CancelEventButton';
import CancelRequestButton from './CancelRequestButton';


class category_tab extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
          login_status: sessionStorage.getItem('login_status'),
          username: sessionStorage.getItem('username'),
          id: sessionStorage.getItem('id'),
          new_follower_list:[],
          new_follower_list_msg:null,
          my_request_list:[],
          my_request_list_msg:null,
          my_event_list:[],
          my_event_list_msg: null,
          event_update_msg_list:[],
          event_update_msg_list_msg: null,
          received_request_list:[],
          received_request_list_msg: null
        }

    }

    componentDidMount(){
        var currentDate = new Date()

        // ****************************** Tab1: initiated event ******************************
        var my_event_list = new Array();
        fetch('/api/event/')
        .then(res => res.json())
        .then(data => {
            var data_size = Object.keys(data).length
            var my_event_cnt = 0
            for (let index = 0; index < data_size; index++) {
                
                const element = data[index];
                if (element['initiator'].split("/").includes(String(this.state.id)) && element['status']=='normal') {
                    my_event_cnt = my_event_cnt + 1
                    var my_event_dict = {}
                    var event_id = String(element['url']).split("/")[5]
                    my_event_dict['event_url'] = '/event/'+event_id+'/'
                    my_event_dict['cancel_url'] = element['url']
                    my_event_dict['name'] = element['name']
                    my_event_dict['time'] = String(element['event_time']).substring(0,10)
                    var eventDate = new Date(String(element['event_time']))
                    // if this event is in the past
                    if(eventDate<currentDate){
                        my_event_dict['status'] = "past"
                    } else {
                        my_event_dict['status'] = "upcoming"
                    }

                    my_event_list.push(my_event_dict)
                    this.setState({
                        ...this.state,
                        my_event_list: my_event_list,
                        my_event_list_msg: null
                    },console.log(this.state))
                }
            }
            if (my_event_cnt===0) {
                this.setState({
                    ...this.state,
                    my_event_list_msg: "You have not initiated an event yet"
                },console.log(this.state))
            }  
        })

        // ****************************** Tab2: event request received ******************************
        var received_request_list = new Array();
        fetch('/api/pending-request/')
        .then(res => res.json())
        .then(data => {
            var data_size = Object.keys(data).length
            var received_request_cnt = 0
            for (let index = 0; index < data_size; index++) {
                const element = data[index];
                fetch(element['event']).then(res=>res.json())
                .then(data => {
                    var event_name = data['name']
                    if (data['initiator'].split("/").includes(String(this.state.id))){
                        received_request_cnt = received_request_cnt +1
                        var received_request_dict = {}
                        fetch(element['user']).then(res=>res.json())
                        .then(data=>{ 
                            received_request_dict['requester_name']=data['username']
                            received_request_dict['text'] = element['text']
                            received_request_dict['event_name'] = event_name
                            received_request_dict['pending_request_url'] = element['url']
                            received_request_list.push(received_request_dict)
                            this.setState({
                                received_request_list: received_request_list,
                                received_request_list_msg: null
                            },console.log(this.state))
                        })
                    }
                })
            } 
            if (received_request_cnt===0) {
                this.setState({
                    ...this.state,
                    received_request_list_msg: "You have no event requests"
                },console.log(this.state))
            } 
        })

        // ****************************** Tab3: my requests ******************************
        var my_request_cnt = 0
        var my_request_list = new Array();
        fetch('/api/pending-request/')
        .then(res => res.json())
        .then(data => {
            var data_size = Object.keys(data).length
            for (let index = 0; index < data_size; index++) {
                const element = data[index];
                if (element['user'].split("/").includes(String(this.state.id))){
                    my_request_cnt = my_request_cnt + 1
                    fetch(element['event']).then(res=>res.json())
                    .then(data => {
                        var my_request_dict = {}
                        my_request_dict['event_name'] = data['name']
                        my_request_dict['event_time'] = String(data['event_time']).substring(0,10)
                        my_request_dict['status'] = 'Pending'
                        my_request_dict['event_url'] = '/event/'+String(element['event']).split("/")[5]+'/'
                        my_request_dict['cancel_url'] = element['url']
                        my_request_list.push(my_request_dict)
                        this.setState({
                            ...this.state,
                            my_request_list: my_request_list,
                            my_request_list_msg: null
                        },console.log(this.state))
                    })
                }
        };
        fetch('/api/processed-request/')
        .then(res => res.json())
        .then(data => {
            var data_size = Object.keys(data).length
            for (let index = 0; index < data_size; index++) {
                const element = data[index];
                if (element['user'].split("/").includes(String(this.state.id))){
                    // console.log("requirement satisfied")
                    my_request_cnt = my_request_cnt + 1
                    fetch(element['event']).then(res=>res.json())
                    .then(data => {
                        var my_request_dict = {}
                        my_request_dict['event_name'] = data['name']
                        my_request_dict['event_time'] = String(data['event_time']).substring(0,10)
                        my_request_dict['status'] = element['status']
                        my_request_dict['event_url'] = '/event/'+String(element['event']).split("/")[5]+'/'
                        my_request_dict['cancel_url'] = "None"
                        my_request_list.push(my_request_dict)
                        this.setState({
                            ...this.state,
                            my_request_list: my_request_list,
                            my_request_list_msg: null
                        },console.log(this.state))
                    })
                }
            }
        })
            // console.log(my_request_cnt)

            if (my_request_cnt==0) {
                this.setState({
                    ...this.state,
                    my_request_list_msg: "You have not applied for an event yet"
                },console.log(this.state))
            }  
        })

        var event_update_msg_list = new Array()
        var broadcast_msg_cnt = 0
        fetch('/api/broadcast-message/')
        .then(res => res.json())
        .then(data => {
            var data_size = Object.keys(data).length
            for (let index = 0; index < data_size; index++) {
                const element = data[index];
                var audience = element['audience']
              // if the user is an audience of this message
                audience.forEach(e => {
                if (String(e).split('/').includes(this.state.id)) {
                    broadcast_msg_cnt = broadcast_msg_cnt+1
                    var event_update_msg_dict = {}
                    event_update_msg_dict['msg'] = element['message']
                    event_update_msg_dict['time'] = String(element['time']).substring(0,10)
                    event_update_msg_list.push(event_update_msg_dict);
                    this.setState({
                        ...this.state,
                        event_update_msg_list: event_update_msg_list,
                        event_update_msg_list_msg: null
                    },()=>{console.log(this.state)})
                }
                })
            }
        })

        if (broadcast_msg_cnt==0) {
            this.setState({
                ...this.state,
                event_update_msg_list_msg: "No recent updates"
            },console.log(this.state))
        }  

        // ****************************** Tab4: new followers ******************************
        var new_follower_list = new Array();

        fetch('/api/follow-unfollow/')
        .then(res => res.json())
        .then(data => {
            var data_size = Object.keys(data).length
            var new_follower_cnt = 0
            for (let index = 0; index < data_size; index++) {
                const element = data[index];
                
                if (element['following'].split("/").includes(String(this.state.id)) ){
                    new_follower_cnt = new_follower_cnt +1
                    fetch(element['user'])
                    .then(res => res.json())
                    .then(data =>{
                        var follower_dict = {}
                        follower_dict['follower_name'] = data['username']
                        follower_dict['follower_profile_url'] = '/profile/'+ String(data['id'])+'/'
                        new_follower_list.push(follower_dict)
                        this.setState({
                            ...this.state,
                            new_follower_list: new_follower_list,
                            new_follower_list_msg: null
                        },console.log(this.state))
                    })
                }
            }
            if (new_follower_cnt==0) {
                this.setState({
                    ...this.state,
                    new_follower_list_msg: "You have no new followers today"
                },console.log(this.state))
            }  
        })
    }


    render() {
        return (
            <div>
                <Tabs>
                    <TabList>
                    
                    <Tab>Event Initiated by You</Tab>
                    <Tab>Event Requests Received</Tab>
                    <Tab>Event Requested</Tab>
                    <Tab>Your Followers</Tab>
                    </TabList>


                    <TabPanel>
                    <h4>{this.state.my_event_list_msg}</h4>
                    <div id="my-event-table">
                        <h4>Upcoming events:</h4>
                        <table className="my-event-box">
                        {
                        this.state.my_event_list.map(function(element,index){
                            return (
                                <div>
                                    {element['status'] == 'upcoming'
                                    ? (<div>
                                        <tr> <td className="my-event-name"><span className="bold-font">Event: </span><a href={element['event_url']}>{element['name']}</a></td>
                                            <td className="my-event-time"><span className="bold-font">Date: </span><span>{element['time']}</span></td>
                                            <CancelEventButton cancel_url={element['cancel_url']}/>
                                        </tr>
                                    </div>)
                                    : <td></td>
                                    }
                                </div>)
                        })
                        }
                        <br></br>
                        </table>
                        {this.state.my_event_list_msg != null? <p>None</p> : <p></p>}

                        <h4>Past events:</h4>
                        <table className="my-event-box">
                        {
                        this.state.my_event_list.map(function(element,index){
                            return (
                                <div>
                                    {element['status'] == 'past'
                                    ? (<div>
                                        <tr> <td className="my-event-name"><span className="bold-font">Event: </span><a href={element['event_url']}>{element['name']}</a></td>
                                            <td className="my-event-time"><span className="bold-font">Date: </span><span>{element['time']}</span></td>
                                        </tr>
                                    </div>)
                                    : <td></td>
                                    }
                                </div>)
                        })
                        }
                        </table>
                        {this.state.my_event_list_msg != null? <p>None</p> : <p></p>}
                    </div>
                    </TabPanel>

                    <TabPanel>
                    <h4>{this.state.received_request_list_msg}</h4>
                    <div id="received-request-table">
                        <table className="received-request-box">
                        {
                        this.state.received_request_list.map(function(element,index){
                            return (
                                
                                <div className="received-request-content">
                                <tr>
                                    <td className="request-event-name"><span className="bold-font">Event: </span><span>{element['event_name']}</span></td>
                                    <td className="requester-name"><span className="bold-font">From: </span><span>{element['requester_name']}</span></td>
                                    <ProcessRequestButtons request_url={element['pending_request_url']}/>
                                </tr>
                                <tr className="request-text"><td colSpan="4"><span className="bold-font">Message to you: </span>{element['text']}</td></tr>
                                </div>
                            )
                        })
                        }
                        </table>
                    </div>
                    </TabPanel>

                    <TabPanel>
                    <h4>{this.state.my_request_list_msg}</h4>
                    <div id="my-request-table">
                        <table className="my-request-box">
                        {
                        this.state.my_request_list.map(function(element,index){
                            return (
                                <tr> <td className="my_event_name"><span className="bold-font">Event: </span><a href={element['event_url']}>{element['event_name']}</a></td>
                                    <td className="my_event_date"><span className="bold-font">Event Date: </span><span>{element['event_time']}</span></td>
                                    {element['status'] == 'Pending'
                                        ? <CancelRequestButton cancel_url={element['cancel_url']}/>
                                        : <td><span className="bold-font">Status: </span><span>{element['status']}</span></td>
                                    }
                                    
                                </tr>
                            )
                        })
                        }
                        </table>
                    </div>

                    <br></br>
                    <h4>Event update</h4>
                        {
                        this.state.event_update_msg_list.map(function(element,index){
                            return <p>{element['time']}: {element['msg']}</p>
                        })
                        }
                    
                    </TabPanel>

                    <TabPanel>
                    <h4>{this.state.new_follower_list_msg}</h4>
                    <div id="new-follower-list">
                        {
                        this.state.new_follower_list.map(function(element,index){
                            return (
                            <p><a href={element['follower_profile_url']}>{element['follower_name']}</a></p>
                            )
                        })
                        }
                    </div>
                    </TabPanel>
                </Tabs>
            </div>
        );
    }
}

export default category_tab;