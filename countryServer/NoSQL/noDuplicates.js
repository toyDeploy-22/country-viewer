
function noDuplicates(arr) {
const reasons = arr.map((e) => e.reason);

console.log(arr.filter((elem, _ind) => reasons.indexOf(elem.reason) === _ind))
return arr.filter((elem, _ind) => reasons.indexOf(elem.reason) === _ind);
}

export default noDuplicates;