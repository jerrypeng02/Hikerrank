import React, { Component } from 'react';
import './Album.css'
import welcome from '../../pictures/welcome-image.jpg'

import UploadPhotoButton from './UploadPhotoButton'
import Modal from 'react-modal';
import Carousel from 'react-images';


const images = [
  { source: welcome,caption: "Welcome!" },];

class Album extends Component {
  constructor(props) {
    super(props);
    
    this.state={
      profile_id: this.props.profileId,
    }
  }

  componentDidMount(){
    fetch('/api/album/')
    .then(res => res.json())
    .then (data => {
        var data_size = Object.keys(data).length
        for (let index = 0; index < data_size; index++) {
            const element = data[index];
            var user_url = element['user']
            if (user_url.split("/").includes(String(this.state.profile_id))){
                var picture_dict = {};
                var picture_source = element['picture']
                var picture_caption = element['caption']
                // picture_dict['time'] = String(element['time']).substring(0,10)
                images.push({source: picture_source, caption:picture_caption})
            }
          }
    })
  }
  
  render() {
    const renderUploadButton = ()=>{
      if(this.state.profile_id===sessionStorage.getItem('id')){
        return (<UploadPhotoButton profileId={this.state.profile_id}/>)
      } 
      else {return (<div></div>)}
    }

    return (
      
        <div className="album-box">
            <p className="album-header">HIKING ALBUM</p>
            <div className="gallery">
                <Carousel views={images} />
            </div>
            {renderUploadButton()}
        </div>
        
    )
  }
}
export default Album;

