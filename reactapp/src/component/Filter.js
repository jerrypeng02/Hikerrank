import React, { Component } from 'react';

class Filter extends Component {
    constructor(props) {
        super(props);
        // console.log(this.props)
        this.state = {
            name: 'null',
            difficulty: 'null',
            type: 'null',
            maxLength: 'null',
            dislimit: 'null'
        }

        this.handleClickSearch = this.handleClickSearch.bind(this)
        this.handleClickClear = this.handleClickClear.bind(this)
        this.handleName = this.handleName.bind(this)
        this.handleDifficulty = this.handleDifficulty.bind(this)
        this.handleType = this.handleType.bind(this)
        this.handleMaxLength = this.handleMaxLength.bind(this)
        this.handleDistance = this.handleDistance.bind(this)
    }
    
    handleName(e) {
        var nameC = document.getElementById("name_filter").value
        this.setState({
            name: nameC
        })
    }

    handleDifficulty(e) {
        var diffC = document.getElementById("difficulty_filter").value
        this.setState({
            difficulty: diffC
        })
    }

    handleType(e) {
        var typeC = document.getElementById("type_filter").value
        this.setState({
            type: typeC
        })
    }

    handleMaxLength(e) {
        var lenC = document.getElementById("maxLength_filter").value
        this.setState({
            maxLength: lenC
        })
    }

    handleDistance(e) {
        var disC = document.getElementById("dislimit_filter").value
        this.setState({
            dislimit: disC
        })
    }

    handleClickClear(e) {
        document.getElementById("name_filter").value = ""
        document.getElementById("difficulty_filter").value = "null"
        document.getElementById("maxLength_filter").value = ""
        document.getElementById("dislimit_filter").value = ""
        document.getElementById("type_filter").value = "null"
        this.setState({
            name: 'null',
            difficulty: 'null',
            type: 'null',
            maxLength: 'null',
            dislimit: 'null' 
        })
        var filters = {
            name: 'null',
            difficulty: 'null',
            type: 'null',
            maxLength: 'null',
            dislimit: 'null' 
        }
        this.props.onClickSearch(filters)
    }

    handleClickSearch(e) {
        // get all the filter inputs and pass to parent component
        var filters = {
            name: 'null',
            difficulty: 'null',
            type: 'null',
            maxLength: 'null',
            dislimit: 'null' 
        }
        var name = this.state.name
        var difficulty = this.state.difficulty
        var maxLength = this.state.maxLength
        var dislimit = this.state.dislimit
        var type = this.state.type

        filters.name = name
        filters.difficulty = difficulty
        filters.type = type
        if (maxLength !== '') {
            filters.maxLength = maxLength
        }
        if (dislimit !== '') {
            filters.dislimit = dislimit
        }
        // console.log('filters get from Filter.js')
        // console.log(filters)
        this.props.onClickSearch(filters)
    }

    render() {
        return (
            <div className="trail-filter">
                <label className="filter-name" for="name_filter">Trail Name</label>
                <input className="filter-choice" type="text" placeholder="Find trails by name" id="name_filter" onChange={this.handleName}/>
                
                <label className="filter-name" for="difficulty_filter">Difficulty</label>
                <select className="filter-choice" name="difficulty" id="difficulty_filter" onChange={this.handleDifficulty}>
                    <option value="null">All</option>
                    <option value="Easiest">Easiest</option>
                    <option value="More Difficult">More Difficult</option>
                    <option value="Most Difficult">Most Difficult</option>
                </select>

                <label className="filter-name" for="maxLength_filter">Length</label>
                <input className="filter-choice" type="number" placeholder="trail max length in miles" id="maxLength_filter" onChange={this.handleMaxLength}/>


                <label className="filter-name" for="distance_filter">Distance</label>
                <input className="filter-choice" type="number" placeholder="distance to trail start" id="dislimit_filter" onChange={this.handleDistance}/>


                <label className="filter-name" for="type_filter">Trail Type</label>
                <select className="filter-choice" name="trail-type" id="type_filter" onChange={this.handleType}>
                    <option value="null">All</option>
                    <option value="Backpack">Backpack</option>
                    <option value="Bicycle">Bicycle</option>
                    <option value="Mountainbike">Mountainbike</option>
                    <option value="Ski">Ski</option>
                </select>

                <button className="clear-filter" onClick={this.handleClickClear}>Clear Filter</button>
                <button className="search-button" onClick={this.handleClickSearch}>&nbsp;Search&nbsp;</button>
            </div>
        );
    }
}

export default Filter;