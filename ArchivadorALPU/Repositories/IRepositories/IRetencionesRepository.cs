using Classes;

namespace ArchivadorALPU.Repositories.IRepositories
{
    public interface IRetencionesRepository
    {
        Retencion Add(Retencion pago);
        void Delete(int id);
        List<Retencion> GetRetencionesLocutor(int locutor);

    }
}
