using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Infrastructure.Internal;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Classes
{
    public class FechaDePago
    {
        public FechaDePago() { }
        private FechaDePago(ILazyLoader lazyLoader)
        {
            LazyLoader = lazyLoader;
        }
        [JsonIgnore]
        private ILazyLoader LazyLoader { get; set; }
        [Key]
        public int Id { get; set; }
        public int ContratoId { get; set; }
        public DateTime Fecha {  get; set; }
        public int LocutorId { get; set; }
        public decimal GestionDonacion { get; set; }
        public decimal MontoCobrado { get; set; }
        public decimal Monto { get; set; }

        public FechaDePago(DateTime fecha,int contratoId ,int locutorId, decimal gestionDonacion, decimal montoCobrado, decimal monto)
        {
            Fecha = fecha;
            LocutorId = locutorId;
            GestionDonacion = gestionDonacion;
            MontoCobrado = montoCobrado;
            Monto = monto;
            ContratoId = contratoId;
        }

        private Locutor _locutor;
        public Locutor? Locutor
        {
            get => LazyLoader.Load(this, ref _locutor);
            set => _locutor = value;
        }
    }
}
