using Microsoft.EntityFrameworkCore.Infrastructure;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Classes;

public class Agencia
{
    private Agencia(ILazyLoader lazyLoader)
    {
        LazyLoader = lazyLoader;
    }

    public Agencia()
    {

    }
    [JsonIgnore]
    private ILazyLoader LazyLoader { get; set; }
    [Key]
    public int AgenciaId { get; set; }
    public string? Nombre { get; set; }
    public string? Rut { get; set; }
    public string? Mail { get; set; }
    public int? Demora { get; set; }
    [JsonIgnore]
    private ICollection<Contrato> _contratos;
    [JsonIgnore]
    public ICollection<Contrato>? Contratos
    {
        get => LazyLoader.Load(this, ref _contratos);
        set => _contratos = value;
    }


}