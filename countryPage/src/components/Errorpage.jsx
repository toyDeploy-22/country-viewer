import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faEnvelope } from '@fortawesome/free-solid-svg-icons';


function Errorpage() {


return(
<div id="errorPage">
	<h1 class="oops">Ooops...</h1>
	<br />
	<div class="err-messages">
		<p>An error occured. We are sorry for the inconvenience.</p>
		<br />
		<ul class="instructions">
			<li>- Please try to refresh the page <span><FontAwesomeIcon icon={faArrowsRotate} /></span></li>
			<li>- If the issue persists, please contact your administrator. <span><FontAwesomeIcon icon={faEnvelope} /></span></li>
	</ul>
</div>
</div>
	)
}

export default Errorpage;