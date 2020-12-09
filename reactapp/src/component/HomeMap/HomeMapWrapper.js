import React, { Component } from "react";
import './HomeMapWrapper.css'
import Map from './HomeMap.js'

class HomeMapWrapper extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            // error: null,
            // isLoaded: false,
            clicked_trail: [],
            clicked: false,
            display_lon: this.props.display_lon,
            display_lat: this.props.display_lat,
            map_center_lon: -79.94227,
            map_center_lat: 40.44508
        }
        this.getClickedTrail = this.getClickedTrail.bind(this)
        this.reportMapCenter = this.reportMapCenter.bind(this)
        this.handleSetCurrentCenter = this.handleSetCurrentCenter.bind(this)
        this.handleRestoreCenter = this.handleRestoreCenter.bind(this)
    }
    
    reportMapCenter(lon, lat) {
        this.setState({
            map_center_lon: lon,
            map_center_lat: lat
        })
    }

    handleRestoreCenter() {
        this.setState({
            map_center_lon: -79.94227,
            map_center_lat: 40.44508,
            display_lon: -79.94227,
            display_lat: 40.44508,
            clicked: false,
            clicked_trail: {'foo': 'bar'}
        })
        this.props.setSearchCenter(-79.94227, 40.44508);
    }

    handleSetCurrentCenter() {
        var lon = this.state.map_center_lon;
        var lat = this.state.map_center_lat;
        this.setState({
            display_lat: lat,
            display_lon: lon
        })
        this.props.setSearchCenter(lon, lat);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.display_lat != this.props.display_lat || prevProps.display_lon != this.props.display_lon) {
            this.setState({
                display_lon: this.props.display_lon,
                display_lat: this.props.display_lat
            })
        }
        // console.log('HomeMapWrapper props.clicked', this.props.clicked, 'clicked trail', this.props.clicked_trail)
        if ((prevProps.clicked_trail != this.props.clicked_trail) && this.props.clicked) {
            // console.log('HomeMapWrapper, componentDidUpdate, 2nd fetch')
            fetch(`/api/trail/${this.props.clicked_trail}/`)
                .then(res => res.json())
                .then(
                    (result) => {
                        // console.log('HomeMapWrapper, componentDidUpdate, 2nd fetch', result)
                        this.setState({
                            clicked_trail: result,
                            clicked: true
                        })
                    },
                    (error) => {
                        this.setState({
                            clicked_trail: {'foo': 'bar'},
                            clicked: false
                        })
                    }
                )
        } else if ((prevProps.clicked_trail != this.props.clicked_trail) && !this.props.clicked) {
            // console.log('HomeMapWrapper, componentDidUpdate, click to not click');
                this.setState({
                    clicked_trail: {'foo': 'bar'},
                    clicked: false
                })
        }
    }

    async getClickedTrail() {
        if (this.props.clicked) {
            var selected_trail = [];
            await fetch(`/api/trail/${this.props.clicked_trail}/`)
                .then(res => res.json())
                .then(
                    (result) => {
                        // console.log('HomeMapWrapper, fetch clicked trail', result);
                        selected_trail = result;
                    },
                    (error) => {
                        selected_trail = {'foo' : 'bar'};
                    }
                )
            // console.log('HomeMapWrapper, fetch clicked trail', selected_trail);
            return selected_trail;
        } else {
            return {'foo':'bar'};
        }
    }

    render() {
        // .log('HomeMapWrapper', this.props);
        const trails_list = this.props.trails
        
        const clicked = this.state.clicked_trail
        // console.log('HomeMapWrapper clicked trail', clicked)
        const click_flag = this.state.clicked;
        // console.log('HomeMapWrapper click_flag', click_flag)

        return (
            <div>
                <div className="test-map"><Map map_json_list={trails_list} display_lon={this.props.display_lon} display_lat={this.props.display_lat}
                clicked_trail={clicked} clicked={click_flag} reportCenter={this.reportMapCenter}/></div>
                <button className="clear-filter" onClick={this.handleRestoreCenter}>Restore Search to Default Center (Pittsburgh [ 40.44, -79.94 ])         </button>
                <button className="search-button" onClick={this.handleSetCurrentCenter}>&nbsp;Search from Current Map Center [ {this.state.map_center_lon.toFixed(2)}, {this.state.map_center_lat.toFixed(2)} ]&nbsp;</button>
                
            </div>
        )

    }
}

export default HomeMapWrapper