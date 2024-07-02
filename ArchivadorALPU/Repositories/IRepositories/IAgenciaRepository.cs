using Classes;

namespace ArchivadorALPU.Repositories.IRepositories
{
    public interface IAgenciaRepository
    {
        IEnumerable<Agencia> GetAgencias();
        Agencia GetAgenciaById(int id);
        Agencia GetAgenciaByRut(string rut);
        Agencia AddAgencia(Agencia agencia);
        Agencia EditAgencia(Agencia agencia);
        List<BuscadorDto> GetAllForBuscador(BuscadorPaginado buscadorPaginado);
    }
}
