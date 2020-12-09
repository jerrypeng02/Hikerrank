import React, { Component } from 'react'
import axios from 'axios';

class DisplayContacts extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            chat_id:this.props.chat_id,
            contacts:[]
        }
    }
    componentDidMount(){
        axios.get(`/api/event/${this.state.chat_id}/`)
        .then(res=>{
            let participants=[]
            let initiator_url_splitted_list=res.data.initiator.split("/")
            let initiator_id = String(initiator_url_splitted_list[initiator_url_splitted_list.length-2])
            participants.push(initiator_id)

            let participants_url_list=res.data.participants
            for(let i=0; i<participants_url_list.length;i++){
                let participant_url_splitted_list=participants_url_list[i].split("/")
                let participant_id=String(participant_url_splitted_list[participant_url_splitted_list.length-2])
                if(!participants.includes(participant_id)){
                    participants.push(participant_id)
                }
            }
            for(let i=0;i<participants.length;i++){
                axios.get(`/api/profile/${participants[i]}/`)
                .then(res2=>{
                    let contact={}
                    let pic_url_splitted_list=res2.data.picture.split("/")
                    axios.get(`/api/user/${participants[i]}/`)
                    .then(res3=>{
                        let username=res3.data.username
                        contact["username"]=username
                        let pic_url=null
                        if(pic_url_splitted_list[pic_url_splitted_list.length-1]=="default-picture.png"){
                            pic_url="/pictures/default-picture.png"
                        }else{
                            pic_url="/pictures/"+username+"/"+pic_url_splitted_list[pic_url_splitted_list.length-1]
                        }
                        contact["pic_url"]=pic_url
                        let new_contacts=this.state.contacts
                        new_contacts.push(contact)
                        this.setState({
                            contacts:new_contacts
                        })
                    })
                })
            }
        })
    }
    render() {
        let contact_html=this.state.contacts.map(contact=>(
            <li className="contact">
                <div className="wrap">
                    <span className="contact-status online"></span>
                    <img src={contact["pic_url"]} alt="" />
                    <div className="meta">
                        <p className="name">{contact["username"]}</p>
                    </div>
                </div>
            </li>
        ));
        return (
            <div id="contacts">
                <ul>
                    {contact_html}
                </ul>
            </div>
        )
    }
}

export default DisplayContacts
