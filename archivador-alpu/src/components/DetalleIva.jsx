import React, { useEffect, useState, useRef } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const DetalleIva = () => {
    const [mes, setMes] = useState(null);
    const [UI, setUI] = useState(null);

    const handleMesChange = (event, newValue) => {
        setMes(event.currentTarget.value)
    };
    const handleUIChange = (event, newValue) => {
        setUI(event.currentTarget.value)
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


    const handleSubmit = () => {
        fetch(`https://localhost:7200/Archivador/ArmarDetalleDeIva/${mes}/${UI}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: null, // Convert object to JSON string
        })
            .then((res) => {
                res.blob().then(blob => download(blob))
            })
            .catch((error) => {
                console.error("There was a problem with the fetch operation:", error);
            });
    }

    return (
        <div className="mt-5">
            <div className="ml-5">
                <TextField id="standard-basic" type="number" label="Mes" value={mes} variant="outlined" onChange={handleMesChange} />
                <TextField id="standard-basic" type="number" label="UI" value={UI} variant="outlined" onChange={handleUIChange} />
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
        </div>
    );
};
export default DetalleIva;
