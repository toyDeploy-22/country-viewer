
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseFlag } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function NavBar() {

    return(
<nav id="menu">
    <div className="menu-item">

              <p className="menu-text home-link p-2">
              <Link to="/" className="menu-link"><FontAwesomeIcon icon={faHouseFlag} /></Link>
              </p>
              
             <p className="menu-text p-2">
             <Link to="/allcountries" className="menu-link">All Countries</Link>
             </p>
              
            <p className="menu-text p-2">
            <Link to="/addcountry" className="menu-link">Add a Country</Link>
            </p>

            <p className="menu-text p-2">
            <Link to="searchcountry" className="menu-link">Search a Country</Link>
            </p>

            <p className="menu-text p-2">
            <Link to="/searchandmodify" className="menu-link">Modify a Country</Link>
            </p>
               
            <p className="menu-text p-2">
            <Link to="/deletecountry" className="menu-link">Delete a Country</Link>
            </p>
             
            </div>
        </nav>
    )
}

export default NavBar;