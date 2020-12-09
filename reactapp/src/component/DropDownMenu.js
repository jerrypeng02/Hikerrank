import React, { Component } from 'react'
import Dropdown from 'react-dropdown';
import history from "./history";
import {Redirect} from 'react-router-dom';
import './UserMenu.css';
import Profile from './NewProfile/Profile';

class DropDownMenu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selected: { value: null, label: null },
            redirect_to: null,
            profile_url: '/profile/'+String(sessionStorage.getItem('id'))+'/'
        }
        this._onSelect = this._onSelect.bind(this)
    }

    
    _onSelect(option) {
        // console.log('You selected ', option.value);
        this.setState({ 
            selected: { value: option.value, label: option.label },
            redirect_to:  option.value
        },()=>console.log(this.state));
        if (option.value == 1) {
            console.log('to profile homepage')
        } else if (option.value == 2) {
            console.log('to notification center')
        } else {
            console.log('log out')
        }
    }

    renderRedirect = () => {
        if (this.state.redirect_to==1) {
            return <Redirect to={this.state.profile_url} />
        
        } if (this.state.redirect_to==2) {
            return <Redirect to='/notification' />
        
        } if (this.state.redirect_to==3){
            sessionStorage.removeItem('login_status')
            sessionStorage.removeItem('username')
            sessionStorage.removeItem('id')
            return <Redirect to='/login' />
        }
    }

    render() {
    
        const { toggleClassName, togglePlaholderClassName, toggleMenuClassName, toggleOptionsClassName } = this.state

        const options = [
            {value: 1, className: 'homepage-option',label: "My Homepage"}, 
            {value: 2, className: 'notif-option', label: "Notifications"}, 
            {value: 3, className: 'logout-option', label: "Logout"}, 
        ]

        const defaultOption = 'Actions'
        // const placeHolderValue = typeof this.state.selected === 'string' ? this.state.selected : this.state.selected.label

        return (
            <div className="user-options">
                {this.renderRedirect()}
                <section>
                <Dropdown
                    options={options}
                    onChange={this._onSelect}
                    value={defaultOption}
                    placeholder="Select an option"
                    className={toggleClassName ? 'my-custom-class' : ''}
                    placeholderClassName={togglePlaholderClassName ? 'my-custom-class' : ''}
                    menuClassName={toggleMenuClassName ? 'my-custom-class' : ''}
                />
            </section>
            </div>     
        )
    }
}

export default DropDownMenu