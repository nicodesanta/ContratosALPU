using ArchivadorALPU.Repositories.IRepositories;
using Classes;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ArchivadorALPU.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ArchivadorController : ControllerBase
    {
        private readonly IContratoRepository contratoRepository;

        public ArchivadorController(IContratoRepository contratoRepository)
        {
            this.contratoRepository = contratoRepository;
        }

        // POST: ArchivadorController/Create
        [HttpPost]
        [Route("AgregarContrato")]
        public ActionResult Create([FromBody] Contrato contrato)
        {
            try
            {
                this.contratoRepository.AddContrato(contrato);
                return RedirectToAction(nameof(Index));
            }
            catch (Exception ex)
            {
                // Log the exception or handle it appropriately
                // You might also return a specific error response to the client
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
    }
}
