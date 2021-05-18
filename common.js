// images, search bar

export default function imageSources() {
    //fix beernames from array to be used for img
    let beerNameString = beerNameValue.toString();
    let toLowerCase = beerNameString.toLowerCase();
    let strConcat = toLowerCase.replace(/\s+/g, "");
    let strIndex = strConcat.indexOf(",");
    const img = document.createElement("img");
    let imgName = strConcat.substring(0, strIndex);
    img.src = `${imgName}.png`;
    copy.querySelector("span").appendChild(img);
    console.log(img);
}