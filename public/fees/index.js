document.addEventListener("DOMContentLoaded", function(){
    console.log("loaded");
    // loadHandlers();
});

const loadHandlers = () => {
    document.querySelector("#menu-action").addEventListener("click", menuHandler);
};

const menuHandler = ev => {
    const menu = document.querySelector("aside.table-of-content");

    if(ev.currentTarget.classList.contains("opened") === true){
        ev.currentTarget.classList.replace("opened", "closed");
        ev.currentTarget.classList.replace("icofont-close", "icofont-navigation-menu");
        menu.classList.toggle("opened", false);
    }else{
        ev.currentTarget.classList.replace("closed", "opened");
        ev.currentTarget.classList.replace("icofont-navigation-menu", "icofont-close");
        menu.classList.toggle("opened", true);
    }
};