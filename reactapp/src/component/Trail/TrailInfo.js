import React from 'react'

function TrailInfo(props) {

    // <TrailInfo type={this.state.trail.tclass} 
    //                         surface={this.state.trail.surface}
    //                         length={this.state.trail.length}
    //                         backpack={this.state.trail.backpack}
    //                         bicycle={this.state.trail.bicycle}
    //                         mountainbike={this.state.trail.mountainbike}
    //                         ski={this.state.trail.ski}
    //                         width={this.state.trail.width}
    //                         difficulty={this.state.trail.difficulty}
    return (
        <div className='Trail-Info-container'>
            <p className='section-header'>ABOUT THE TRAIL</p>
            <h4>Basic information:</h4>
            <p>Type: {props.type}</p>
            <p>Length:{props.length} miles</p>
            <p>Surface:{props.surface} </p>
            <p>Difficulty: {props.difficulty}</p>
            <p>Width:{props.width} </p>
            <h4>Other information:</h4>
            <p>Bicycle: {props.bicycle}</p>
            <p>Mountainbike: {props.mountainbike}</p>
            <p>Backpack: {props.backpack}</p>
            <p>Ski: {props.ski}</p>
        </div>
    )
}

export default TrailInfo

