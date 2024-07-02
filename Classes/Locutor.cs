using Microsoft.EntityFrameworkCore.Infrastructure;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Classes
{
    public class Locutor
    {
        private Locutor(ILazyLoader lazyLoader)
        {
            LazyLoader = lazyLoader;
        } 

        public Locutor()
        {

        }
        [JsonIgnore]
        private ILazyLoader LazyLoader { get; set; }
        [Key]
        public int Id { get; set; }
        public string? Nombre { get; set; }
        public string? Apellido { get; set; }
        public string? Mail { get; set; }
        public int Ci { get; set; }
        [JsonIgnore]
        private ICollection<Contrato> _contratos;
        [JsonIgnore]
        public ICollection<Contrato>? Contratos
        {
            get => LazyLoader.Load(this, ref _contratos);
            set => _contratos = value;
        }
    }
}
