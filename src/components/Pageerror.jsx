import React from 'react';
import { Link } from 'react-router-dom';

function Pageerror({ errStk }) {

return(
<div id="notFoundContainer">
  <div id="content">
  <div class="mainbox">
    <div class="errorNumStack">
    <h3 class="err">Error {errStk.code}</h3>
    <p id="oops">{errStk.title}</p>
    </div>
    </div>
    <div class="msg">
    <br />
    {
        errStk.msg.map((msg, _ind)=><p key={_ind}>{msg}</p>)
    }
    {
        errStk.code === 404 && <p className="fst-italic" style={{lineHeight: '0'}}><small>{'('}To add a country, you can go <Link style={{color: 'yellowgreen'}} to={"/addcountry"}>here</Link>.{')'}</small></p>
    }
    <br />
    </div>
    </div>
    </div>
    )
}

export default Pageerror;