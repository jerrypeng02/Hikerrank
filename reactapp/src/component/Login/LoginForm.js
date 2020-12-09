import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import history from "../history";

class LoginForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            loginStatus:'',
            errorMessage:'',
            redirect: null
        }
        
    }
    handleUsernameInput = (event) => {this.setState({ username: event.target.value})}
    handlePasswordInput = (event) => {this.setState({ password: event.target.value})}

    handleLogin = event => {
        event.preventDefault()
        this.postLogin()
    }

    postLogin(){
        const data = {
            username: this.state.username, 
            password: this.state.password
        }

        fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => {    
            if(data['token']!=null) {
                sessionStorage.setItem('login_status','true');
                sessionStorage.setItem('username',this.state.username);
                sessionStorage.setItem('id',data['user_id'])
                this.setState({
                    errorMessage:"",
                    loginStatus: true,
                });
            } else {
                this.setState({
                    errorMessage:"Invalid credentials",
                    loginStatus: false,
                });
            }
        })
        .catch((error) => {
            console.error('Error: ', JSON.stringify(error.res))
        });
    }
    
    handleSignup = event => {
        this.setState({
            redirect: 'to_signup'
        },()=>console.log(this.state.redirect));
    }

    handleGuest  = event =>{
        this.setState({
            redirect: 'to_homepage'
        },()=>console.log(this.state.redirect))
    }

    renderRedirect = () => {
        if (this.state.loginStatus) {
          return <Redirect to='/' />
        } 
        if (this.state.redirect === 'to_signup'){
            return <Redirect to='/signup' />
        }
        if (this.state.redirect === 'to_homepage'){
            return <Redirect to='/' />
        }
    }

    render() {
        return (
            <div>
                {this.renderRedirect()}
                <form className="login-form" onSubmit={this.handleLogin}>
                    <input type="text" className="login-input" name="username" placeholder="Username" required="required" value={this.state.username} onChange={this.handleUsernameInput}/>
                    <input type="password" className="login-input" name="password" placeholder="Password" required="required" value={this.state.password} onChange={this.handlePasswordInput}/>
                    <br></br>
                    <button type="submit" class="login-btn">LOGIN</button>
                </form>
                <button type="submit" class="signup-btn" onClick={this.handleSignup}>SIGN UP</button>
                <button type="submit" class="guest-btn" onClick={this.handleGuest}>CONTINUE AS GUESTS</button>
                <div className="error-container">
                    <p className="login-error">{this.state.errorMessage}</p>
                </div>
            </div>
            
        );
    }
}

export default LoginForm;
