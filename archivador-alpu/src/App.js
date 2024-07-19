import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import Contratos from "./components/Contratos";
import Locutor from "./components/Locutor";
import Agencia from "./components/Agencia";
import Autocomplete from "@mui/material/Autocomplete";
import SubirContratos from "./components/SubirContratos";
import Agregar from "./components/Agregar";
import TextField from "@mui/material/TextField";
import DetalleIva from "./components/DetalleIva";
import Archivador from "./components/Archivador";
export default function App() {
  const [resultados, setResultados] = useState([
    { Nombre: "The Godfather", id: 1 },
  ]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    buscar();
  }, []);

  const select = (e, newValue) => {
    if (newValue.tipo) {
      if (newValue.tipo == "agencia") {
        window.location.href = `http://localhost:3000/agencia/${newValue.rut}`;
      } else if (newValue.tipo == "Locutor") {
        window.location.href = `http://localhost:3000/locutor/${newValue.ci}`;
      }
    }
  };

  function buscar() {
    setResultados([]);
    let data = {
      value: inputValue,
      page: 0,
    };

    fetch(`https://localhost:7200/Usuarios/GetAgenciasAndContratos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((result) => result.json())
      .then((data) => {
        setResultados(data);
      });
  }
  return (
    <div className="body">
      <nav className="navbar navbar-expand-lg text-white navbarColor">
        <a className="navbar-brand" href="/">
          ALPU
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="/contratos">
                Contratos
              </a>
            </li>
            <li className="nav-item active">
              <a className="nav-link" href="/subircontratos">
                Subir contratos
              </a>
            </li>
            <li className="nav-item active">
              <a className="nav-link" href="/detalle">
                Detalle
              </a>
            </li>
            <li className="nav-item active">
              <a className="nav-link" href="/agregar">
                Agregar
              </a>
            </li>
            <li className="nav-item active">
              <a className="nav-link" href="/editar">
                Editar
              </a>
            </li>
          </ul>
          {resultados && (
            <form className="form-inline my-2 my-lg-0">
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={resultados}
                sx={{ width: 300 }}
                getOptionLabel={(option) => option.nombre}
                renderInput={(params) => (
                  <TextField {...params} label="Buscar" />
                )}
                onChange={(e, newValue) => {
                  select(e, newValue);
                }}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                  buscar();
                }}
                // disablePortal
                // id="combo-box-demo"
                // options={options}
                // sx={{ width: 300 }}
                // renderInput={(params) => (
                //   <TextField value={params.nombre} label="Movie" />
                // )}
                // //
                // freeSolo
              />
            </form>
          )}
        </div>
      </nav>
      <HashRouter basename="/">
        <Routes>
          <Route path="/">
            <Route index element={<Contratos />} />
            <Route path="contratos" element={<Contratos />} />
            <Route path="locutor/:id" element={<Locutor />} />
            <Route path="agencia/:id" element={<Agencia />} />
            <Route path="subirContratos" element={<SubirContratos />} />
            <Route path="agregar" element={<Agregar />} />
            <Route path="detalle" element={<DetalleIva />} />
            <Route path="editar" element={<Archivador />} />
          </Route>
        </Routes>
      </HashRouter>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
