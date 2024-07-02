using Classes;

namespace ArchivadorALPU.Repositories.IRepositories
{
    public interface ILocutorRepository
    {
        IQueryable<Locutor> GetLocutores();
        Locutor GetLocutorByCi(int ci);
        Locutor AddLocutor(Locutor locutor);
        Locutor EditLocutor(Locutor locutor);
        List<BuscadorDto> GetAllForBuscador(BuscadorPaginado buscadorPaginado);
    }
}
