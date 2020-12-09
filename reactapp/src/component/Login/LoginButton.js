import React, { Component } from 'react';
import history from "../history";

const LoginButton = () => {
    return (
        <form>
            <button className='login-button' onClick={() => history.push('/login')}>Login</button>
        </form>
    )
}

export default LoginButton;