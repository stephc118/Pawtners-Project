const hkBtn = document.querySelector(".hk");
const klBtn = document.querySelector(".kl");
const ntBtn = document.querySelector(".nt");
const hkIsland = document.getElementById("hk-island");
const kowloon = document.getElementById("kowloon");
const newTer = document.getElementById("new-territories");

hkIsland.style.display = 'none';
kowloon.style.display = 'none';
newTer.style.display = 'none';

hkBtn.addEventListener('click', (event)=> {
    hkIsland.style.display = '';
    kowloon.style.display = 'none';
    newTer.style.display = 'none';
    klBtn.classList.add("unchosen");
    ntBtn.classList.add("unchosen");
    
})

klBtn.addEventListener('click', (event)=> {
    kowloon.style.display = '';
    hkIsland.style.display = 'none';
    newTer.style.display = 'none';
    hkBtn.classList.add("unchosen");
    ntBtn.classList.add("unchosen");
})

ntBtn.addEventListener('click', (event)=> {
    newTer.style.display = '';
    hkIsland.style.display = 'none';
    kowloon.style.display = 'none';
    klBtn.classList.add("unchosen");
    hkBtn.classList.add("unchosen");
})