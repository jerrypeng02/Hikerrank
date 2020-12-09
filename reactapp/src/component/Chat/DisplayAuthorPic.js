import React, { Component } from 'react'
import axios from 'axios';

class displayAuthorPic extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             message_id:this.props.message_id,
             message_author_name:this.props.message_author_name,
             pic_url:null,
             message_author_id:null
        }
    }
    componentDidMount(){
        let author_id = null;
        axios.get(`/api/message/${this.state.message_id}/`)
        .then(res=>{
            let author_url_splitted_list=res.data.author.split("/")
            author_id = String(author_url_splitted_list[author_url_splitted_list.length-2])
            this.setState({
                message_author_id:author_id
            })
            axios.get(`/api/profile/${this.state.message_author_id}/`)
            .then(res=>{
                let author_pic_url_splitted_list=res.data.picture.split("/")
                let author_pic_url=null
                if(author_pic_url_splitted_list[author_pic_url_splitted_list.length-1]=="default-picture.png"){
                    author_pic_url="/pictures/default-picture.png"
                }else{
                    author_pic_url="/pictures/"+this.state.message_author_name+"/"+author_pic_url_splitted_list[author_pic_url_splitted_list.length-1]
                }
                this.setState({
                    pic_url:author_pic_url
                })
            })
        })
        
    }
    
    render() {
        return (
            <img
                src={this.state.pic_url}
                alt="profile-pic"
            />
        )
    }
}

export default displayAuthorPic
