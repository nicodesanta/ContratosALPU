import React, { useEffect, useState, useRef } from "react";
import Button from "@mui/material/Button";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faDollar, faFileInvoice, faUser, faTrash } from "@fortawesome/free-solid-svg-icons";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import * as dayjs from 'dayjs'
import { ExcelExport } from "@progress/kendo-react-excel-export";
library.add(faDollar, faFileInvoice, faTrash);



const Locutor = () => {
    const [locutor, setLocutor] = useState([]);
    const [retenciones, setRetenciones] = useState([]);
    const fechaRetencion = useRef("");
    const montoRetencion = useRef("");
    const columns = [
        {
            field: "fecha", headerName: "Fecha", flex: 1, valueFormatter: (params) => {
                if (params.value != null) {
                    return dayjs(params.value).format('DD/MM/YYYY');
                } else {
                    return ''; // Return an empty string or any default value you prefer
                }
            }
        },
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
        {
            field: "fecha", headerName: "Fecha", flex: 1, valueFormatter: (params) => {
                if (params.value != null) {
                    return dayjs(params.value).format('DD/MM/YYYY');
                } else {
                    return ''; // Return an empty string or any default value you prefer
                }
            }
        },
        { field: "nombreAgencia", headerName: "Agencia", flex: 1 },
        { field: "rutAgencia", headerName: "RUT", flex: 1 },
        { field: "nombreLocutor", headerName: "Locutor", flex: 1 },
        { field: "numeroContrato", headerName: "Numero de contrato", flex: 1 },
        { field: "monto", headerName: "Monto", flex: 1 },
        { field: "estado", headerName: "Estado", flex: 1 },
        {
            field: "fechaDeCobro", headerName: "Cobrado el", flex: 1, valueFormatter: (params) => {
                if (params.value != null) {
                    return dayjs(params.value).format('DD/MM/YYYY');
                } else {
                    return ''; // Return an empty string or any default value you prefer
                }
            }
        },
        {
            field: "fechaDeFactura", headerName: "Fecha Factura", flex: 1, valueFormatter: (params) => {
                if (params.value != null) {
                    return dayjs(params.value).format('DD/MM/YYYY');
                } else {
                    return ''; // Return an empty string or any default value you prefer
                }
            }
        },
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
                GetRetenciones();
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

    const GetRetenciones = (e) => {
        fetch(`https://localhost:7200/Usuarios/GetRetenciones/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
            .then((result) => result.json())
            .then((data) => {

                setRetenciones(data);
            })
            .catch((error) => {
                console.error("There was a problem with the fetch operation:", error);
            });

    }



    const handleSubmit = (e) => {
        const retencion = {
            fecha: fechaRetencion.current.value,
            ciLocutor: locutor.ci,
            idLocutor: locutor.id,
            monto: montoRetencion.current.value,
        };

        fetch("https://localhost:7200/Usuarios/AddRetencion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(retencion), // Convert object to JSON string
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                GetRetenciones();
                return res.json();

            })
            .catch((error) => {
                console.error("There was a problem with the fetch operation:", error);
            });
    };
    const handleDelete = (e) => {
        console.log(e)
        fetch(`https://localhost:7200/Usuarios/DeleteRetencion/${e}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                GetRetenciones()
                return res.json();
            })
            .catch((error) => {
                console.error("There was a problem with the fetch operation:", error);
            });
    };


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
                                <Tab label="Retenciones" value="3" />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <div className="d-flex justify-content-center mt-5 text-center">
                                <div className="" style={{ width: "80vw", height: "100%" }}>
                                    <ExcelExport data={rows} >
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
                                            slots={{ toolbar: GridToolbar }}
                                        />

                                    </ExcelExport>
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel value="2">
                            <div className="d-flex justify-content-center mt-5 text-center">
                                <div className="" style={{ width: "80vw", height: "100%" }}>
                                    <ExcelExport data={contratos} >
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
                                        />

                                    </ExcelExport>
                                </div>
                            </div></TabPanel>
                        <TabPanel value="3">

                            <div className="d-flex justify-content-center m-5">
                                <div className="" style={{ width: "30rem", height: "2rem" }}>
                                    <div className="d-flex justify-content-center gap-2">
                                        <input
                                            type="date"
                                            ref={fechaRetencion}
                                            className="form-control"
                                            placeholder="Username"
                                        />
                                        <input
                                            type="number"
                                            ref={montoRetencion}
                                            className="form-control"
                                            placeholder="Monto"
                                        />
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            onClick={handleSubmit}
                                        >
                                            Agregar
                                        </button>
                                    </div>
                                    {retenciones && retenciones?.map(function (ret) {
                                        return (
                                            <div className="card d-flex justify-content-center " style={{ marginTop: "1rem" }}>
                                                <div className="">
                                                    <div className="card-body d-flex justify-content-around p-1">
                                                        <p className="">{ret.fecha}</p>
                                                        <p className="">{ret.monto}</p>
                                                        <FontAwesomeIcon className="primary" icon="fa-solid fa-trash" onClick={() => handleDelete(ret.id)} />
                                                    </div>
                                                </div>

                                            </div>
                                        )
                                    })}


                                </div>
                            </div></TabPanel>
                    </TabContext>
                </Box>
            </div>
        </div>

    );
};
export default Locutor;
