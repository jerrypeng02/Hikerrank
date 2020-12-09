 import React, { Component } from 'react';
import history from "../history";
import { Redirect } from 'react-router-dom';

class SignupForm extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            username: '',
            email: '',
            password1: '',
            password2: '', 
            id:null,
            status: false,
            errorMessage: ''
        }

        // this.handleUsernameInput = this.handleUsernameInput.bind(this)
        // this.handleEmailInput = this.handleEmailInput.bind(this)
        // this.handleP1Input = this.handleP1Input.bind(this)
        // this.handleP2Input = this.handleP2Input.bind(this)
    }


    handleUsernameInput = (event) => {this.setState({ username: event.target.value})}
    handleEmailInput = (event) => {this.setState({ email: event.target.value})}
    handleP1Input = (event) => {this.setState({ password1: event.target.value})}
    handleP2Input = (event) => {this.setState({ password2: event.target.value})}
    

    handleSubmit = event => {
        event.preventDefault()
        // console.log(this.state)
        if (this.state.password1!==this.state.password2) {
            this.setState({
                errorMessage: "Passwords don't match"
            })
        } else {
            this.postForm()
        }    
    }

    postForm(){
        const data = {
            username: this.state.username, 
            email: this.state.email,
            password: this.state.password1
        }

        fetch('/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => {
            if (data['username']!=this.state.username) {
                this.setState({
                    errorMessage: data['username'],
                    status: false
                });
                // console.log(this.state)
            } else if (data['email']!=this.state.email){
                this.setState({
                    errorMessage: data['email'],
                    status: false
                });
            } else {
                sessionStorage.setItem('login_status','true');
                sessionStorage.setItem('username',this.state.username);
                sessionStorage.setItem('id',data['id']);
                this.setState({
                    errorMessage:"",
                    status: true,
                    id: data['id']
                });
            }        
            // console.log(data)  
        })
        .catch((error) => {
            console.log('Error: ', error)
        });
    }

    renderRedirect = () => {
        if (this.state.status) {
          return <Redirect to='/' />
        }
    }


    render() {
        return (
            <div>
                {this.renderRedirect()}
                <form className="signup-form" onSubmit={this.handleSubmit}>
                    <input type="text" className="signup-input" name="username" placeholder="Username" required="required" value={this.state.username} onChange={this.handleUsernameInput}/>
                    <input type="text" className="signup-input" name="email" placeholder="Email" required="required" value={this.state.email} onChange={this.handleEmailInput}/>
                    <input type="password" className="signup-input" name="password1" placeholder="Password" required="required" value={this.state.password1} onChange={this.handleP1Input}/>
                    <input type="password" className="signup-input" name="password2" placeholder="Confirm Password" required="required" value={this.state.password2} onChange={this.handleP2Input}/>
                <br></br>
                <button type="submit" class="signup-btn">SIGN UP</button>
                </form>
                <div className="error-container">
                    <p className="signup-error">{this.state.errorMessage}</p>
                </div>
            </div>   
        );
    }
}

export default SignupForm;