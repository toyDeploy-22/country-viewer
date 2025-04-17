
import React, { useState, useEffect } from 'react';
import Badge from 'react-bootstrap/Badge';
import countrySchema from '../functions/countrySchema';
import Loaderpage from './Loaderpage';
import Errorpage from './Errorpage';
import { Link } from 'react-router-dom';

function AllCountriesList({ list }) {

const [fullList, setFullList] = useState([{ ...countrySchema }]);
const [loader, setLoader] = useState(false);
const [status, setStatus] = useState({ 
    ok: true,
    error: 0,
    title: '',
    msg: ''
})

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

 const colors = ["dark", "primary", "success", "secondary", "info"];

useEffect(()=>{
 try {
    setLoader(true);
    if(list.length > 0) {
    setFullList([...list]);
    console.log(list.length)
    setLoader(false);
    } else {
        const errorEmpty = {
        ok: false,
        error: 404,
        title: 'No Existing Country',
        msg: 'There is no country in the list. You can create a country in "Add A Country" section.'
        };
        setStatus(errorEmpty);
        setLoader(false)    
        }
 } catch(err) {
    const internalError = {
    ok: false,
    error: 500,
    title: 'Internal Server Error',
    msg: 'An error occured. Please try to refresh the page and contact an administrator if the issue persists.'
    }
    setStatus(internalError);
    setLoader(false);
 }
}, [status])

return(
loader ? <Loaderpage />
:
!loader && status.error === 0 ?
<section id="CountriesList-Section">
<div className="borderStyle">
<div className="allCountriesList-Container">
<h2 className="mb-0 title">Countries</h2>
<p className="m-0 text-center fst-italic"><small>List of all registered countries in the list.</small></p>
<br/>
<div className="countryLists-uls-container">
<ul className="countryList-1">
<li className='h2 countryLetter'><Badge bg={colors[Math.ceil(Math.random() * colors.length || 0)]}>{letters[0]}</Badge></li>
{fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[0].toLowerCase()).length > 0 ? fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[0].toLowerCase()).sort((a,b) => a.countryName > b.countryName ? 1 : -1).map((cnt, _ind) => <li key={cnt.countryId + _ind} className="countryLetter-child" ><Link to={`../country/${cnt.countryName}`} target='new_blank'>{cnt.countryName}</Link></li>) : <li className='not-found'>No country start with "{letters[0]}"</li>}
<br/>

<li className='h2 countryLetter'><Badge bg={colors[Math.ceil(Math.random() * colors.length || 0)]}>{letters[1]}</Badge></li>
{fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[1].toLowerCase()).length > 0 ? fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[1].toLowerCase()).sort((a,b) => a.countryName > b.countryName ? 1 : -1).map((cnt, _ind) => <li key={cnt.countryId + _ind} className="countryLetter-child"><Link to={`../country/${cnt.countryName}`} target='new_blank'>{cnt.countryName}</Link></li>) : <li className='not-found'>No country start with "{letters[1]}"</li>}
<br/>

<li className='h2 countryLetter'><Badge bg={colors[Math.ceil(Math.random() * colors.length || 0)]}>{letters[2]}</Badge></li>
{fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[2].toLowerCase()).length > 0 ? fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[2].toLowerCase()).sort((a,b) => a.countryName > b.countryName ? 1 : -1).map((cnt, _ind) => <li key={cnt.countryId + _ind} className="countryLetter-child"><Link to={`../country/${cnt.countryName}`} target='new_blank'>{cnt.countryName}</Link></li>) : <li className='not-found'>No country start with "{letters[2]}"</li>}
<br/>

<li className='h2 countryLetter'><Badge bg={colors[Math.ceil(Math.random() * colors.length || 0)]}>{letters[3]}</Badge></li>
{fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[3].toLowerCase()).length > 0 ? fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[3].toLowerCase()).sort((a,b) => a.countryName > b.countryName ? 1 : -1).map((cnt, _ind) => <li key={cnt.countryId + _ind} className="countryLetter-child"><Link to={`../country/${cnt.countryName}`} target='new_blank'>{cnt.countryName}</Link></li>) : <li className='not-found'>No country start with "{letters[3]}"</li>}
<br/>

<li className='h2 countryLetter'><Badge bg={colors[Math.ceil(Math.random() * colors.length || 0)]}>{letters[4]}</Badge></li>
{fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[4].toLowerCase()).length > 0 ? fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[4].toLowerCase()).sort((a,b) => a.countryName > b.countryName ? 1 : -1).map((cnt, _ind) => <li key={cnt.countryId + _ind} className="countryLetter-child"><Link to={`../country/${cnt.countryName}`} target='new_blank'>{cnt.countryName}</Link></li>) : <li className='not-found'>No country start with "{letters[4]}"</li>}
<br/>

<li className='h2 countryLetter'><Badge bg={colors[Math.ceil(Math.random() * colors.length || 0)]}>{letters[5]}</Badge></li>
{fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[5].toLowerCase()).length > 0 ? fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[5].toLowerCase()).sort((a,b) => a.countryName > b.countryName ? 1 : -1).map((cnt, _ind) => <li key={cnt.countryId + _ind} className="countryLetter-child"><Link to={`../country/${cnt.countryName}`} target='new_blank'>{cnt.countryName}</Link></li>) : <li className='not-found'>No country start with "{letters[5]}"</li>}
<br/>

<li className='h2 countryLetter'><Badge bg={colors[Math.ceil(Math.random() * colors.length || 0)]}>{letters[6]}</Badge></li>
{fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[6].toLowerCase()).length > 0 ? fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[6].toLowerCase()).sort((a,b) => a.countryName > b.countryName ? 1 : -1).map((cnt, _ind) => <li key={cnt.countryId + _ind} className="countryLetter-child"><Link to={`../country/${cnt.countryName}`} target='new_blank'>{cnt.countryName}</Link></li>) : <li className='not-found'>No country start with "{letters[6]}"</li>}
<br/>

<li className='h2 countryLetter'><Badge bg={colors[Math.ceil(Math.random() * colors.length || 0)]}>{letters[7]}</Badge></li>
{fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[7].toLowerCase()).length > 0 ? fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[7].toLowerCase()).sort((a,b) => a.countryName > b.countryName ? 1 : -1).map((cnt, _ind) => <li key={cnt.countryId + _ind} className="countryLetter-child"><Link to={`../country/${cnt.countryName}`} target='new_blank'>{cnt.countryName}</Link></li>) : <li className='not-found'>No country start with "{letters[7]}"</li>}
<br/>

<li className='h2 countryLetter'><Badge bg={colors[Math.ceil(Math.random() * colors.length || 0)]}>{letters[8]}</Badge></li>
{fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[8].toLowerCase()).length > 0 ? fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[8].toLowerCase()).sort((a,b) => a.countryName > b.countryName ? 1 : -1).map((cnt, _ind) => <li key={cnt.countryId + _ind} className="countryLetter-child"><Link to={`../country/${cnt.countryName}`} target='new_blank'>{cnt.countryName}</Link></li>) : <li className='not-found'>No country start with "{letters[8]}"</li>}
<br/>

<li className='h2 countryLetter'><Badge bg={colors[Math.ceil(Math.random() * colors.length || 0)]}>{letters[9]}</Badge></li>
{fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[9].toLowerCase()).length > 0 ? fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[9].toLowerCase()).sort((a,b) => a.countryName > b.countryName ? 1 : -1).map((cnt, _ind) => <li key={cnt.countryId + _ind} className="countryLetter-child"><Link to={`../country/${cnt.countryName}`} target='new_blank'>{cnt.countryName}</Link></li>) : <li className='not-found'>No country start with "{letters[9]}"</li>}
<br/>

<li className='h2 countryLetter'><Badge bg={colors[Math.ceil(Math.random() * colors.length || 0)]}>{letters[10]}</Badge></li>
{fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[10].toLowerCase()).length > 0 ? fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[10].toLowerCase()).sort((a,b) => a.countryName > b.countryName ? 1 : -1).map((cnt, _ind) => <li key={cnt.countryId + _ind} className="countryLetter-child"><Link to={`../country/${cnt.countryName}`} target='new_blank'>{cnt.countryName}</Link></li>) : <li className='not-found'>No country start with "{letters[10]}"</li>}
<br/>

<li className='h2 countryLetter'><Badge bg={colors[Math.ceil(Math.random() * colors.length || 0)]}>{letters[11]}</Badge></li>
{fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[11].toLowerCase()).length > 0 ? fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[11].toLowerCase()).sort((a,b) => a.countryName > b.countryName ? 1 : -1).map((cnt, _ind) => <li key={cnt.countryId + _ind} className="countryLetter-child"><Link to={`../country/${cnt.countryName}`} target='new_blank'>{cnt.countryName}</Link></li>) : <li className='not-found'>No country start with "{letters[11]}"</li>}
<br/>

<li className='h2 countryLetter'><Badge bg={colors[Math.ceil(Math.random() * colors.length || 0)]}>{letters[12]}</Badge></li>
{fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[12].toLowerCase()).length > 0 ? fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[12].toLowerCase()).sort((a,b) => a.countryName > b.countryName ? 1 : -1).map((cnt, _ind) => <li key={cnt.countryId + _ind} className="countryLetter-child"><Link to={`../country/${cnt.countryName}`} target='new_blank'>{cnt.countryName}</Link></li>) : <li className='not-found'>No country start with "{letters[12]}"</li>}

{/*
    fullList.filter((cnt, _ind, arr)=>_ind <= Math.floor(arr.length / 2)).map((cnt, _ind)=><li key={cnt.countryId + _ind}><Link to={`country/${cnt.countryName}`}>{cnt.countryName}</Link></li>)
*/}
</ul>

<ul className="countryList-2">

<li className='h2 countryLetter'><Badge bg={colors[Math.ceil(Math.random() * colors.length || 0)]}>{letters[13]}</Badge></li>
{fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[13].toLowerCase()).length > 0 ? fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[13].toLowerCase()).sort((a,b) => a.countryName > b.countryName ? 1 : -1).map((cnt, _ind) => <li key={cnt.countryId + _ind} className="countryLetter-child"><Link to={`../country/${cnt.countryName}`} target='new_blank'>{cnt.countryName}</Link></li>) : <li className='not-found'>No country start with "{letters[13]}"</li>}
<br/>

<li className='h2 countryLetter'><Badge bg={colors[Math.ceil(Math.random() * colors.length || 0)]}>{letters[14]}</Badge></li>
{fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[14].toLowerCase()).length > 0 ? fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[14].toLowerCase()).sort((a,b) => a.countryName > b.countryName ? 1 : -1).map((cnt, _ind) => <li key={cnt.countryId + _ind} className="countryLetter-child"><Link to={`../country/${cnt.countryName}`} target='new_blank'>{cnt.countryName}</Link></li>) : <li className='not-found'>No country start with "{letters[14]}"</li>}
<br/>

<li className='h2 countryLetter'><Badge bg={colors[Math.ceil(Math.random() * colors.length || 0)]}>{letters[15]}</Badge></li>
{fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[15].toLowerCase()).length > 0 ? fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[15].toLowerCase()).sort((a,b) => a.countryName > b.countryName ? 1 : -1).map((cnt, _ind) => <li key={cnt.countryId + _ind} className="countryLetter-child"><Link to={`../country/${cnt.countryName}`} target='new_blank'>{cnt.countryName}</Link></li>) : <li className='not-found'>No country start with "{letters[15]}"</li>}
<br/>

<li className='h2 countryLetter'><Badge bg={colors[Math.ceil(Math.random() * colors.length || 0)]}>{letters[16]}</Badge></li>
{fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[16].toLowerCase()).length > 0 ? fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[16].toLowerCase()).sort((a,b) => a.countryName > b.countryName ? 1 : -1).map((cnt, _ind) => <li key={cnt.countryId + _ind} className="countryLetter-child"><Link to={`../country/${cnt.countryName}`} target='new_blank'>{cnt.countryName}</Link></li>) : <li className='not-found'>No country start with "{letters[16]}"</li>}
<br/>

<li className='h2 countryLetter'><Badge bg={colors[Math.ceil(Math.random() * colors.length || 0)]}>{letters[17]}</Badge></li>
{fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[17].toLowerCase()).length > 0 ? fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[17].toLowerCase()).sort((a,b) => a.countryName > b.countryName ? 1 : -1).map((cnt, _ind) => <li key={cnt.countryId + _ind} className="countryLetter-child"><Link to={`../country/${cnt.countryName}`} target='new_blank'>{cnt.countryName}</Link></li>) : <li className='not-found'>No country start with "{letters[17]}"</li>}
<br/>

<li className='h2 countryLetter'><Badge bg={colors[Math.ceil(Math.random() * colors.length || 0)]}>{letters[18]}</Badge></li>
{fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[18].toLowerCase()).length > 0 ? fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[18].toLowerCase()).sort((a,b) => a.countryName > b.countryName ? 1 : -1).map((cnt, _ind) => <li key={cnt.countryId + _ind} className="countryLetter-child"><Link to={`../country/${cnt.countryName}`} target='new_blank'>{cnt.countryName}</Link></li>) : <li className='not-found'>No country start with "{letters[18]}"</li>}
<br/>

<li className='h2 countryLetter'><Badge bg={colors[Math.ceil(Math.random() * colors.length || 0)]}>{letters[19]}</Badge></li>
{fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[19].toLowerCase()).length > 0 ? fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[19].toLowerCase()).sort((a,b) => a.countryName > b.countryName ? 1 : -1).map((cnt, _ind) => <li key={cnt.countryId + _ind} className="countryLetter-child"><Link to={`../country/${cnt.countryName}`} target='new_blank'>{cnt.countryName}</Link></li>) : <li className='not-found'>No country start with "{letters[19]}"</li>}
<br/>

<li className='h2 countryLetter'><Badge bg={colors[Math.ceil(Math.random() * colors.length || 0)]}>{letters[20]}</Badge></li>
{fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[20].toLowerCase()).length > 0 ? fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[20].toLowerCase()).sort((a,b) => a.countryName > b.countryName ? 1 : -1).map((cnt, _ind) => <li key={cnt.countryId + _ind} className="countryLetter-child"><Link to={`../country/${cnt.countryName}`} target='new_blank'>{cnt.countryName}</Link></li>) : <li className='not-found'>No country start with "{letters[20]}"</li>}
<br/>

<li className='h2 countryLetter'><Badge bg={colors[Math.ceil(Math.random() * colors.length || 0)]}>{letters[21]}</Badge></li>
{fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[21].toLowerCase()).length > 0 ? fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[21].toLowerCase()).sort((a,b) => a.countryName > b.countryName ? 1 : -1).map((cnt, _ind) => <li key={cnt.countryId + _ind} className="countryLetter-child"><Link to={`../country/${cnt.countryName}`} target='new_blank'>{cnt.countryName}</Link></li>) : <li className='not-found'>No country start with "{letters[21]}"</li>}
<br/>

<li className='h2 countryLetter'><Badge bg={colors[Math.ceil(Math.random() * colors.length || 0)]}>{letters[22]}</Badge></li>
{fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[22].toLowerCase()).length > 0 ? fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[22].toLowerCase()).sort((a,b) => a.countryName > b.countryName ? 1 : -1).map((cnt, _ind) => <li key={cnt.countryId + _ind} className="countryLetter-child"><Link to={`../country/${cnt.countryName}`} target='new_blank'>{cnt.countryName}</Link></li>) : <li className='not-found'>No country start with "{letters[22]}"</li>}
<br/>

<li className='h2 countryLetter'><Badge bg={colors[Math.ceil(Math.random() * colors.length || 0)]}>{letters[23]}</Badge></li>
{fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[23].toLowerCase()).length > 0 ? fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[23].toLowerCase()).sort((a,b) => a.countryName > b.countryName ? 1 : -1).map((cnt, _ind) => <li key={cnt.countryId + _ind} className="countryLetter-child"><Link to={`../country/${cnt.countryName}`} target='new_blank'>{cnt.countryName}</Link></li>) : <li className='not-found'>No country start with "{letters[23]}"</li>}
<br/>

<li className='h2 countryLetter'><Badge bg={colors[Math.ceil(Math.random() * colors.length || 0)]}>{letters[24]}</Badge></li>
{fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[24].toLowerCase()).length > 0 ? fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[24].toLowerCase()).sort((a,b) => a.countryName > b.countryName ? 1 : -1).map((cnt, _ind) => <li key={cnt.countryId + _ind} className="countryLetter-child"><Link to={`../country/${cnt.countryName}`} target='new_blank'>{cnt.countryName}</Link></li>) : <li className='not-found'>No country start with "{letters[24]}"</li>}
<br/>

<li className='h2 countryLetter'><Badge bg={colors[Math.ceil(Math.random() * colors.length || 0)]}>{letters[25]}</Badge></li>
{fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[25].toLowerCase()).length > 0 ? fullList.filter((cnt) => cnt.countryName.toLowerCase()[0] === letters[25].toLowerCase()).sort((a,b) => a.countryName > b.countryName ? 1 : -1).map((cnt, _ind) => <li key={cnt.countryId + _ind} className="countryLetter-child"><Link to={`../country/${cnt.countryName}`} target='new_blank'>{cnt.countryName}</Link></li>) : <li className='not-found'>No country start with "{letters[25]}"</li>}

{/*
    fullList.filter((cnt, _ind, arr)=>_ind > Math.floor(arr.length/2)).map((cnt, _ind)=><li key={cnt.countryId + _ind}><Link to={`country/${cnt.countryName}`}>{cnt.countryName}</Link></li>)
*/}
</ul>
</div>
</div>
</div>
</section>
:
<Errorpage />
    )
}

export default AllCountriesList;