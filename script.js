/**/
const axios = require('axios');
const http = require ('http');
const PORT = 3000;

http.createServer(async (req, res ) => {
    // CORS, es un error que se debio buscar en internet.
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Max-Age', 2592000);

    if (req.url === '/pokemones') {
      const allPokemon = await getAll();
      const allPokemonData = allPokemon.map((item) => { //map en vez de forech , y lo transforma en lo que quiera en este caso una promesa
      return getPokemon(item.url)
      })
      const data = await Promise.all(allPokemonData);
      res.write(JSON.stringify(data)) // un objeto o arreglo a texto 
    }
    res.end()
  }).listen(PORT,()=> console.log( `escuchando puerto http://localhost:${PORT}`))



const getAll = async () => { //obtiene los 150 pokemones con validacion 
  const result = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=150`).catch(e => e);
  //el if no es necesario, pero sirve como validacion del error.
  if (!result || !result.data || !result.status || result.status >= 300) return []
  return result.data.results;
}

const getPokemon = async (url) => { // se obtiene datos e la url por un pokemon 
  const result = await axios.get(url).catch(e => e);
  //el if no es necesario, pero sirve como validacion del error.
  if (!result || !result.data || !result.status || result.status >= 300) return;
  return {
    image: result.data.sprites.front_default,
    name: result.data.name,
    order: result.data.order
  };
}