
function randomFlags(arr, nb) {
  let splicedArr = arr;
  let x = 0;
  let random = Math.ceil(Math.random() * splicedArr.length);
  const finalArr = [];

  while(x < nb) {
    let index = random === 0 ? random : random - 1;
    let splicer = splicedArr.splice(index, 1)[0];
    finalArr.push(splicer);
    x++
  }
  return finalArr;
} 

export default randomFlags;