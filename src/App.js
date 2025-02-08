// Core
import React, { useState, useEffect } from 'react';
// Local
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar.jsx';
import Loaderpage from './components/Loaderpage.jsx';
import Routespage from './components/Routespage.jsx';
import Errorpage from './components/Errorpage.jsx';
// 3rd Party
import axios from 'axios';

function App() {
  const [allCountries, setAllCountries] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [result, setResult] = useState('init');

  useEffect(() => {
    let controller = new AbortController();
    async function fetchCountries() {
      const signal = controller.signal;
      
      try {
        setSpinner(true);
        const myUrl = 'http://localhost:5000/allcountries';
        // const getCountries = 
        const countriesJson = await axios.get(myUrl, {
          signal: signal
        });
        setAllCountries(countriesJson.data);
        setSpinner(false);
        setResult('Ok');
      } catch (err) {
        setSpinner(false);
        setResult('Nok');
        if(axios.isCancel(err)){
          console.error('Connection Aborted!', err.message)
        } else {
        console.error(err);
        console.log(result)
      }}
    }
    fetchCountries();
    return () => controller.abort();
  }, [result]);

  return ( 
    <React.Fragment>
    <NavBar />
    {
    spinner && result === 'init' ? 
    <Loaderpage />
    :
    !spinner && result === 'Ok' ? 
    <Routespage countries={allCountries} />  
    :
    !spinner && result === 'Nok' ?
    <Errorpage />
    :
    null
  }
  </React.Fragment>)
}

export default App;