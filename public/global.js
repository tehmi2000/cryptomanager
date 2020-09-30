let dateElement = null;
document.addEventListener("DOMContentLoaded", function (ev) {
    dateElement = document.querySelector('#date-head');
});

function createComponent(type, value, classList) {
    value = value || null;
    classList = classList || null;

    const component = document.createElement(type);
    if (value){
        text = document.createTextNode(value);
        component.appendChild(text);
    }

    if(classList){
        classList.forEach(className => {
            component.classList.add(className);
        });
    }
    return component;
}

function joinComponent(container, ...components) {
    for (let component of components){
        container.appendChild(component);
    }
    return container;
}

function genHex(length){
    length = length || 16;
    let counter = 0;
    let generated_hex = "U";
    let characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    
    while(counter <= length){
        let rand_index = Math.round((Math.random()*characters.length)+1);
        generated_hex += characters.charAt(rand_index);
        counter += 1;
    }
    console.log(generated_hex);
    return generated_hex;
}

const generateRandomColor = function () {
    
    let red = (Math.random() * 200) + 1;
    let blue = (Math.random() * 200) + 1;
    let green = (Math.random() * 200) + 1;

    let color = `rgb(${red}, ${green}, ${blue})`;
    return color;
};

function getQuery() {
    const object = {};
    const query_list = window.location.search.substring(1).split('&');

    for (let index = 0; index < query_list.length; index++){
        object[query_list[index].split('=')[0]] = query_list[index].split('=')[1];
    }
    
    return object;
}

const formatAsMoney = price => {
    const countries = [
        {
            code: "US",
            currency: "USD",
            country: 'United States'
        },
        {
            code: "NG",
            currency: "NGN",
            country: 'Nigeria'
        },
        {
            code: 'KE',
            currency: 'KES',
            country: 'Kenya'
        },
        {
            code: 'UG',
            currency: 'UGX',
            country: 'Uganda'
        },
        {
            code: 'RW',
            currency: 'RWF',
            country: 'Rwanda'
        },
        {
            code: 'TZ',
            currency: 'TZS',
            country: 'Tanzania'
        },
        {
            code: 'ZA',
            currency: 'ZAR',
            country: 'South Africa'
        },
        {
            code: 'CM',
            currency: 'XAF',
            country: 'Cameroon'
        },
        {
            code: 'GH',
            currency: 'GHS',
            country: 'Ghana'
        }
    ];

    let formattedPrice = price.toLocaleString(undefined, {
        style: "currency",
        currency: "NGN"
    });

    return formattedPrice;
};

const headerAnimation =  function (text){
    
    const tl = gsap.timeline({repeat: true, yoyo: true});
    const headElements = document.querySelectorAll("header .headcontent");
    headElements.forEach(el => {
        el.classList.add(".js-enabled");
    });
    // headElements[1].style.opacity = 1;
    

    tl.add(gsap.to(headElements[0], 1, {x: "100vw", opacity: 0, ease: 'elastic.in(0.5, 0.5)', delay: 10}))
    .add(gsap.from(headElements[1], 0.6, {y: "-200px", opacity: 0, ease: 'elastic.out(0.5, 0.5)', delay: 0.5}))
    .add(gsap.to(headElements[1], 1, {x: -100, color: "#e31111", ease: 'elastic.in(0.6, 0.3)', delay: 8}));

    setInterval(() => {
        try{
            dateElement.textContent = text;
        }catch(err){
            console.error(err);
        }
        tl.restart();
    }, 43000)
}