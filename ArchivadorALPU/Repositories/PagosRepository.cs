using ArchivadorALPU.Model;
using ArchivadorALPU.Repositories.IRepositories;
using Classes;
using System.Data.Entity;

namespace ArchivadorALPU.Repositories
{
    public class PagosRepository : IPagosRepository
    {
        private readonly Context context;

        public PagosRepository(Context context)
        {
            this.context = context;
        }
        public List<FechaDePago> GetPagosLocutor(Locutor locutor)
        {
            return context.FechasDePago.Where(x => x.LocutorId == locutor.Ci).Include(x => x.Locutor).ToList();
        }
        public FechaDePago Add(FechaDePago pago)
        {
            context.FechasDePago.Add(pago);
            context.SaveChanges();
            return pago;
        }

        //public void CheckRetencionIrpf()
        //{
        //    context.FechasDePago.Add(pago);
        //    context.SaveChanges();
        //    return pago;
        //}
    }
}
