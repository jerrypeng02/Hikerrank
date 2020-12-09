import React, { Component } from "react";
import './TrailMapWrapper.css'
import Map from './TrailMap.js'

class TrailMapWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            nearby_trails: []
        }
    }
    
    componentDidMount() {
        fetch(`/api/trail/${this.props.trail_id}/`)
            .then(res => res.json())
            .then(
                (result) => {
                    // console.log(result)
                    this.setState({
                        isLoaded: true,
                        items: result,
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
            .then(()=>{
                var coordinates_list = this.state.items.map_info.data.geometry.coordinates;
                var coordinates;
                if (typeof(coordinates_list[0][0]) == typeof(0.123)) {
                    coordinates = coordinates_list[0];
                } else if (typeof(coordinates_list[0][0][0]) == typeof(0.123)) {
                    coordinates = coordinates_list[0][0];
                }
                // got the start coordinates of this trail
                // console.log('Trail Map Wrapper', coordinates)
                if (typeof(coordinates[0]) == typeof(0.123)) {
                    // fetch neary by trails
                    var searched_trails = new Array()
                    fetch(`/trail-list/?longtitude=${coordinates[0]}&latitude=${coordinates[1]}&dislimit=${10.0}`)
                    .then(response => response.json())
                    .then(data=>{
                        var data_size = Object.keys(data).length
                        for (let index = 0; index < data_size; index++) {
                            const element = data[index]
                            // console.log(element['tname'])
                            searched_trails.push(element)
                        }
                        this.setState({
                            nearby_trails: searched_trails
                        })
                    })
                }
            }    
            )
        
    }


    render() {
        const { error, isLoaded, items } = this.state
        if (error) {
            return <div>Error: {error.message}</div>
        } else if (!isLoaded) {
            return <div>Loading...</div>
        } else {
            // console.log('printing map data in TrailMapWrapper.js...')
            // console.log('Trail Map Wrapper nearby trails', this.state.nearby_trails)
            return <div className="test-map"><Map map_data={items} nearby_trails={this.state.nearby_trails}/></div>
        }
        
    }
}

export default TrailMapWrapper