import React from 'react'
import trailPagePic from '../../pictures/login_background_resized.jpg';


function PicSlogan(props) {
    // console.log("pic_slogan is invoked")
    return (
        <div className='pic-slogan-container'>
            <img className='bg-image' src={trailPagePic} width='100%' height='400px'/>
            <h1 className='slogan'>{props.name}</h1>
            {props.summary=="None" && <p className='sub-slogan'>No available description</p>}
            {props.summary!="None" && <p className='sub-slogan'>{props.summary}</p>}
        </div>
    )
}

export default PicSlogan

