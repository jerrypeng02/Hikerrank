import React, { Component } from "react";
import './TestMap.css'
import Map from './Map.js'

class TestMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            json_list: []
        }
    }
    
    componentDidMount() {
        fetch('/api/trail/')
            .then(res => res.json())
            .then(
                (result) => {
                    // console.log(result)
                    this.setState({
                        isLoaded: true,
                        items: result,
                        json_list: result
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }


    render() {
        const { error, isLoaded, items, json_list } = this.state
        if (error) {
            return <div>Error: {error.message}</div>
        } else if (!isLoaded) {
            return <div>Loading...</div>
        } else {
            return (
                    <div className="test-map">
                        <Map map_json_list={json_list} />
                    </div>
            )
        }
        
    }
}

export default TestMap