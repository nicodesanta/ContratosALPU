using Classes;

namespace ArchivadorALPU.Repositories.IRepositories
{
    public interface IPagosRepository
    {
        List<FechaDePago> GetPagosLocutor(Locutor locutor);
       FechaDePago Add(FechaDePago pago);
    }
}
