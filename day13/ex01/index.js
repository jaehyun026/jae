export default async function main() {
    console.log("hello")

    let currentIndex = 0;
    const menuitems = document.querySelectorAll(".menu-item");
    console.log(menuitems);

    menuitems[currentIndex].classList.add("select")

    window.addEventListener("keydown", (e) => {
        console.log(e.key)

        menuitems[currentIndex].classList.remove("select")

        if (e.key === "ArrowUp") {
            currentIndex--

            if(currentIndex < 0) {
                currentIndex = 2
            }
        }

        else if (e.key === "ArrowDown") {
            currentIndex++
            currentIndex %= 3
        }
        console.log(currentIndex)
        menuitems[currentIndex].classList.add("select")
    })


}