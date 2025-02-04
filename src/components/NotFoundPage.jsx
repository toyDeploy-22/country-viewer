
import React from "react";
import { Link } from "react-router-dom";

function NotFoundPage() {

    return(
 <div id="notFoundContainer">
  <div id="content">
  <div className="mainbox">
    <div className="errorNumStack">
    <h3 className="err">404 Error</h3>
    <p id="oops">Ooops, page not found...</p>
    </div>
    </div>
    <div className="msg">
    <br />
    <p>The requested page is not found. Please check the URL.</p> 
    <p>You can still go back to the main page <Link className="goToHome" to={"/"}>here</Link> if you want.</p></div>
    </div>
    </div>
    )
}

export default NotFoundPage;