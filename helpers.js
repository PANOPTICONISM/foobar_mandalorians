//Time function KRISTA
export function currentTime(timestamp) {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const formattedTime = ` ${hours}:${minutes}:${seconds}`;
  return formattedTime;
}

//Last word in string
export function lastStr(str) {
  const lastSpace = str.lastIndexOf(" ");
  const lastWord = str.substring(lastSpace + 1);
  return lastWord;
}

//clear whitespaces
export function nameId(name) {
  return name.replace(/\s/g, "");
}
