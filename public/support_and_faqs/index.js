document.addEventListener("DOMContentLoaded", function(){
    console.log("loaded");
    loadHandlers();
});

const loadHandlers = () => {
    // document.querySelector("#skipbtn").addEventListener("click", scrollHandler);
    dateElement.textContent = "How can we help you?";
    headerAnimation("How can we help you?");
};

const scrollHandler = ev => {
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

// window.onscroll = function(event) {
//     try {
//         let scrollingElement = (document.scrollingElement || document.body);
//         if(scrollingElement.scrollTop >= 600){
//             posterButton.style.opacity = "1";
//         }else {
//             if (scrollingElement.scrollTop < 600) {
//                 posterButton.style.opacity = "0";
//             }
//         }

//         if (scrollingElement.scrollTop >= 800) {
//             get("page-navigation").style.display = "flex";
//             scrollUpButton.style.opacity = "1";
//             scrollDownButton.style.opacity = "1";
//         } else {

//             if (scrollingElement.scrollTop < 800) {
//                 scrollUpButton.style.opacity = "0";
//                 scrollDownButton.style.opacity = "0";
//                 scrollDownButton.ontransitionend = function(evt) {
//                     get("page-navigation").style.display = "none";
//                 };
//             } else if (scrollingElement.scrollTop == (scrollingElement.scrollHeight - 300)) {
//                 scrollUpButton.style.opacity = "1";
//                 scrollDownButton.style.opacity = "0";
//             } else {
//                 get("page-navigation").style.display = "flex";
//             }
//         }
//     } catch (e) {
//         // alert(e);
//     }
// };