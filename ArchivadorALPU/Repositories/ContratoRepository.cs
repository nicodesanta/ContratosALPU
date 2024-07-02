using ArchivadorALPU.Model;
using ArchivadorALPU.Repositories.IRepositories;
using Classes;
using DocumentFormat.OpenXml.Office.CustomUI;
using System.Collections.Generic;
using System.Data.Entity;
using System.Diagnostics.Contracts;
using System.Linq;

namespace ArchivadorALPU.Repositories
{


    public class ContratoRepository : IContratoRepository
    {
        private readonly Context context;
        public ContratoRepository(Context context)
        {
            this.context = context;
        }

        public Contrato AddContrato(Contrato contrato)
        {
            context.Contrato.Add(contrato);
            context.SaveChanges();
            return contrato;
        }

        public Contrato SetContratoCobrado(int id, DateTime fecha)
        {
            Contrato contrato = context.Contrato.SingleOrDefault(contrato => contrato.Id == id);
            if (contrato != null)
            {
                contrato.Estado = "Cobrado";
                contrato.FechaDeCobro = fecha;
                context.SaveChanges();
                return contrato;
            }
            else
                return null;
                     
        }

        public Contrato SetContratoFacturado(int id,DateTime fecha,int numFactura,bool ivaPropio)
        {
            Contrato contrato = context.Contrato.SingleOrDefault(contrato => contrato.Id == id);
            if (contrato != null)
            {
                contrato.Estado = "Facturado";
                contrato.FechaFacturado = fecha;
                contrato.NumeroFactura = numFactura;
                contrato.FacturaPropia = ivaPropio;
                context.SaveChanges();
                return contrato;
            }
            else
                return null;
        }
        public List<ContratoDto> GetContratos()
        {

            List<ContratoDto> contratos = new List<ContratoDto>();

            foreach (var item in context.Contrato.ToList())
            {
               ContratoDto nuevoContrato =  new ContratoDto
                {
                    Id = item.Id,
                    Fecha = item.Fecha,
                    NombreAgencia = item.Agencia.Nombre,
                    RutAgencia = item.Agencia.Rut,
                    NombreLocutor = item.Locutor.Nombre + " " + item.Locutor.Apellido,
                    CiLocutor = item.Locutor.Ci,
                    Monto = item.Monto,
                    Descuento = item.Descuento,
                    Estado = item.Estado,
                   FechaDeFactura = item.FechaFacturado,
                   FacturaPropia = item.FacturaPropia,
                    FechaDeCobro = item.FechaDeCobro,
                    NumeroFactura = item.NumeroFactura,
                    NumeroContrato = item.NumeroContrato,
                };
                contratos.Add(nuevoContrato);
            }
            return contratos;
        }

        public ContratoDto GetContratoById(int id)
        {
            ContratoDto contrato = null;
            foreach (var item in context.Contrato.Where(c => c.Id == id).Include(c => c.Agencia).ToList())
            {
                contrato = this.MapContrato(item);
            }
            return contrato;
        }

       private ContratoDto MapContrato(Contrato contrato)
        {
            var contratoMapped = new ContratoDto
            {
                Id = contrato.Id,
                Fecha = contrato.Fecha,
                NombreAgencia = contrato.Agencia.Nombre,
                RutAgencia = contrato.Agencia.Rut,
                NombreLocutor = contrato.Locutor.Nombre + " " + contrato.Locutor.Apellido,
                CiLocutor = contrato.Locutor.Ci,
                Monto = contrato.Monto,
                Descuento = contrato.Descuento,
                Estado = contrato.Estado,
                FechaDeCobro = contrato.FechaDeCobro,
                FacturaPropia = contrato.FacturaPropia,
                NumeroContrato = contrato.NumeroContrato,
                FechaDeFactura = contrato.FechaFacturado,
                NumeroFactura = contrato.NumeroFactura,
            };
            return contratoMapped;
        }

        public List<ContratoDto> GetContratosIds(List<int> ids)
        {
            List<ContratoDto>contratos = new List<ContratoDto>();
            foreach (var id in ids)
            {
                contratos.Add(this.GetContratoById(id));

            }
            return contratos;
        }

        public List<ContratoDto> GetContratosFacturadosEnElMes(int mes)
        {
            List<ContratoDto> contratos = new List<ContratoDto>();
            foreach (var item in context.Contrato.Where(x => x.FechaFacturado.Value.Month == mes).ToList())
            {
                contratos.Add(this.MapContrato(item));
            }
            return contratos;
        }

        public List<ContratoDto> GetContratosByLocutor(Locutor locutor)
        {   
            if (locutor != null)
            {
                List<ContratoDto> contratos = new List<ContratoDto>();
                foreach (var item in context.Contrato.Where(x => x.LocutorId == locutor.Id).Include(c => c.Agencia).OrderBy(x => x.Fecha).ToList())
                {
                    contratos.Add(this.MapContrato(item));
                }
                return contratos;
            }
            else return null;    
        }

        public void AddContratoStrings(ContratoDto contrato)
        {
            Contrato nuevoContrato = new Contrato();
            nuevoContrato.NumeroContrato = contrato.NumeroContrato;
            nuevoContrato.Monto = contrato.Monto;
            nuevoContrato.Fecha = contrato.Fecha;
            
            if (!String.IsNullOrEmpty(contrato.NombreLocutor))
            {

                Locutor locutor = context.Locutor.Where(x => x.Nombre +" " +  x.Apellido == contrato.NombreLocutor).First();
                nuevoContrato.LocutorId = locutor.Id;   

            }
            if (!String.IsNullOrEmpty(contrato.NombreAgencia))
            {
                Agencia agencia = context.Agencia.Where(x => x.Nombre == contrato.NombreAgencia).First();
                nuevoContrato.AgenciaId = agencia.AgenciaId;
            }
            this.AddContrato(nuevoContrato);
        }

        public List<ContratoDto> GetContratosByAgencia(Agencia agencia)
        {
            if (agencia != null)
            {
                List<ContratoDto> contratos = new List<ContratoDto>();
                foreach (var item in context.Contrato.Where(x => x.AgenciaId == agencia.AgenciaId).Include(c => c.Agencia).OrderBy(x => x.Fecha).ToList())
                {
                    contratos.Add(this.MapContrato(item));
                }
                return contratos;
            }
            else return null;
        }

        public List<LineaEstadoCuenta> GetEstadoDeCuenta(Locutor locutor, List<FechaDePago>pagos)
        {
            {
                List<LineaEstadoCuenta> lineas = new List<LineaEstadoCuenta>();
                decimal debe = 0;
                decimal haber = 0;
                decimal saldo = 0;

                var items = pagos.GroupBy(p => new { p.Fecha }).ToList();

                foreach (var item in items) 
                {
                    List<Contrato> contratosCobradosEnFechaDePago = new List<Contrato>();

                    foreach (FechaDePago fechaDePagoParaContrato in item)
                    {
                        contratosCobradosEnFechaDePago.Add(context.Contrato.Where(c => c.Id == fechaDePagoParaContrato.ContratoId).FirstOrDefault());                    
                    }

                    foreach (Contrato c in contratosCobradosEnFechaDePago)
                    {
                        LineaEstadoCuenta contrato = new LineaEstadoCuenta(c.FechaDeCobro, "Contrato", c.NumeroContrato, c.Agencia.Nombre, "Detalle", (c.Monto - Decimal.Round(c.Monto * (decimal)0.22, 2)), 0, 0, 0);
                        lineas.Add(contrato);
                    }

                    foreach (FechaDePago fechaDePagoParaContrato in item)
                    {
                        LineaEstadoCuenta donacion = new LineaEstadoCuenta(fechaDePagoParaContrato.Fecha, "", 0, "", "Donacion 4% ALPU", 0, Decimal.Round(fechaDePagoParaContrato.Monto * (decimal)0.04, 2), 0, 0);
                        LineaEstadoCuenta gestion = new LineaEstadoCuenta(fechaDePagoParaContrato.Fecha, "", 0, "", "Gestion 3%", 0, Decimal.Round(fechaDePagoParaContrato.Monto * (decimal)0.03, 2), 0, 0);
                        LineaEstadoCuenta pago = new LineaEstadoCuenta(fechaDePagoParaContrato.Fecha, "", 0, "", "Cobro efectivo", 0, fechaDePagoParaContrato.MontoCobrado, 0, 0);
                        lineas.Add(donacion);
                        lineas.Add(gestion);
                        lineas.Add(pago);
                    }              
                }
                Decimal acumulado = 0;
                foreach (var linea in lineas)
                {
                    acumulado = acumulado + linea.Debe - linea.Haber;
                    linea.Saldo = acumulado;
                }

                return lineas;
            }

        }
    }
}