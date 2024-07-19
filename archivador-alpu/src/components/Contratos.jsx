import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faDollar, faFileInvoice, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ExcelExport } from '@progress/kendo-react-excel-export';
import * as dayjs from 'dayjs'

library.add(faDollar, faFileInvoice, faTrash);

const Contratos = () => {
    const [contratos, setContratos] = useState([]);

    const [open, setOpen] = React.useState(false);
    const [openFacturado, setOpenFacturado] = React.useState(false);
    const [openCobrado, setOpenCobrado] = React.useState(false);
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);

    const rows = contratos;
    const handleClose = () => setOpen(false);
    const handleCloseFacturador = () => setOpenFacturado(false);
    const handleCloseCobrado = () => setOpenCobrado(false);
    const handleCloseDeleteModal = () => setOpenDeleteModal(false);

    const fecha = useRef("");
    const numFactura = useRef("");
    const fechaFacturado = useRef("");
    const fechaCobrado = useRef("");

    const navigate = useNavigate();

    const _export = React.useRef(null);

    const excelExport = () => {
        if (_export.current !== null) {
            _export.current.save(contratos);
        }
    };

    const [rowSelectionModel, setRowSelectionModel] = React.useState([]);

    const handleOpen = () => {
        setOpen(true);
    };
    const handleOpenFacturado = () => {
        setOpenFacturado(true);
    };
    const handleOpenCobrado = () => {
        setOpenCobrado(true);
    };
    const handleOpenDeleteModal = () => {
        setOpenDeleteModal(true);
    };

    const [checked, setChecked] = React.useState(false);

    const handleChange = () => {
        setChecked(!checked);
    };


    const handleNumFacturaChange = (event) => {
        numFactura.current = event.target.value;
    };

    // Function to update fechaFacturado ref
    const handleFechaFacturadoChange = (event) => {
        fechaFacturado.current = event.target.value;
    };
    const handleFechaCobradoChange = (event) => {
        fechaCobrado.current = event.target.value;
    };

    const renderDetailsButton = (params) => {
        return (
            <strong className="d-flex">
                <Button
                    variant="contained"
                    color="primary"

                    style={{ marginLeft: 5 }}
                    onClick={() => {
                        handleOpenFacturado();
                    }}
                >
                    <FontAwesomeIcon icon="fas fa-file-invoice" />
                </Button>
                <Button
                    variant="contained"
                    color="primary"

                    style={{ marginLeft: 5 }}
                    onClick={() => {
                        handleOpenCobrado();
                    }}
                >
                    <FontAwesomeIcon icon="fas fa-dollar" />
                </Button>
                <Button
                    variant="contained"
                    color="primary"

                    style={{ marginLeft: 5 }}
                    onClick={() => {
                        handleOpenDeleteModal();
                    }}
                >
                    <FontAwesomeIcon icon="fas fa-trash" />
                </Button>
            </strong>
        );
    };

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
        { field: "nombreAgencia", headerName: "Agencia", flex: 1, cellClassName: 'nombreAgenciaCell' },
        { field: "nombreLocutor", headerName: "Locutor", flex: 1, cellClassName: 'nombreLocutorCell' },
        { field: "numeroContrato", headerName: "N°Cont" },
        { field: "monto", headerName: "Monto" },
        { field: "estado", headerName: "Estado" },
        {
            field: "fechaDeCobro", headerName: "Cobrado el", flex: 1, valueFormatter: (params) => {
                if (params.value != null) {
                    return dayjs(params.value).format('DD/MM/YYYY');
                } else {
                    return ''; // Return an empty string or any default value you prefer
                }
            },
        },
        {
            field: "fechaDeFactura",
            headerName: "Fecha Factura",

            valueFormatter: (params) => {
                if (params.value != null) {
                    return dayjs(params.value).format('DD/MM/YYYY');
                } else {
                    return ''; // Return an empty string or any default value you prefer
                }
            }
        },
        { field: "numeroFactura", headerName: "Num. Factura" },
        {
            field: "col6",
            headerName: " ",
            width: 350,
            flex: 1,
            renderCell: renderDetailsButton,
            disableClickEventBubbling: true,
        },
    ];

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "auto",
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
    };



    const CallGetContratos = () => {
        fetch("https://localhost:7200/Archivador/GetContratos", {
            method: "GET",
            headers: { "Content-Type": "application/json" }, // Convert object to JSON string
        })
            .then((result) => result.json())
            .then((data) => {
                setContratos(data);
            });
    }

    useEffect(() => {
        CallGetContratos();
    }, []);

    const armarPlanilla = () => {
        fetch(
            `https://localhost:7200/Archivador/ArmarPlanilla/${fecha.current.value}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(rowSelectionModel), // Convert object to JSON string
            }
        )
            .then((res) => {
                res.blob().then(blob => download(blob))
            })
            .catch((error) => {
                console.error("There was a problem with the fetch operation:", error);
            });
    };


    function download(blob, filename) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        // the filename you want
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    const setContratoFacturado = () => {
        if (numFactura.current === "" || fechaFacturado.current === "") return;
        fetch(
            `https://localhost:7200/Archivador/SetContratoFacturado/${rowSelectionModel[0]}/${numFactura.current}/${fechaFacturado.current}/${checked}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(rowSelectionModel), // Convert object to JSON string
            }
        )
            .then((res) => {
                CallGetContratos();
            })
            .catch((error) => {
                console.error("There was a problem with the fetch operation:", error);
            });
    };
    const deleteContrato = () => {
        fetch(
            `https://localhost:7200/Archivador/DeleteContrato/${rowSelectionModel[0]}`,
            {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            }
        )
            .then((res) => {
                CallGetContratos();
            })
            .catch((error) => {
                console.error("There was a problem with the fetch operation:", error);
            });
    };
    const setContratoCobrado = () => {
        if (fechaCobrado.current === "") return;
        fetch(
            `https://localhost:7200/Archivador/SetContratoCobrado/${rowSelectionModel[0]}/${fechaCobrado.current}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(rowSelectionModel), // Convert object to JSON string
            }
        )
            .then((res) => {
                CallGetContratos();
            })
            .catch((error) => {
                console.error("There was a problem with the fetch operation:", error);
            });
    };


    const handleTableClick = (params) => {
        switch (params.field) {
            case "nombreLocutor":
                navigate(`/locutor/${params.row.ciLocutor}`)
                break;
            case "nombreAgencia":
                navigate(`/agencia/${params.row.rutAgencia}`)
                break;

            default:
                break;
        }
        console.log(params.field);
    };

    return (
        <div>
            <div className="d-flex text-end">
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{ marginLeft: 25 }}
                    onClick={() => {
                        handleOpen();
                    }}
                >
                    Armar planilla
                </Button>
            </div>
            <div className="d-flex text-end">

            </div>

            <div className="d-flex justify-content-center mt-5 text-center">
                <div className="" style={{ width: "100vw", height: "100%" }}>
                    <ExcelExport data={contratos} ref={_export}>
                        <DataGrid
                            checkboxSelection
                            rows={rows}
                            className="tableStyle"
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: { page: 0, pageSize: 30 },
                                },
                            }}
                            onCellClick={handleTableClick}
                            pageSizeOptions={[5, 10, 20, 30]}
                            onRowSelectionModelChange={(newRowSelectionModel) => {
                                setRowSelectionModel(newRowSelectionModel);
                            }}
                            rowSelectionModel={rowSelectionModel}
                            slots={{ toolbar: GridToolbar }}
                        />
                    </ExcelExport>
                </div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <div className="">
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Planilla
                            </Typography>
                            <input
                                type="date"
                                ref={fecha}
                                className="form-control"
                                placeholder="Username"
                            />
                        </div>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                style={{ marginLeft: 25 }}
                                onClick={() => {
                                    armarPlanilla();
                                }}
                            >
                                Confirmar
                            </Button>
                            <FontAwesomeIcon icon="fa-solid fa-dollar-sign" />
                        </Typography>
                    </Box>
                </Modal>
                <Modal
                    open={openFacturado}
                    onClose={handleCloseFacturador}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <div className="">
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Factura
                            </Typography>
                            <input
                                type="text"
                                onChange={handleNumFacturaChange}
                                placeholder="Numero Factura"
                                className="form-control ml-1"
                            />
                            <input
                                type="date"
                                onChange={handleFechaFacturadoChange}
                                placeholder="Fecha"
                                className="form-control ml-1"
                            />
                            <label>
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={handleChange}
                                />
                                IVA Propio
                            </label>
                        </div>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                style={{ marginLeft: 25 }}
                                onClick={() => {
                                    setContratoFacturado();
                                }}
                            >
                                Confirmar
                            </Button>
                            <FontAwesomeIcon icon="fa-solid fa-dollar-sign" />
                        </Typography>
                    </Box>
                </Modal>
                <Modal
                    open={openCobrado}
                    onClose={handleCloseCobrado}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <div className="">
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Cobro
                            </Typography>
                            <input
                                type="date"
                                onChange={handleFechaCobradoChange}
                                placeholder="Fecha"
                                className="form-control ml-1"
                            />
                        </div>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                style={{ marginLeft: 25 }}
                                onClick={() => {
                                    setContratoCobrado();
                                }}
                            >
                                Confirmar
                            </Button>
                            <FontAwesomeIcon icon="fa-solid fa-dollar-sign" />
                        </Typography>
                    </Box>
                </Modal>
                <Modal
                    open={openDeleteModal}
                    onClose={handleCloseDeleteModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <div className="">
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Eliminar contrato
                            </Typography>
                        </div>
                        <Typography id="modal-modal-description" sx={{ mt: 2, gap: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"

                                onClick={() => {
                                    handleCloseDeleteModal();
                                }}
                            >
                                No
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                style={{ marginLeft: 25 }}
                                onClick={() => {
                                    deleteContrato();
                                }}
                            >
                                Si
                            </Button>
                        </Typography>
                    </Box>
                </Modal>
            </div>
        </div>
    );
};
export default Contratos;
