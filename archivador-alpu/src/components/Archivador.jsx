import React, { useRef, useEffect, useState } from "react";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(faMagnifyingGlass);


const Archivador = () => {
  const fecha = useRef("");
  const monto = useRef(0);
  const buscarContrato = useRef("");
  const numero = useRef("");
  const detalle = useRef("");
  const [locutores, setLocutores] = useState([]);
  const [agencias, setAgencias] = useState([]);
  const [selectRefAgencia, setAgencia] = useState([]);
  const [selectRefLocutor, setLocutor] = useState([]);


  useEffect(() => {
    fetch("https://localhost:7200/Usuarios/GetLocutores", {
      method: "GET",
      headers: { "Content-Type": "application/json" }, // Convert object to JSON string
    })
      .then((result) => result.json())
      .then((data) => {
        setLocutores(data);
      });
    fetch("https://localhost:7200/Usuarios/GetAgencias", {
      method: "GET",
      headers: { "Content-Type": "application/json" }, // Convert object to JSON string
    })
      .then((result) => result.json())
      .then((data) => {
        return setAgencias(data);
      });
  }, []);

  const handleBuscarContrato = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    fetch(`https://localhost:7200/Archivador/BuscarContrato/${buscarContrato.current.value}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        fecha.current.value = data.fecha;
        monto.current.value = data.monto;
        detalle.current.value = detalle.monto;
        setAgencia(data.rutAgencia);
        console.log(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };


  const handleChangeAgencia = (selectedOption) => {
    setAgencia(selectedOption);
  };
  const handleChangeLocutor = (selectedOption) => {
    setLocutor(selectedOption);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    const contrato = {
      fecha: fecha.current.value,
      agenciaId: selectRefAgencia.agenciaId,
      locutorId: selectRefLocutor.id,
      monto: monto.current.value,
      numeroContrato: numero.current.value,
      DetalleContrato: detalle.current.value,
    };

    fetch("https://localhost:7200/Archivador/AgregarContrato", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contrato), // Convert object to JSON string
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const mystyle = {
    width: "60vw",
  };

  return (
    <div>


      <div
        className="d-flex justify-content-center align-items-center w-100 mt-5"
        style={{ flexDirection: "column" }}
      >
        <div className="d-flex justify-content-center align-items-center mb-3 w-25">
          <input
            type="text"
            ref={buscarContrato}
            className="form-control"
            placeholder="Buscar"
          />
          <button
            type="submit"
            className="btn btn-primary ml-3"
            onClick={handleBuscarContrato}
          >
            <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
          </button>
        </div>
        <div className="d-flex justify-content-center align-items-center mb-3 w-25">
          <div>
            <span>Fecha</span>
          </div>
          <input
            type="date"
            ref={fecha}
            className="form-control"
            placeholder="Username"
          />
        </div>
        <div className="d-flex justify-content-center align-items-center mb-3 w-25">
          <div>
            <span>Numero</span>
          </div>
          <input
            type="number"
            ref={numero}
            className="form-control"
            placeholder="Username"
          />
        </div>

        <div className="d-flex justify-content-center align-items-center mb-3 W-100">
          <div className="">
            <span>Locutor</span>
          </div>
          <Select
            value={selectRefLocutor}
            onChange={handleChangeLocutor}
            style={mystyle}
            options={locutores}
            getOptionLabel={(x) => x.nombre + " " + x.apellido}
            getOptionValue={(x) => x.id}
          />
        </div>
        <div className="d-flex justify-content-center align-items-center mb-3 w-25">
          <div>
            <span>Monto</span>
          </div>
          <input
            type="text"
            ref={monto}
            className="form-control"
            placeholder="Username"
            aria-label="Username"
            aria-describedby="basic-addon1"
          />
        </div>
        <div className="d-flex justify-content-center align-items-center mb-3 w-25">
          <div>
            <span>Detalle</span>
          </div>
          <input
            type="text"
            ref={detalle}
            className="form-control"
            aria-describedby="basic-addon1"
          />
        </div>
        <div className="d-flex justify-content-center align-items-center mb-3 w-25">
          <div>
            <span>Agencia</span>
          </div>
          <Select
            value={selectRefAgencia}
            onChange={handleChangeAgencia}
            options={agencias}
            getOptionLabel={(x) => x.nombre + " " + "(" + x.rut + ")"}
            getOptionValue={(x) => x.id}
          />
          <button type="button" className="btn btn-primary ml-3">
            +
          </button>
        </div>
        <div className="d-flex gap-2">
          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            Agregar contrato
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            Editar contrato
          </button>
        </div>
      </div>
    </div>
  );
};
export default Archivador;
