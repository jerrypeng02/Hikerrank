import React, { Component } from 'react';

const Search = () => {

    return (
        <div className='search'>
            <input type="text" placeholder="Find trails by name" name="search"/>
            <button type="submit"><i class="fa fa-search"></i></button>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        </div>
    )
}
export default Search;