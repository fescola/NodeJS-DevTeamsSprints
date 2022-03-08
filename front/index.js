

(()=>{
    window.addEventListener('load', ()=>{
        'use stric'
        // const { json } = require("express/lib/response");
        const llamarApi = document.querySelector('.api');

        const pokeapi = 'https://pokeapi.co/api/v2/pokemon/ditto'

        fetch(pokeapi)
        .then(n => n.json())
        .then(data => {
            llamarApi.innerHTML = `
        <p>${data.name}</p>
        <img src='${data.sprites.front_default}'>
        `})

    })
})()