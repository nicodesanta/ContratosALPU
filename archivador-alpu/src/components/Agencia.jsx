import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { ExcelExport } from '@progress/kendo-react-excel-export';
library.add(faFileExcel);

const Agencia = () => {


    const { data, loading } = ({
        dataSet: 'Commodity',
        rowLength: 4,
        maxColumns: 6,
    });


    const [contratos, setContratos] = useState([]);
    const [agencia, setAgencia] = useState();
    const { id } = useParams();

    const columnsContratos = [
        { field: "fecha", headerName: "Fecha", flex: 1 },
        { field: "nombreAgencia", headerName: "Agencia", flex: 1 },
        { field: "rutAgencia", headerName: "RUT", flex: 1 },
        { field: "nombreLocutor", headerName: "Locutor", flex: 1 },
        { field: "numeroContrato", headerName: "Numero de contrato", flex: 1 },
        { field: "monto", headerName: "Monto", flex: 1 },
        { field: "estado", headerName: "Estado", flex: 1 },
        { field: "fechaDeCobro", headerName: "Cobrado el", flex: 1 },
        { field: "fechaDeFactura", headerName: "Fecha Factura", flex: 1 },
        { field: "numeroFactura", headerName: "Num. Factura", flex: 1 },
    ];

    const _export = React.useRef(null);
    const excelExport = () => {
        if (_export.current !== null) {
            _export.current.save(contratos);
        }
    };

    const GetAgencia = () => {
        fetch(`https://localhost:7200/Usuarios/GetAgenciaByRUT/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }, // Convert object to JSON string
        })
            .then((result) => result.json())
            .then((data) => {
                setAgencia(data);
                if (data) {
                    GetContratosAgencia(data.agenciaId);
                }

            });
    }

    const handleEditar = () => {
        if (agencia != null) {
            fetch("https://localhost:7200/Usuarios/EditAgencia", {
                method: "Patch",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(agencia), // Convert object to JSON string
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
        }
    }

    const GetContratosAgencia = (id) => {
        fetch(`https://localhost:7200/Archivador/GetContratosByAgencia/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }, // Convert object to JSON string
        })
            .then((result) => result.json())
            .then((result) => {
                setContratos(result);
            });
    }

    const handleRutChange = (event, newValue) => {
        agencia.Rut = event;
    };

    useEffect(() => {
        GetAgencia();
    }, []);


    return (
        <div>
            <div className="d-flex">
                <h1 className="whiteFont">{contratos[0]?.nombreAgencia}</h1>
                <input type="text" onChange={e => handleRutChange(e.target.value)} defaultValue={agencia?.rut} />
                <Button variant="primary" onClick={handleEditar}>Editar</Button>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{ marginLeft: 16 }}
                    onClick={() => {
                        excelExport()
                    }}
                >
                    <FontAwesomeIcon icon="fas fa-file-excel" />
                </Button>
            </div>
            <div>
                <div className="" style={{ width: "80vw", height: "100%" }}>
                    <ExcelExport data={contratos} ref={_export}>
                        <DataGrid
                            className="tableStyle"
                            getRowId={(row) => row.haber + row.debe + row.saldo}
                            rows={contratos}
                            columns={columnsContratos}
                            initialState={{
                                pagination: {
                                    paginationModel: { page: 0, pageSize: 50 },
                                },
                            }}
                            pageSizeOptions={[5, 10, 50, 100]}
                            slots={{ toolbar: GridToolbar }}
                        /></ExcelExport>

                </div>
            </div>
        </div>
    )
}

export default Agencia;