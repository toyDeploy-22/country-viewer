
function randomGame(cnt, proposition, answer, error) {
  try{
 // splice on same array to avoid duplicates with randomization

const randomNumber = Math.ceil(Math.random() * cnt.all.length); // index

const allCountries = cnt.all.filter((c) => typeof c.countryFlag_url !== 'undefined' && c.countryFlag_url !== '')

 const answerVar = allCountries[randomNumber === 0 ? randomNumber : randomNumber - 1];

 const proposal1 = allCountries.filter((p1)=>p1.countryId !== answerVar.countryId)[randomNumber === 0 ? randomNumber : (randomNumber - 1)]; // we remove one possibility so we do -1

 const proposal2 = allCountries.filter((p2)=>p2.countryId !== answerVar.countryId && p2.countryId !== proposal1.countryId)[randomNumber <= 2 ? randomNumber : (randomNumber - 2)]; 

 const proposal3 = allCountries.filter((p3)=>p3.countryId !== answerVar.countryId && p3.countryId !== proposal1.countryId && p3.countryId !== proposal2.countryId)[randomNumber <= 3 ? randomNumber : (randomNumber - 3)];

/*
 const answer = countries.all.splice(randomNumber,1);
 const proposal1 = answer[0].countryName;
 const proposal2 = countries.all.splice(Math.ceil(Math.random()*countries.all.length),1)[0];
 const proposal3 = countries.all.splice(Math.ceil(Math.random()*countries.all.length),1)[0];
*/

proposition(()=>[answerVar, proposal1, proposal2, proposal3].sort((a,b) => a.countryId < b.countryId ? -1 : 1)); // sort() in ASC order to shuffle the answer.
answer(()=>[answerVar])
  } catch {
const obj = { err: true, title: 'Cannot load countries', msg: 'Countries are not found and cannot be loaded.' };
console.error(obj);
error(()=>[obj])
  }
 }

export default randomGame;