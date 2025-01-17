import {loadModel} from "./index";
import {Backend} from "./backend/Backend";
import {ServerBackend} from "./backend/ServerBackend";

const backend: Backend = new ServerBackend();

/* Events */
document.getElementById("validateButton").onclick =
    () => loadModel((<HTMLInputElement>document.getElementById("modelInput")).value)

document.getElementById("openButton").onclick = clickButton

document.getElementById("modelInput").onkeydown = pressEnter

document.getElementById("closeButton").onclick = closeNav

backend.getAllModel().then(list => autocomplete(document.getElementById("modelInput") as HTMLInputElement, list))

let open = false;
let autocompleteOpen = false

function clickButton() {
    if (!open) {
        document.getElementById("mySidebar").style.width = "250px";
        document.getElementById("main").style.marginRight = "250px";
        open = true;
    } else
        closeNav()
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
    open = false;
}

function pressEnter(event: KeyboardEvent) {
    if (event.key === "Enter" && !autocompleteOpen)
        document.getElementById("validateButton").click()
}


function autocomplete(inp: HTMLInputElement, arr: string[]) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    let currentFocus: number;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(_) {
        let a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists(null);
        autocompleteOpen = true
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (let element of arr) {
            /*check if the item starts with the same letters as the text field value:*/
            if (element.toLowerCase().includes(val.toLowerCase())) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                const index = element.toLowerCase().indexOf(val.toLowerCase())
                b.innerHTML = element.substr(0, index)
                b.innerHTML += "<strong>" + element.substr(index, val.length) + "</strong>";
                b.innerHTML += element.substr(index + val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + element + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(_) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists(null);
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        let x: any = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.code == 'ArrowDown') {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.code === 'ArrowUp') { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.code == 'Enter') {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x: any) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x: any) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(element: EventTarget) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        let x = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < x.length; i++) {
            if (element !== x[i] && element !== inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
        autocompleteOpen = false
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", (e) => closeAllLists(e.target));
}

