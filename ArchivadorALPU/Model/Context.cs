using Classes;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Diagnostics.Metrics;
using System.Reflection.Metadata;
using DbContext = Microsoft.EntityFrameworkCore.DbContext;

namespace ArchivadorALPU.Model;

public class Context : DbContext
{
    public Context(DbContextOptions<Context> options)
          : base(options)
    {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer(@"Server=(localdb)\mssqllocaldb;Database=alpuserver;Trusted_Connection=True");
        
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

        modelBuilder.Entity<Contrato>()
        .HasOne(c => c.Agencia)           // Contrato has one Agencia
        .WithMany(a => a.Contratos)       // Agencia can have many Contratos
        .HasForeignKey(c => c.AgenciaId)  // Foreign key property in Contrato
        .IsRequired(false);               // Make the relationship optional

        base.OnModelCreating(modelBuilder);
    }

       

    
    public Microsoft.EntityFrameworkCore.DbSet<Contrato> Contrato { get; set; }
    public Microsoft.EntityFrameworkCore.DbSet<Agencia> Agencia { get; set; }
    public Microsoft.EntityFrameworkCore.DbSet<Locutor> Locutor { get; set; }
    public Microsoft.EntityFrameworkCore.DbSet<FechaDePago> FechasDePago { get; set; }

}
