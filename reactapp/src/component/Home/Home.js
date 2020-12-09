import '../../App.css';
import './Home.css';
import homepagePic from '../../pictures/homepage_pic.jpg';
import Nav from '../Nav'
import Search from '../Search'
import SignUpButton from '../Signup/SignUpButton'
import LoginButton from '../Login/LoginButton'
import DisplayTrail from '../DisplayTrail'
import PrettierSearch from '../PrettierSearch'
import Filter from '../Filter'
import UserMenu from '../UserMenu'
import Footer from '../Footer'
import DropDownMenu from '../DropDownMenu'
import HomeMapWrapper from '../HomeMap/HomeMapWrapper'
import sampleMap from '../../pictures/sample-map.png'


import React, { Component } from 'react';

class Home extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      login_status: sessionStorage.getItem('login_status'),
      username: sessionStorage.getItem('username'),
      clicked_trail: -1,
      clicked: false,
      // default coordinates is cmu address
      longtitude: -79.94227,
      latitude: 40.44508,
      // name, difficulty, type, maxLength, dislimit
      searchFilters: {
        'name': 'null',
        'difficulty': 'null',
        'type': 'null',
        'maxLength': 'null',
        'dislimit': 'null'
      },
      searchResults: []
    }
    this.handleClickTrailName = this.handleClickTrailName.bind(this)
    this.handleClickSearch = this.handleClickSearch.bind(this)
    this.handleSearchResults = this.handleSearchResults.bind(this)
    this.setSearchCenter = this.setSearchCenter.bind(this)

  }

  setSearchCenter(lon, lat) {
    this.setState({
      longtitude: lon,
      latitude: lat
    })
  }

  handleClickTrailName(trail_id) {
    if (trail_id == this.state.clicked_trail) {
      this.setState({
        clicked_trail: -1,
        clicked: false
      })
    } else {
      this.setState({
        clicked_trail: trail_id,
        clicked: true
      })
    }
  }

  handleClickSearch(filters) {
    // pop filters into state.searchfilters
    this.setState({
      searchFilters: filters
    })
  }

  handleSearchResults(searched_trails) {
    this.setState({
      searchResults: searched_trails
    })
    // .log('Home get search results', this.state.searchResults)
  }
  
  render() {
    const clicked = this.state.clicked_trail
    const searchFilters = this.state.searchFilters
    const longtitude = this.state.longtitude
    const latitude = this.state.latitude
    const trails = this.state.searchResults

    const renderLoginButton = ()=>{
      if(this.state.login_status!=='true'){
        return (
            <LoginButton />
        )
      } else {
        return (<p className="welcome-msg">Hello, {this.state.username}! :)</p>)
      }
    }

    const renderSignupButton = ()=>{
      if(this.state.login_status!=='true'){
        return (
            <SignUpButton />
        )
      } else {
        return (<DropDownMenu />)
      }
    }

    return (
      <div className='home-container'>
        <div className='header-container'>
          <div><h3 className='title'>HIKERRANK</h3></div> 
          <Nav />
          {/* <Search /> */}
          <div className="welcome-or-buttons">
          {renderLoginButton()}
          {renderSignupButton()}
          </div>
          
        </div>

        <div className='main-content-container'>
          <div className='pic-slogan'>
          <img className='bg-image' src={homepagePic} width='100%'/>
            <h1 className='slogan'>Hit your stride on new trails</h1>
            <h3 className='sub-slogan'>Get on the trail with detailed maps shared by runners like you</h3>
          </div>

          <div>
            <h2 className='s-header'>Explore hiking trails in Pennsylvania:</h2>
          </div>

          <div class='search-criteria'>
              {/* <PrettierSearch /> */}
              
              <Filter search_filters={searchFilters} onClickSearch={this.handleClickSearch}/>
          </div>

          <div className='map-container'>
            <div className="trail-info-box">
              
              <DisplayTrail clicked_trail={clicked} onClickTrailName={this.handleClickTrailName} 
              longtitude={longtitude} latitude={latitude}
              search_filters={searchFilters}
              onSearchResults={this.handleSearchResults}/>
            </div>
            <div className="mapbox">
              <HomeMapWrapper setSearchCenter={this.setSearchCenter} display_lon={this.state.longtitude} display_lat={this.state.latitude}
              trails={trails} clicked_trail={clicked} clicked={this.state.clicked}/>
              {/* <img src={sampleMap} width='770px'></img> */}
            </div>
            
          </div>

            
        </div>

        <div className='footer-container'>
          <Footer />
        </div>
        
      </div>
    );
  }
}

export default Home;


