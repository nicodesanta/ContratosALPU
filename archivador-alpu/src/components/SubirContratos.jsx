
import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import pdfToText from "react-pdftotext";
import { PDFDocument } from 'pdf-lib';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function File(props) {
    return <li className="whiteFont">{props.brand.name}</li>;
}

const SubirContratos = () => {
    const [selectedFiles, setSelectedFiles] = useState([])
    const [selectedFilesArray, setSelectedFilesArray] = useState([])
    const [rut, setRut] = useState("")
    const [locutor, setLocutor] = useState("")
    const [valor, setValor] = useState("")
    const [numeroContrato, setNumContrato] = useState("")
    const [fecha, setFecha] = useState("")
    const [agencia, setAgencia] = useState("")

    function extractText(event) {
        const file = event;
        pdfToText(file)
            .then((text) => {
                handleSubmit(text)
            })
            .catch((error) => console.error("Failed to extract text from pdf"));
    }

    const handleNewText = ({ }) => {
        extractFormData(selectedFiles[0])
        // selectedFiles.forEach(element => {
        //     extractFormData(element)
        // });
    };

    const extractFormData = async (file) => {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const form = pdfDoc.getForm();
            const fields = form.getFields();

            const extractedData = fields.map(field => {
                let value = "";

                // Check if getText is a function
                if (typeof field.getText === "function") {
                    try {
                        value = field.getText();
                    } catch (error) {
                        console.error(`Error extracting text from field ${field.getName()}:`, error);
                    }
                }

                return {
                    name: field.getName(),
                    value: (typeof value === "string") ? value : ""
                };
            });

            setValues(extractedData)
        } catch (error) {
            console.error('Error extracting form data:', error);
        }
    };

    const setValues = (data) => {
        data.map(field => {
            if (field.name == "CTO N") {
                setNumContrato(field.value);
            } else if (field.name == "Date") {
                var newData = field.value.replace(/(\d+[/])(\d+[/])/, '$2$1');
                var data = new Date(newData);
                setFecha(data);
            }
            else if (field.name == "RUT") {
                setRut(field.value)
            }
            else if (field.name == "El precio acordado es de $U/U$s") {
                const regex = /\('([^']+)',\)/g
                var valor = field.value.replace(/[^0-9\.]+/g, "");

                setValor(valor)
            }
            else if (field.name == "Contratante yPOR OTRA PARTE") {
                setLocutor(field.value)
            }
            else if (field.name == "La firma (Agencia de Publicidad/Cliente)") {
                setAgencia(field.value)
            }
        });
    }

    const handleSubmit = (e) => {
        let contrato = null;
        if (fecha != "" && agencia != "" && locutor != "" && numeroContrato != "" && valor != "") {
            contrato = {
                fecha: fecha,
                NombreAgencia: agencia,
                NombreLocutor: locutor,
                monto: valor,
                numeroContrato: numeroContrato,
            };
        }
        if (contrato != null) {
            fetch("https://localhost:7200/Archivador/AgregarContratoStrings", {
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
        }
    };

    const handleChangeLocutor = (event) => {
        setLocutor(event.target.value);
    };
    const handleChangeValor = (event) => {
        setValor(event.target.value)
    }
    const handleChangeRut = (event) => {
        setRut(event.target.value)
    }
    const handleChangeNContrato = (event) => {
        setNumContrato(event.target.value)
    }
    const handleChangeFecha = (event) => {
        setFecha(event.target.value)
    }
    const handleAgenciaChange = (event) => {
        setAgencia(event.target.value)
    }


    const handleUpload = ({ target }) => {
        if (target.files) {
            let array = Array.from(target.files);
            setSelectedFilesArray(array);
            setSelectedFiles(target.files)
        }
    };

    return (
        <div>
            <div className="w-50 d-flex justify-content-center">
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}

                >
                    Subir
                    <VisuallyHiddenInput type="file" onChange={(e) => handleUpload(e)} multiple />
                </Button>
            </div>
            <div className="w-50 d-flex justify-content-center">
                <ul>
                    {selectedFilesArray && selectedFilesArray?.map((car) => <File className="whiteFont" brand={car} />)}
                </ul>

            </div>
            <div className="w-50 d-flex justify-content-center">
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    onClick={handleNewText}
                >
                    Confirmar
                </Button>
            </div>
            {
                <div className="d-flex justify-content-center text-center mt-3">
                    <div className="card w-50 p-3">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group mt-2">
                                <TextField id="standard-basic" label="Locutor" InputLabelProps={{ shrink: true }} value={locutor} variant="outlined" onChange={handleChangeLocutor} />
                            </div>
                            <div className="form-group mt-2 ">
                                <TextField id="standard-basic" label="Monto" InputLabelProps={{ shrink: true }} value={valor} variant="outlined" onChange={handleChangeValor} />
                            </div>
                            <div className="form-group mt-2">
                                <TextField id="standard-basic" label="RUT" InputLabelProps={{ shrink: true }} value={rut} variant="outlined" onChange={handleChangeRut} />
                            </div>
                            <div className="form-group mt-2">
                                <TextField id="standard-basic" label="Num.Contrato" InputLabelProps={{ shrink: true }} value={numeroContrato} variant="outlined" onChange={handleChangeNContrato} />
                            </div>
                            <div className="form-group mt-2">
                                <LocalizationProvider dateAdapter={AdapterDayjs} >
                                    <DatePicker onChange={handleChangeFecha} defaultValue={dayjs(fecha)} />
                                </LocalizationProvider>
                            </div>
                            <div className="form-group mt-2">
                                <TextField id="standard-basic" label="Agencia" InputLabelProps={{ shrink: true }} value={agencia} variant="outlined" onChange={handleAgenciaChange} />
                            </div>
                            <Button variant="primary" className="mt-2" onClick={handleSubmit}>Subir</Button>
                        </form>
                    </div>
                </div>
            }
        </div>
    )
}

export default SubirContratos;