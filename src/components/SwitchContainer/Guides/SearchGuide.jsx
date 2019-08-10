import React from 'react';


const SearchGuide = props => {
    return (
        <div className = 'guide addComponents'>
            <h4 className = 'guide__title'>Search guide</h4>
            <p className = 'guide_content'>
                On the toolbar, click on the "Search" button and
                enter a keyword in the search field.
            </p>
            <img src = {process.env.PUBLIC_URL + '/img/search.gif'} alt = 'guide'></img>
        </div>
    )
}

export default SearchGuide;