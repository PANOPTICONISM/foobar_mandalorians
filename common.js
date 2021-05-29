// images, search bar

// remove loading screen once data is set - maria
export function loadingScreen() {
    document.querySelector(".loader-box").style.display = "none";
}

// switch user on the navigation - maria
export function switchUser() {
    const button = document.querySelector(".log_in button");

    button.addEventListener("click", activateDropdown);

    function activateDropdown() {
        const boxClicked = document.querySelector(".log_in")
        const extraUser = document.querySelector(".slide_out");

        window.onclick = function (e) {
            if (boxClicked.contains(e.target)) {
                extraUser.classList.add("activated");
            } else {
                console.log("outside")
                extraUser.classList.remove("activated");
            }
        }
    }
}

// export default function imageSources() {
//     //fix beernames from array to be used for img
//     let beerNameString = beerNameValue.toString();
//     let toLowerCase = beerNameString.toLowerCase();
//     let strConcat = toLowerCase.replace(/\s+/g, "");
//     let strIndex = strConcat.indexOf(",");
//     const img = document.createElement("img");
//     let imgName = strConcat.substring(0, strIndex);
//     img.src = `${imgName}.png`;
//     copy.querySelector("span").appendChild(img);
//     console.log(img);
// }