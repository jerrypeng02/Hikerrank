import React, { Component } from 'react';
import './UserCheckins.css'

class UserCheckins extends Component {

    constructor(props) {
        super(props);
         this.state={
            profile_id: this.props.profileId,
            list: [],
            no_checkin_msg: null
         }
    }

    componentDidMount(){
        var list = new Array();
        const checkin_api_url = '/api/checkin/'
        fetch(checkin_api_url)
        .then(res => res.json())
        .then(
            data =>{
                var data_size = Object.keys(data).length

                for (let index = 0; index < data_size; index++) {
                    const element = data[index];
                    let fetched_user_id = String(element['User'])
                    let timestamp = String(element['Time']).substring(0,10)
                    if (fetched_user_id.split("/").includes(String(this.state.profile_id))) {
                        let fetched_trail_url = String(element['trail'])
                        fetch(fetched_trail_url)
                        .then(res => res.json())
                        .then(data => {
                            var trail_name = data['tname']
                            var trail_dict = {}
                            trail_dict['trail_name'] = trail_name
                            trail_dict['timestamp'] = timestamp
                            list.push(trail_dict)
                            this.setState({
                                ...this.state,
                                list: list,
                                no_checkin_msg:null
                            },console.log(this.state))
                        })
                    }
                }  
            }
        )
        if(this.state.list.length===0 && sessionStorage.getItem('id')===this.state.profile_id){
            this.setState({
                ...this.state,
                no_checkin_msg: "There's no check-ins. Build up your footmarks!"
            },console.log(this.state))
            return;
        }

        if(this.state.list.length===0 && sessionStorage.getItem('id')!=this.state.profile_id){
            this.setState({
                ...this.state,
                no_checkin_msg: "This user currently has no check-ins"
            },console.log(this.state))
            return;
        }
    }

    render() {
        return (
            <div className="check-in-box">
                <p className="checkins-header">TRAIL CHECK-INS</p>
                <h4>{this.state.no_checkin_msg}</h4>
                {
                    this.state.list.map(function(element,index){
                        return (
                            <div>
                                <a key={index} className="profile-checkin-list" >{element['trail_name']}  ---  {element['timestamp']}</a>
                                <br></br>
                            </div>
                        )
                    })
                }
            </div>
        );
    }
}

export default UserCheckins;