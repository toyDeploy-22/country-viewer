
// 3rd Party
import { Routes, Route } from "react-router-dom";
// Local
import AllCountriesList from "./AllCountriesList.jsx";
import AddCountries from "./AddCountries.jsx";
import MainCountries from "./MainCountries.jsx";
import SearchCountry from "./SearchCountries.jsx";
import ModifyACountrySearch from "./ModifyACountrySearch.jsx";
import CountryProfile from "./CountryProfile.jsx";
import NotFoundPage from "./NotFoundPage.jsx";
import DeleteCountry from "./DeleteCountry.jsx";

function Routespage({ countries }) {

return(
<Routes>
 <Route path="/" element={<MainCountries countries={{ all: countries }} />} />
 <Route path="/allcountries" element={<AllCountriesList list={countries} />} />
 <Route path="addcountry" element={<AddCountries cnt={countries} />} />
 <Route path="searchcountry" element={<SearchCountry countries={countries} />} />
 <Route path="searchandmodify" element={< ModifyACountrySearch countries={countries} />} />
 <Route path="country/:country" element={<CountryProfile countries={countries} />} />
 <Route path="deletecountry" element={<DeleteCountry cntrs={countries} />} />
 <Route path="*" element={<NotFoundPage />} />
 </Routes>
    )
}

export default Routespage;