using System.ComponentModel.DataAnnotations;

namespace Classes
{
    public class ContratoDto
    {
        [Key]
        public int Id { get; set; }
        public DateTime Fecha { get; set; }
        public string? NombreAgencia { get; set; }
        public string? RutAgencia { get; set; }
        public string? NombreLocutor { get; set; }
        public int CiLocutor { get; set; }
        public decimal Monto { get; set; }
        public int Descuento { get; set; }
        public string? Estado { get; set; }
        public DateTime? FechaDeCobro { get; set; }
        public DateTime? FechaDeFactura { get; set; }
        public bool? FacturaPropia { get; set; }
        public int? NumeroContrato { get; set; }
        public int? NumeroFactura { get; set; }
    }

}