import React, { useEffect, useState, useRef } from "react";
import Button from "@mui/material/Button";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faDollar, faFileInvoice, faUser } from "@fortawesome/free-solid-svg-icons";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
library.add(faDollar, faFileInvoice);



const Locutor = () => {
    const [locutor, setLocutor] = useState([]);
    const columns = [
        { field: "fecha", headerName: "Fecha", flex: 1 },
        { field: "documento", headerName: "Documento", flex: 1 },
        { field: "numero", headerName: "Numero", flex: 1 },
        { field: "nombreAgencia", headerName: "Nombre agencia", flex: 1 },
        { field: "detalleContrato", headerName: "Detalle", flex: 1 },
        { field: "debe", headerName: "Debe", flex: 1 },
        { field: "haber", headerName: "Haber", flex: 1 },
        { field: "saldo", headerName: "Saldo", flex: 1 },
    ];
    const columnsContratos = [
        { field: "id", headerName: "ID", flex: 1 },
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

    const [estadoDeCuenta, setEstadoDeCuenta] = useState([]);
    const [contratos, setContratos] = useState([]);
    const rows = estadoDeCuenta;
    const { id } = useParams();

    const GetLocutor = () => {
        fetch(`https://localhost:7200/Usuarios/GetLocutorByCi/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }, // Convert object to JSON string
        })
            .then((result) => result.json())
            .then((data) => {
                setLocutor(data);
                GetEstadoDeCuenta();
                GetContratosLocutor();
            });
    }

    const GetEstadoDeCuenta = () => {
        fetch(`https://localhost:7200/Archivador/GetEstadoDeCuenta/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }, // Convert object to JSON string
        })
            .then((result) => result.json())
            .then((data) => {
                setEstadoDeCuenta(data);
            });
    }
    const GetContratosLocutor = () => {
        fetch(`https://localhost:7200/Archivador/GetContratosByLocutor/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }, // Convert object to JSON string
        })
            .then((result) => result.json())
            .then((data) => {
                setContratos(data);
            });
    }
    useEffect(() => {
        GetLocutor();
    }, []);

    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleCiChange = (event, newValue) => {
        locutor.Ci = event;
    };
    const handleMailChange = (event, newValue) => {
        locutor.Mail = event;
    };

    const handleEditar = () => {
        console.log(locutor)
        if (locutor != null) {
            fetch("https://localhost:7200/Usuarios/EditLocutor", {
                method: "Patch",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(locutor), // Convert object to JSON string
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


    function getRowId(row) {
        return row.internalId;
    }

    return (
        <div>
            <div className="w-100">
                <div className="w-50 mt-5 " style={{ marginLeft: "2vh" }}>
                    <div className="card" >
                        <div className="card-body">
                            <h5 className="card-title">{locutor.nombre} {locutor.apellido}</h5>
                            <input type="number" onChange={e => handleCiChange(e.target.value)} defaultValue={locutor.ci} />
                            <input type="text" onChange={e => handleMailChange(e.target.value)} defaultValue={locutor.mail} />
                            <Button variant="primary" onClick={handleEditar}>Editar</Button>
                        </div>
                    </div>
                </div>
                <div>
                </div>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value} className="whiteFont">
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                <Tab label="Estado de cuenta" value="1" />
                                <Tab label="Contratos" value="2" />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <div className="d-flex justify-content-center mt-5 text-center">
                                <div className="" style={{ width: "80vw", height: "100%" }}>
                                    <DataGrid
                                        className="tableStyle"
                                        getRowId={(row) => row.haber + row.debe + row.saldo}
                                        rows={rows}
                                        columns={columns}
                                        initialState={{
                                            pagination: {
                                                paginationModel: { page: 0, pageSize: 50 },
                                            },
                                        }}
                                        pageSizeOptions={[5, 10, 50, 100]}
                                    />
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel value="2"> <div className="d-flex justify-content-center mt-5 text-center">
                            <div className="" style={{ width: "80vw", height: "100%" }}>
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
                                />
                            </div>
                        </div></TabPanel>
                    </TabContext>
                </Box>
            </div>
        </div>

    );
};
export default Locutor;
