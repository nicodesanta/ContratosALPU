using ArchivadorALPU.Repositories.IRepositories;
using Classes;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace ArchivadorALPU.Controllers;

[ApiController]
[Route("[controller]")]

public class UsuariosController : ControllerBase
{
    private readonly ILocutorRepository locutorRepository;
    private readonly IAgenciaRepository agenciaRepository;
    private readonly IRetencionesRepository retencionRepository;

    public UsuariosController(ILocutorRepository _locutorRepository, IAgenciaRepository _agenciaRepository, IRetencionesRepository _retencionRepository)
    {
        this.locutorRepository = _locutorRepository;
        this.agenciaRepository = _agenciaRepository;
        this.retencionRepository = _retencionRepository;
    }

    // POST: ArchivadorController/Create
    [HttpGet, Route("GetLocutores")]

    public async Task<ActionResult<IEnumerable<Locutor>>> GetLocutores()
    {
        try
        {
            var locutores = this.locutorRepository.GetLocutores();
            return Ok(locutores);
        }
        catch (Exception ex)
        {
            // Log the exception or handle it appropriately
            // You might also return a specific error response to the client
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }

    // POST: ArchivadorController/Create
    [HttpPost, Route("AddLocutor")]

    public async Task<ActionResult<Locutor>> AddLocutor([FromBody] Locutor locutorReq)
    {
        try
        {
            Locutor locutor = this.locutorRepository.AddLocutor(locutorReq);
            return Ok(locutor);
        }
        catch (Exception ex)
        {
            // Log the exception or handle it appropriately
            // You might also return a specific error response to the client
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }

    // POST: ArchivadorController/Create
    [HttpPost, Route("AddAgencia")]

    public async Task<ActionResult<Agencia>> AddAgencia([FromBody] Agencia agenciaReq)
    {
        try
        {
            Agencia agencia = this.agenciaRepository.AddAgencia(agenciaReq);
            return Ok(agencia);
        }
        catch (Exception ex)
        {
            // Log the exception or handle it appropriately
            // You might also return a specific error response to the client
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }

    [HttpGet, Route("GetLocutorByCi/{ci}")]

    public async Task<ActionResult<IEnumerable<Locutor>>> GetLocutores(int ci)
    {
        try
        {
            var locutores = this.locutorRepository.GetLocutorByCi(ci);
            return Ok(locutores);
        }
        catch (Exception ex)
        {
            // Log the exception or handle it appropriately
            // You might also return a specific error response to the client
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }

    [HttpGet, Route("GetAgenciaByRUT/{rut}")]

    public async Task<ActionResult<Agencia>> GetAgencia(string rut)
    {
        try
        {
            var agencia = this.agenciaRepository.GetAgenciaByRut(rut);
            return Ok(agencia);
        }
        catch (Exception ex)
        {
            // Log the exception or handle it appropriately
            // You might also return a specific error response to the client
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }

    [HttpGet, Route("GetAgencias")]

    public async Task<ActionResult<IEnumerable<Agencia>>> GetAgencias()
    {
        try
        {
            var agencias = this.agenciaRepository.GetAgencias();
            return Ok(agencias);
        }
        catch (Exception ex)
        {
            // Log the exception or handle it appropriately
            // You might also return a specific error response to the client
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }

    [HttpPost, Route("GetAgenciasAndContratos")]

    public async Task<ActionResult<IEnumerable<BuscadorDto>>> GetAgenciasAndContratos([FromBody] BuscadorPaginado buscadorPaginado)
    {
        try
        {
            List<BuscadorDto> agencias = this.agenciaRepository.GetAllForBuscador(buscadorPaginado);
            List<BuscadorDto> locutores = this.locutorRepository.GetAllForBuscador(buscadorPaginado);
            List<BuscadorDto> data = agencias.Concat(locutores).ToList();

            return Ok(data);
        }
        catch (Exception ex)
        {
            // Log the exception or handle it appropriately
            // You might also return a specific error response to the client
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }

    [HttpPatch, Route("EditAgencia")]

    public async Task<ActionResult<Agencia>> EditAgencia([FromBody] Agencia agencia)
    {
        try
        {
            Agencia agenciaAEditar = this.agenciaRepository.EditAgencia(agencia);
            return Ok(agenciaAEditar);
        }
        catch (Exception ex)
        {
            // Log the exception or handle it appropriately
            // You might also return a specific error response to the client
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }

    [HttpPatch, Route("EditLocutor")]

    public async Task<ActionResult<Agencia>> EditLocutor([FromBody] Locutor locutor)
    {
        try
        {
            Locutor locutorAEditar = this.locutorRepository.EditLocutor(locutor);
            return Ok(locutorAEditar);
        }
        catch (Exception ex)
        {
            // Log the exception or handle it appropriately
            // You might also return a specific error response to the client
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }

    [HttpPost, Route("AddRetencion")]

    public async Task<ActionResult<Agencia>> AddRetencion([FromBody] Retencion retencion)
    {
        try
        {
            var result = this.retencionRepository.Add(retencion);
            return Ok(result);
        }
        catch (Exception ex)
        {
            // Log the exception or handle it appropriately
            // You might also return a specific error response to the client
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }

    [HttpDelete, Route("DeleteRetencion/{idRetencion}")]

    public async Task<ActionResult<Agencia>> DeleteRetencion(int idRetencion)
    {
        try
        {
            this.retencionRepository.Delete(idRetencion);
            return Ok();
        }
        catch (Exception ex)
        {
            // Log the exception or handle it appropriately
            // You might also return a specific error response to the client
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }

    [HttpGet, Route("GetRetenciones/{idLocutor}")]

    public async Task<ActionResult<Agencia>> GetRetenciones(int idLocutor)
    {
        try
        {
            var result = this.retencionRepository.GetRetencionesLocutor(idLocutor);
            return Ok(result);
        }
        catch (Exception ex)
        {
            // Log the exception or handle it appropriately
            // You might also return a specific error response to the client
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }
}
