import React, { Component } from 'react';
import './Signup.css'
import SignupForm from "./SignupForm";

class Signup extends Component {
    render() {
        return (
            <div>
                <div className="page-container">
                    <div className="logo-container">
                        <p className='hikerrank-title'>HIKERRANK</p>
                    </div>
                    <div className="signup-box-container">
                        <div className="signup-box">
                            <p className="subtitle">Please sign up</p>
                            <SignupForm />
                        </div>
                    </div>
                </div>
                {/* <img src={login_background}/> */}
            </div>
        );
    }
}

export default Signup;
