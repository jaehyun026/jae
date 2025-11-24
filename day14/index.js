export default async function main() {
    console.log("hello")

    const mainMenu = document.querySelector("#main-menu");
    const creditScreen = document.querySelector("#credit-screen");
    let currentScreen = 'mainMenu';

    let currentIndex = 0;
    const menuitems = document.querySelectorAll(".menu-item");
    console.log(menuitems.length);
    const menuitems_count = menuitems.length;

    menuitems[currentIndex].classList.add("select")

    window.addEventListener("keydown", (e) => {
        console.log(e.key)

        menuitems[currentIndex].classList.remove("select")

        if (currentScreen == 'mainMenu') {
            if (e.key === "ArrowUp") {
                currentIndex--

                if (currentIndex < 0) {
                    currentIndex = menuitems_count - 1
                }
            }

            else if (e.key === "ArrowDown") {
                currentIndex++
                currentIndex %= menuitems_count
            }
            else if (e.key === "Enter") {
                console.log(menuitems[currentIndex].dataset.action)
                const select_action = menuitems[currentIndex].dataset.action;

                if (select_action === 'credit') {
                    mainMenu.classList.add('hide')
                    creditScreen.classList.remove('hide')
                }
            }
        }
        else if (currentScreen == 'creditScreen') {

            if (e.key == "Enter") {
                console.log("creditScreen")
                creditScreen.classList.add('hide')
                mainMenu.classList.remove('hide')
                currentScreen = 'Mainmenu';
            }
        }
        console.log(currentIndex)
        menuitems[currentIndex].classList.add("select")
        currentScreen = 'creditScreen';
    })


}