const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);
const
  keys = urlParams.keys(),
  values = urlParams.values(),
  entries = urlParams.entries();

for(const entry of entries) {
    console.log(entry[0], entry[1]);
    document.getElementById(entry[0]).value = entry[1];
}