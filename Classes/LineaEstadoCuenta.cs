using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Classes
{
    public class LineaEstadoCuenta
    {
        public LineaEstadoCuenta(DateTime? fecha, string documento, int? numero, string nombreAgencia, string detalleContrato, decimal debe, decimal haber, decimal saldo, decimal retDGI)
        {
            Fecha = fecha;
            Documento = documento;
            Numero = numero;
            NombreAgencia = nombreAgencia;
            DetalleContrato = detalleContrato;
            Debe = debe;
            Haber = haber;
            Saldo = saldo;
            RetDGI = retDGI;
        }

        public DateTime? Fecha {  get; set; }
        public string Documento { get; set; }
        public int? Numero { get; set; }
        public string NombreAgencia { get; set; }
        public string DetalleContrato { get; set; }
        public decimal Debe { get; set; }
        public decimal Haber { get; set; }
        public decimal Saldo { get; set; }
        public decimal RetDGI { get; set; }
    }
}
