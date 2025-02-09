import "./index.css";

import { useEffect, useState } from "react";
import { PokemonCards } from "./PokemonCards";

export const Pokemon = () => {
  const API = "https://pokeapi.co/api/v2/pokemon?limit=100";
  const [pokemonData, setPokemonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      //   console.log(data);

      const detailedData = data.results.map(async (curData) => {
        try {
          const detailedUrl = curData.url;
          const res = await fetch(detailedUrl);
          const data = await res.json();
          // console.log(data);
          return data;
        } catch (error) {
          console.log(error);
        }
      });
      //   console.log(detailedData);
      const detailedResponses = await Promise.all(detailedData);
      //   console.log(detailedResponses);
      setPokemonData(detailedResponses);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const searchData = pokemonData.filter((curPokemon) =>
    curPokemon.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div>
        <h1>Loading...!</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Error : {error.message}</h1>
      </div>
    );
  }

  if (pokemonData) {
    return (
      <section className="container">
        <header>
          <h1>Lets Catch Pokémon</h1>
        </header>
        <div className="pokemon-search">
          <input
            type="text"
            placeholder="Search Pokemon"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <ul className="cards">
            {/* {pokemonData.map((curData) => { */}
            {searchData.map((curData) => {
              return <PokemonCards key={curData.id} pokemonData={curData} />;
            })}
          </ul>
        </div>
      </section>
    );
  }
};
