import { useState, useEffect } from "react";

function App() {
  const [planets, setPlanets] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(true);

  const handleButtonClick = () => {
    setPage(page + 1);
  };

  useEffect(() => {
    setLoading(true);
    fetch(`https://swapi.dev/api/planets/?page=${page}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(
          "Nous n'avons pas pu récupérer des informations requises."
        );
      })
      .then((data) => {
        console.log(data);
        setLoading(false);
        setPlanets((planets) => [...planets, ...data.results]);
        setHasNext(!!data.next);
      })
      .catch((error) => console.log(error.message));
  }, [page]);

  const getInitialDarkMode = () =>
    JSON.parse(window.localStorage.getItem("dark-mode")) || false;

  const [darkMode, setDarkMode] = useState(getInitialDarkMode);

  useEffect(() => {
    document.body.classList.toggle("bg-dark", darkMode);
    document.body.classList.toggle("text-white", darkMode);
  }, [darkMode]);

  useEffect(() => {
    window.localStorage.setItem("dark-mode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <section className="container py-5">
      <h1 className="mb-5">Planètes dans l'univer Star Wars</h1>
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          id="activate"
          onChange={() => setDarkMode((active) => !active)}
          checked={!darkMode ? "" : "checked"}
        />
        <label className="form-check-label" for="activate">
          {" "}
          Mode Sombre{" "}
        </label>
      </div>
      <div className="row">
        {planets.map((planet) => {
          return (
            <div key={planet.name} className="col-md-6  col-lg-4 col-xl-3 mb-4">
              <article className="bg-warning p-3">
                <h2 className="h5">{planet.name}</h2>
                <p className="mb-0">
                  <b>population</b> <br /> {planet.population}
                </p>
                <p className="mb-0">
                  <b>climat</b> <br /> {planet.climate}
                </p>
              </article>
            </div>
          );
        })}
        {loading && <div className="mb-4 text-center p-3">loading...</div>}
      </div>
      {!loading && hasNext && (
        <button
          type="button"
          className="btn btn-dark"
          onClick={handleButtonClick}
          disabled={loading}
        >
          Suivantes
        </button>
      )}
      {!hasNext && (
        <p className="bg-dark text-white p-3">
          Nous avons listé toutes les planètes recensées.
        </p>
      )}
    </section>
  );
}

export default App;
