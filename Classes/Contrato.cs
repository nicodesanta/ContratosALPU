using Microsoft.EntityFrameworkCore.Infrastructure;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Reflection.Metadata;
using System.Text.Json.Serialization;

namespace Classes
{
    public class Contrato
    {
        public Contrato() { }
        private Contrato(ILazyLoader lazyLoader)
        {
            LazyLoader = lazyLoader;
        }
        [JsonIgnore]
        private ILazyLoader LazyLoader { get; set; }
        [Key]
        public int Id { get; set; }
        public DateTime Fecha { get; set; }
     
        public int? AgenciaId { get; set; }
        public int? LocutorId { get; set; }
        public decimal Monto { get; set; }
        public int Descuento { get; set; }
        public string? Estado { get; set; }

        public string? Moneda { get; set; }
        public string? DetalleContrato { get; set; }
        public DateTime? FechaDeCobro { get; set; }
        public DateTime? FechaFacturado { get; set; }
        public bool FacturaPropia { get; set; }
        public int? NumeroFactura { get; set; }
        public int? NumeroContrato { get; set; }
        private Agencia _agencia;
        public Agencia? Agencia
        {
            get => LazyLoader.Load(this, ref _agencia);
            set => _agencia = value;
        }

        private Locutor _locutor;
        public Locutor? Locutor
        {
            get => LazyLoader.Load(this, ref _locutor);
            set => _locutor = value;
        }


    }

}