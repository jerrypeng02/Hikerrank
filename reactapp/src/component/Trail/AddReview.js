import React, { Component } from 'react'
import axios from 'axios';
import catPic from '../../pictures/catPic.png'
import { withRouter } from 'react-router-dom';

class AddReview extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             comment:'',
             userId : sessionStorage.getItem('id'),
             trail_id:this.props.trail_id,
             rating:'1',
             user_profile_pic_url:''
        }
    }
    componentDidMount(){
        axios.get(`/api/profile/`)
        .then(res=>{
            // console.log(res.data)
            var size = Object.keys(res.data).length
            for(let i=0;i<size;i++){
                const fetched_element = res.data[i]
                let fetched_user_url = String(fetched_element.url)
                let fetched_url_splitted_list=fetched_user_url.split("/")
                let fetched_user_id = String(fetched_url_splitted_list[fetched_url_splitted_list.length-2])
                // console.log(fetched_user_id)
                if(String(fetched_user_id)===String(this.state.userId)){
                    let picture_url_splitted_list=fetched_element.picture.split("/")
                        let pic_url="/"
                        for(let i=3; i<picture_url_splitted_list.length;i++){
                            pic_url+=picture_url_splitted_list[i]
                            if(i!=picture_url_splitted_list.length-1){
                                pic_url+="/"
                            }
                        }
                        // console.log(pic_url)
                    this.setState({
                        user_profile_pic_url:pic_url
                    })
                    // console.log(this.state)
                }
            }
        })
    }

    handleCommentChange = (event) =>{
        this.setState({
            comment:event.target.value
        })
    }

    handleRatingChange = (event) =>{
        this.setState({
            rating:event.target.value
        })
    }

    handleFormSubmit = (event) =>{
        if (this.state.userId===null){
            this.props.history.push('/login')
        }
        else{
            return(
                axios.post('/api/review/',{
                    trail:this.state.trail_id,
                    poster:this.state.userId,
                    rating:parseInt(this.state.rating),
                    Review_text:this.state.comment
                })
                .then(response => {
                    console.log(JSON.stringify(response))
                })
                .catch(error => {
                    console.log(JSON.stringify(error.response))
                })
            )
        }
       
    }

    renderUserPic(){
        if(this.state.userId===null){
            // console.log("i am in if")
            return (
                <img className='add-review-profile-pic'src={catPic}/>
            )
        }
        else{
            // console.log("I am in else")
            return(
                <img className='add-review-profile-pic'src={this.state.user_profile_pic_url}/>
            )
        }
    }
    
    render() {
        return (
            <div className='add-new-review'>
                <form onSubmit = {(event)=> this.handleFormSubmit(event)}>
                    <div className='profile-pic-and-review-text'>
                        {this.renderUserPic()}
                        <textarea className='add-review-text' value={this.state.comment} onChange={this.handleCommentChange}></textarea>
                    </div>
                    <div className='rating-and-submit-button'>
                        <span className="rating-label">
                            <label>Rating: </label>
                            <select value={this.state.rating} onChange={this.handleRatingChange}>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </select>
                        </span>
                        <button type='submit' className='add-review-button button'>
                            Add your review
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}

export default withRouter(AddReview)
