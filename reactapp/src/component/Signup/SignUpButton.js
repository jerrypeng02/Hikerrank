import React, { Component } from 'react';
import history from "../history";


const SignUpButton = () => {
    return (
        <form>
            <button className='sign-up-button' onClick={() => history.push('/signup')}>Sign Up</button>
        </form>
    )
}

export default SignUpButton;