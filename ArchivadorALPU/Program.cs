using ArchivadorALPU.Model;
using ArchivadorALPU.Repositories.IRepositories;
using ArchivadorALPU.Repositories;
using Classes;
using Microsoft.EntityFrameworkCore;

using Microsoft.Extensions.DependencyInjection;
using System.Data.Entity;
using System.Reflection.Metadata;
using Microsoft.AspNetCore.Cors.Infrastructure;
using DocumentFormat.OpenXml.Office2016.Drawing.ChartDrawing;
using ArchivadorALPU.Repositories.Services;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddMvc(options =>
        {
            options.SuppressAsyncSuffixInActionNames = false;

        });

        const string corsPolicyName = "ApiCORS";

        builder.Services.AddCors(options =>
        {
            options.AddPolicy(corsPolicyName, policy =>
            {
                policy.WithOrigins("http://localhost:3000").AllowAnyMethod().AllowAnyHeader().AllowCredentials();
            });
        });


        builder.Services.AddHttpContextAccessor();
        // Add services to the container.
        builder.Services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddScoped<IContratoRepository, ContratoRepository>();
        builder.Services.AddScoped<ILocutorRepository, LocutorRespository>();
        builder.Services.AddScoped<IAgenciaRepository, AgenciaRepository>();
        builder.Services.AddScoped<IPagosRepository, PagosRepository>();
        builder.Services.AddTransient<PlanillaService, PlanillaService>();

        builder.Services.AddDbContext<Context>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

        var app = builder.Build();


        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.UseCors(corsPolicyName);
        app.UseRouting();
        app.UseStaticFiles();

        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}