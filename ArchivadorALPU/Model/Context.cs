using Classes;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using System.Collections.Generic;
using System.Data.Entity;
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
        optionsBuilder.UseSqlServer("server=.; database=GastroDB; user id=sa; password=123;");
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
       
       
    }
    public Microsoft.EntityFrameworkCore.DbSet<Contrato> Contratos { get; set; }
    public Microsoft.EntityFrameworkCore.DbSet<Agencia> Agencias { get; set; }

}
