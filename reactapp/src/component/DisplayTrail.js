import React, { Component } from 'react';


class DisplayTrail extends Component {
    constructor(props) {
        super(props);
        this.state = {
          page: 'homepage',
          trail_info: []
        }
        this.fetchData = this.fetchData.bind(this)
        this.newFilters = this.newFilters.bind(this)
        this.handleClick = this.handleClick.bind(this)
      }
    
    componentDidMount(){
        var longtitude = this.props.longtitude
        var latitude = this.props.latitude

        // name, difficulty, type, maxLength, dislimit
        var filters = this.props.search_filters
        this.fetchData(longtitude, latitude, filters)
    }

    componentDidUpdate(prevProps){
        if (this.props.longtitude !== prevProps.longtitude) {
            this.fetchData(this.props.longtitude, this.props.latitude, this.props.search_filters)
        } else if (this.props.latitude !== prevProps.latitude) {
            this.fetchData(this.props.longtitude, this.props.latitude, this.props.search_filters)
        } else if (this.newFilters(this.props.search_filters, prevProps.search_filters)) {
            this.fetchData(this.props.longtitude, this.props.latitude, this.props.search_filters)
        }
    }

    newFilters(thisFilters, prevFilters) {
        if (thisFilters.name != prevFilters.name) {
            return true
        }
        if (thisFilters.difficulty != prevFilters.difficulty) {
            return true
        }
        if (thisFilters.type != prevFilters.type) {
            return true
        }
        if (thisFilters.maxLength != prevFilters.maxLength) {
            return true
        }
        if (thisFilters.dislimit != prevFilters.dislimit) {
            return true
        }
        return false
    }

    fetchData(longtitude, latitude, filters){
    var searched_trails = new Array();
    // fetch('https://www.hikingproject.com/data/get-trails?lat=40.432756&lon=-79.924982&maxDistance=10&key=200958978-00d7024528a8bdd45c969fa078910537')
    fetch(`/trail-list/?longtitude=${longtitude}&latitude=${latitude}&name=${filters.name}&difficulty=${filters.difficulty}&type=${filters.type}&maxLength=${filters.maxLength}&dislimit=${filters.dislimit}`)
    .then(response => response.json())
    .then(data => {
        // console.log('trail data');
        // console.log(data);
        var data_size = Object.keys(data).length
        for (let index = 0; index < data_size; index++) {
            const element = data[index]
            // console.log(element['tname'])
            searched_trails.push(element)
        }
        this.setState({
            page: 'homepage',
            trail_info: searched_trails
        })
        // push the searched results to Home component
        this.props.onSearchResults(searched_trails)
    })
    }

    handleClick(e) {
        // console.log(e.target.id)
        this.props.onClickTrailName(e.target.id)
    }
    
    render() {
        // console.log('fetch result')
        // console.log(this.state.trail_info)
        const clicked_trail_id = this.props.clicked_trail;

        var num_trails;
        if (this.state.trail_info.length >= 200) {
            num_trails = '200+'
        } else {
            num_trails = this.state.trail_info.length
        }
        // const num_trails = this.state.trail_info.length;

        // console.log('Display Trail', clicked_trail_id)
        return (
            <div>
                <div className="nearby-hint">{num_trails} Trails near you:</div>
               {
                   this.state.trail_info.map((trail) => {
                    //    console.log(typeof(clicked_trail_id), typeof(trail.id))
                       var trail_id = String(trail['url']).split("/")[5];
                       var trail_types = 'hike/';
                       if (trail['backpack'] == 'Supported') {
                           trail_types = trail_types + 'backpack/'
                       }
                       if (trail['bicycle'] == 'Supported') {
                           trail_types = trail_types + 'bike/'
                       }
                       if (trail['mountainbike'] == 'Supported') {
                           trail_types = trail_types + 'mountainbike/'
                       }
                       if (trail['ski'] == 'Supported') {
                           trail_types = trail_types + 'ski/'
                       }
                       trail_types = trail_types.substring(0, trail_types.length-1)
                       if (clicked_trail_id == trail_id) {
                           
                            return (
                                <div key={trail.id} className="trail-card-clicked">
                                    
                                    <p className="trail-name" onClick={this.handleClick} id={trail_id}>{trail.tname}</p>
                                    <p>{trail.location}</p>
                                    <p>Type: {trail_types}</p>
                                    <p>Length: {trail.length.toFixed(4)} miles</p>
                                    <p>Width: {trail.width} feet</p>
                                    <p>Difficulty: {trail.difficulty} </p>
                                    
                                    
                                </div>
                            )
                       } else {
                            return (
                                <div key={trail_id} className="trail-card">
                                    
                                    <p className="trail-name" onClick={this.handleClick} id={trail_id}>{trail.tname}</p>
                                    <p>{trail.location}</p>
                                    <p>Type: {trail_types}</p>
                                    <p>Length: {trail.length.toFixed(4)} miles</p>
                                    <p>Width: {trail.width} feet</p>
                                    <p>Difficulty: {trail.difficulty} </p>
                                    
                                </div>
                            )
                       }
                       
                   })
               }
                {/* {this.state.trail_info.map(trail => <p key={trail.id}>{trail.name}</p>)} */}
            </div>
        );
    }
}

export default DisplayTrail;