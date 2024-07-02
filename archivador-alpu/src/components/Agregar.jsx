import React, { useState } from "react";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const Agregar = () => {

    const [view, setView] = useState("locutor")
    const [nombre, setNombre] = useState("")
    const [rut, setRut] = useState("")
    const [apellido, setApellido] = useState("")
    const [mail, setMail] = useState("")
    const [ci, setCi] = useState("")


    const handleChange = (event) => {
        setView(event.target.value);
    };
    const handleChangeNombre = (event) => {
        setNombre(event.target.value);
    };
    const handleChangeRut = (event) => {
        setRut(event.target.value);
    };
    const handleChangeApellido = (event) => {
        setApellido(event.target.value);
    };
    const handleChangeMail = (event) => {
        setMail(event.target.value);
    };
    const handleChangeCi = (event) => {
        setCi(event.target.value);
    };

    const handleSubmit = (e) => {
        if (view === "locutor") {
            let locutor = null;
            if (nombre != "" && apellido != "" && mail != "" && ci != "") {
                locutor = {
                    nombre: nombre,
                    apellido: apellido,
                    mail: mail,
                    ci: ci,
                };
            }
            if (locutor != null) {
                fetch("https://localhost:7200/Usuarios/AddLocutor", {
                    method: "POST",
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
        } else if (view === "agencia") {
            let agencia = null;
            if (nombre != "" && rut != "" && mail != "") {
                agencia = {
                    nombre: nombre,
                    rut: rut,
                    mail: mail
                };
            }
            if (agencia != null) {
                fetch("https://localhost:7200/Usuarios/AddAgencia", {
                    method: "POST",
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
    };

    const renderSelectedItem = () => {
        switch (view) {
            case 'locutor':
                return <div className="card w-50" >
                    <div className="card-body">
                        <div className="form-group mt-1">
                            <TextField id="standard-basic" label="Nombre" InputLabelProps={{ shrink: true }} value={nombre} variant="outlined" onChange={handleChangeNombre} />
                        </div><div className="form-group mt-1">
                            <TextField id="standard-basic" label="Apellido" InputLabelProps={{ shrink: true }} value={apellido} variant="outlined" onChange={handleChangeApellido} />

                        </div>
                        <div className="form-group mt-1">
                            <TextField id="standard-basic" label="Mail" InputLabelProps={{ shrink: true }} value={mail} variant="outlined" onChange={handleChangeMail} />
                        </div>
                        <div className="form-group mt-1">
                            <TextField id="standard-basic" label="CI" InputLabelProps={{ shrink: true }} value={ci} variant="outlined" onChange={handleChangeCi} />
                        </div>

                    </div>
                </div>
            case 'agencia':
                return <div className="card  w-50" >
                    <div className="card-body">
                        <div className="form-group mt-2">
                            <TextField id="standard-basic" label="Nombre" InputLabelProps={{ shrink: true }} value={nombre} variant="outlined" onChange={handleChangeNombre} />
                        </div>
                        <div className="form-group mt-2">
                            <TextField id="standard-basic" label="RUT" InputLabelProps={{ shrink: true }} value={rut} variant="outlined" onChange={handleChangeRut} />
                        </div>
                        <div className="form-group mt-2">
                            <TextField id="standard-basic" label="Mail" InputLabelProps={{ shrink: true }} value={mail} variant="outlined" onChange={handleChangeMail} />
                        </div>
                    </div>
                </div>
            default:
                return null
        }
    }

    return (
        <div className="w-60">
            <div className="w-60 ">
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    className="text-white"
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                bgcolor: 'white',
                                border: "1px solid white",
                                '& .MuiMenuItem-root': {
                                    padding: 2,
                                    bgcolor: "white"
                                },
                                '& .MuiMenu-paper': {
                                    backgroundColor: 'dark.primary',
                                    color: 'text.light'
                                },
                            },
                        }
                    }}
                    value={view}
                    label="Age"
                    onChange={handleChange}
                >
                    <MenuItem value={"locutor"} className="whiteFont">Locutor</MenuItem>
                    <MenuItem value={"agencia"} className="whiteFont">Agencia</MenuItem>
                </Select>
            </div>
            {renderSelectedItem()}
            <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                onClick={handleSubmit}
            >
                Confirmar
            </Button>
        </div>


    );
};
export default Agregar;
