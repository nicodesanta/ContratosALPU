using ArchivadorALPU.Repositories.IRepositories;
using ArchivadorALPU.Repositories.Services;
using Classes;
using ClosedXML.Excel;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ArchivadorALPU.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ArchivadorController : ControllerBase
    {
        private readonly IContratoRepository contratoRepository;
        private readonly ILocutorRepository locutorRepository;
        private readonly IAgenciaRepository agenciaRepository;
        private readonly IPagosRepository pagosRepository;
        private readonly PlanillaService planillaService;

        public ArchivadorController(IContratoRepository contratoRepository, PlanillaService planillaService, ILocutorRepository locutorRepository, IPagosRepository pagosRepository, IAgenciaRepository agenciaRepository)
        {
            this.contratoRepository = contratoRepository;
            this.planillaService = planillaService;
            this.locutorRepository = locutorRepository;
            this.pagosRepository = pagosRepository;
            this.agenciaRepository = agenciaRepository;
        }

        // POST: ArchivadorController/Create
        [HttpPost, Route("AgregarContrato")]
        public IActionResult Create([FromBody] Contrato contrato)
        {
            try
            {
                var contrato1 = this.contratoRepository.AddContrato(contrato);
                return new ObjectResult(contrato1) { StatusCode = 200 };
            }
            catch (Exception ex)
            {
                // Log the exception or handle it appropriately
                // You might also return a specific error response to the client
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpPost, Route("AgregarContratoStrings")]
        public IActionResult CreateWithStrings([FromBody] ContratoDto contrato)
        {
            try
            {
               this.contratoRepository.AddContratoStrings(contrato);
                return new ObjectResult("Ok") { StatusCode = 200 };
            }
            catch (Exception ex)
            {
                // Log the exception or handle it appropriately
                // You might also return a specific error response to the client
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        // POST: ArchivadorController/Create
        [HttpPost, Route("AgregarContratoPDF")]
        public IActionResult AgregarContratoPDF([FromBody] Contrato contrato)
        {
            try
            {
                var contrato1 = this.contratoRepository.AddContrato(contrato);
                return new ObjectResult(contrato1) { StatusCode = 200 };
            }
            catch (Exception ex)
            {
                // Log the exception or handle it appropriately
                // You might also return a specific error response to the client
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }


        [HttpGet, Route("GetContratos")]
        public async Task<ActionResult<IEnumerable<ContratoDto>>> GetContratos()
        {
            try
            {
                var contratos = this.contratoRepository.GetContratos();
                return Ok(contratos);
            }
            catch (Exception ex)
            {
                // Log the exception or handle it appropriately
                // You might also return a specific error response to the client
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpPost, Route("SetContratoCobrado/{id}/{fecha}")]
        public async Task<ActionResult<IEnumerable<ContratoDto>>> SetContratoCobrado(int id,DateTime fecha)
        {
            try
            {
                ContratoDto contrato = this.contratoRepository.GetContratoById(id);

                FechaDePago nueva = new FechaDePago(fecha, contrato.Id,contrato.CiLocutor, Decimal.Round(contrato.Monto * (decimal)0.07, 2), contrato.Monto - Decimal.Round(contrato.Monto * (decimal)0.29, 2), contrato.Monto);
                this.pagosRepository.Add(nueva);
                this.contratoRepository.SetContratoCobrado(id,fecha);
                return Ok();
            }
            catch (Exception ex)
            {
                // Log the exception or handle it appropriately
                // You might also return a specific error response to the client
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
        [HttpPost, Route("SetContratoFacturado/{id}/{numFactura}/{fecha}/{ivaPropio}")]
        public async Task<ActionResult<IEnumerable<ContratoDto>>> SetContratoFacturado(int id,DateTime fecha,int numFactura,bool ivaPropio)
        {
            try
            {
                
                this.contratoRepository.SetContratoFacturado(id,fecha,numFactura, ivaPropio);
                return Ok();
            }
            catch (Exception ex)
            {
                // Log the exception or handle it appropriately
                // You might also return a specific error response to the client
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpPost, Route("ArmarPlanilla/{fecha}")]
        public IActionResult ArmarPlanilla([FromBody] List<int> contratos, DateTime fecha)
        {
            try
            {

                var contratosParaPlanilla = this.contratoRepository.GetContratosIds(contratos);

                var stream = planillaService.CrearPlanilla(contratosParaPlanilla,fecha);
                return new FileContentResult(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                {
                    FileDownloadName = "XXXName.xlsx"
                };
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpPost, Route("ArmarDetalleDeIva/{mes}/{UI}")]
        public IActionResult ArmarDetalleDeIva(int mes,decimal ui)
        {
            try
            {

                var contratosParaDetalle = this.contratoRepository.GetContratosFacturadosEnElMes(mes);
                var stream = planillaService.CrearDetalleDeIva(contratosParaDetalle,ui);
                return new FileContentResult(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                {
                    FileDownloadName = "XXXName.xlsx"
                };
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpGet, Route("GetContratosByLocutor/{ciLocutor}")]
        public async Task<ActionResult<IEnumerable<ContratoDto>>> GetContratosByLocutor(int ciLocutor)
        {
            Locutor locutor = this.locutorRepository.GetLocutorByCi(ciLocutor);
   
            try
            {
                if (locutor != null)
                {
                 var contratosDeLocutor = this.contratoRepository.GetContratosByLocutor(locutor);
                return Ok(contratosDeLocutor);
                }

                return null;
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpGet, Route("GetContratosByAgencia/{idAgencia}")]
        public async Task<ActionResult<IEnumerable<ContratoDto>>> GetContratosByAgencia(int idAgencia)
        {
            Agencia agencia = this.agenciaRepository.GetAgenciaById(idAgencia);

            try
            {
                if (agencia != null)
                {
                    var contratosDeAgencia = this.contratoRepository.GetContratosByAgencia(agencia);
                    return Ok(contratosDeAgencia);
                }

                return null;
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpGet, Route("GetEstadoDeCuenta/{ciLocutor}")]
        public async Task<ActionResult<IEnumerable<LineaEstadoCuenta>>> GetEstadoDeCuenta(int ciLocutor)
        {
            Locutor locutor = this.locutorRepository.GetLocutorByCi(ciLocutor);
            List<FechaDePago> pagos = this.pagosRepository.GetPagosLocutor(locutor);
            try
            {
                if(locutor != null)
                {
                 var estadoDeCuenta = this.contratoRepository.GetEstadoDeCuenta(locutor,pagos);
                return Ok(estadoDeCuenta);
                }
                return null;
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
    }
}


