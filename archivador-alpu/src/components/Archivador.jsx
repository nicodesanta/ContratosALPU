import React from "react";

class Archivador extends React.Component {
  render() {
    return (
      <div>
        <h1>Archivador</h1>
        <div
          className="d-flex justify-content-center align-items-center w-100 mt-5"
          style={{ flexDirection: "column" }}
        >
          <div class="d-flex justify-content-center align-items-center mb-3 w-25">
            <div>
              <span>Fecha</span>
            </div>
            <input
              className="ml-3"
              type="date"
              class="form-control"
              placeholder="Username"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
          <div class="d-flex justify-content-center align-items-center mb-3 w-25">
            <div class="">
              <span>Locutor</span>
            </div>
            <input
              type="text"
              class="form-control"
              placeholder="Username"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
          <div class="d-flex justify-content-center align-items-center mb-3 w-25">
            <div>
              <span>Monto</span>
            </div>
            <input
              type="text"
              class="form-control"
              placeholder="Username"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
          <div class="d-flex justify-content-center align-items-center mb-3 w-25">
            <div>
              <span>Agencia</span>
            </div>
            <input
              type="text"
              class="form-control"
              placeholder="Username"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
          <div class="d-flex justify-content-center align-items-center mb-3 w-25">
            <div>
              <span>RUT</span>
            </div>
            <input
              type="text"
              class="form-control"
              placeholder="Username"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
          <div class="d-flex justify-content-center align-items-center mb-3 w-25">
            <div>
              <span>Agencia</span>
            </div>
            <input
              type="text"
              class="form-control"
              placeholder="Username"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
        </div>
      </div>
    );
  }
}
export default Archivador;
