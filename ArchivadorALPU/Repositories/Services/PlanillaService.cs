
using Classes;
using ClosedXML.Excel;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.IO;

namespace ArchivadorALPU.Repositories.Services
{
    public class PlanillaService
    {
        public PlanillaService() { }

        public MemoryStream CrearPlanilla(List<ContratoDto> contratos,DateTime fecha)
        {
            var contratosPorLocutor = contratos.GroupBy(x => x.NombreLocutor).ToList();
            using (var wbook = new XLWorkbook())
            {

                var workbook = new XLWorkbook();
                var ws = workbook.Worksheets.Add("Planilla");

                ws.Cell(1, 1).Value = "Locutor";
                ws.Cell(1, 2).Value = "NO.CTO";
                ws.Cell(1, 3).Value = "Pieza";
                ws.Cell(1, 4).Value = "Factura";
                ws.Cell(1, 5).Value = "Importe";
                ws.Cell(1, 6).Value = "Importe";
                ws.Cell(1, 7).Value = "Agencia";
                ws.Cell(1, 8).Value = "Retenciones 7%";
                ws.Cell(1, 9).Value = "Cuotas";
                ws.Cell(1, 10).Value = "Libretas";
                ws.Cell(1, 11).Value = "IVA";
                ws.Cell(1, 11).Value = "IRPF";
                ws.Cell(1, 12).Value = "Total";
                ws.Row(1).Style.Font.Bold = true;
                ws.Cell(2, 3).Value = fecha;

                var contador = 5;
                foreach (var locutores in contratosPorLocutor)
                {
                    contador = contador+3;
                    ws.Cell(contador + 1, 1).Value = locutores.Key;
                    int count = 0;
                    Decimal acumuladoIVA = 0;
                    Decimal acumuladoMontoMasIVA = 0;
                    foreach (var cobranzas in locutores) {
                        count++;
                        var montoIva = Decimal.Round(cobranzas.Monto * (decimal)0.22, 2);
                        ws.Cell(contador + count, 2).Value = cobranzas.NumeroContrato;
                        ws.Cell(contador + count, 3).Value = "Servicio de locucion";
                        ws.Cell(contador + count, 4).Value = cobranzas.Monto;
                        ws.Cell(contador + count, 5).Value = montoIva + cobranzas.Monto;
                        if(cobranzas.FacturaPropia.HasValue && !cobranzas.FacturaPropia.Value) acumuladoIVA = acumuladoIVA + montoIva;
                        if (cobranzas.FacturaPropia.HasValue && !cobranzas.FacturaPropia.Value) acumuladoMontoMasIVA = montoIva + cobranzas.Monto;
                    }
                    if(count == locutores.Count())
                    {
                        Decimal porcentajeAlpu = Decimal.Round(locutores.Sum(x => x.Monto) * (decimal)0.07, 2);
                        Decimal totalCobrado = locutores.Sum(x => x.Monto);
                        ws.Cell(contador + count + 1, 4).Value = totalCobrado;
                        ws.Cell(contador + count + 1, 5).Value = acumuladoMontoMasIVA;
                        ws.Cell(contador + count + 1, 5).Style.Border.TopBorder = XLBorderStyleValues.Thin;
                        ws.Cell(contador + count + 1, 4).Style.Border.TopBorder = XLBorderStyleValues.Thin;
                        ws.Cell(contador + count + 1, 8).Value = porcentajeAlpu;
                        ws.Cell(contador + count + 1, 11).Value = acumuladoIVA;
                        ws.Cell(contador + count + 1, 12).Value = totalCobrado - acumuladoIVA - porcentajeAlpu;

                    }
                    
                }

                ws.ColumnWidth = 18;

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    stream.Flush();
                    return stream;
                }
            }
        }


        public MemoryStream CrearDetalleDeIva(List<ContratoDto> contratos,decimal ui)
        {

            using (var wbook = new XLWorkbook())
            {
                var contratosPorLocutor = contratos.GroupBy(x => x.NombreLocutor).ToList();
                var workbook = new XLWorkbook();
                var ws = workbook.Worksheets.Add("Detalle");

                ws.Cell(1, 1).Value = "Fecha";
                ws.Cell(1, 2).Value = "N.Factura";
                ws.Cell(1, 3).Value = "Locutor";
                ws.Cell(1, 4).Value = "CI";
                ws.Cell(1, 5).Value = "Monto";
                ws.Cell(1, 6).Value = "IVA";
                ws.Cell(1, 7).Value = "Monto total";
                ws.Cell(1, 8).Value = "Total por locutor";
                ws.Cell(1, 9).Value = "Iva por locutor";
                ws.Cell(1, 10).Value = "IRPF";

                ws.Row(1).Style.Font.Bold = true;

                int locutores = 0;
                int totalLineas = 1;
                foreach (var item in contratosPorLocutor)
                {
                 locutores++;
                 int count = 0;
                    Decimal montoAcumulado = 0;
                    Decimal ivaAcumulado = 0;
                    foreach (var contrato in item)
                    {
                        if (contrato.FacturaPropia.HasValue && !contrato.FacturaPropia.Value)
                        {
                            totalLineas++;
                            count++;


                            ws.Cell(totalLineas, 1).Value = contrato.FechaDeFactura;
                            ws.Cell(totalLineas, 2).Value = contrato.NumeroFactura;
                            ws.Cell(totalLineas, 3).Value = contrato.NombreLocutor;
                            ws.Cell(totalLineas, 4).Value = contrato.CiLocutor;
                            ws.Cell(totalLineas, 5).Value = contrato.Monto;
                            ws.Cell(totalLineas, 6).Value = Decimal.Round(contrato.Monto * (decimal)0.22, 2);
                            ws.Cell(totalLineas, 7).Value = contrato.Monto + Decimal.Round(contrato.Monto * (decimal)0.22, 2);

                            montoAcumulado = montoAcumulado + contrato.Monto;
                            ivaAcumulado = Decimal.Round(montoAcumulado * (decimal)0.22, 2);

                            if (count == item.Count())
                            {
                                ws.Cell(totalLineas, 8).Value = montoAcumulado;
                                ws.Cell(totalLineas, 9).Value = ivaAcumulado;
                                if (montoAcumulado >= Decimal.Round(ui * (decimal)10000, 2))
                                {
                                    ws.Cell(totalLineas, 10).Value = Decimal.Round(contrato.Monto * (decimal)0.07, 2);
                                }

                            }
                        }

                    }
                          

                }
                ws.ColumnWidth = 16;

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    stream.Flush();
                    return stream;
                }
            }


        }




    }
}
