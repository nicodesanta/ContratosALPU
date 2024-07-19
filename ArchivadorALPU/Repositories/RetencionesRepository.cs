using ArchivadorALPU.Model;
using ArchivadorALPU.Repositories.IRepositories;
using Classes;
using Microsoft.EntityFrameworkCore;

namespace ArchivadorALPU.Repositories
{
    public class RetencionesRepository:IRetencionesRepository
    {
        private readonly Context context;
        public RetencionesRepository(Context context) {
            this.context = context;
        }
        public Retencion Add(Retencion retencion)
        {
            this.context.Retenciones.Add(retencion);
            context.SaveChanges();
            return retencion;
        }

        public void Delete(int id)
        { 
            Retencion  retencion = this.context.Retenciones.Where(x => x.Id == id).FirstOrDefault();
            if(retencion != null)
            {
                this.context.Retenciones.Remove(retencion);
                context.SaveChanges();
            }
           
        }

        public List<Retencion> GetRetencionesLocutor(int locutor)
        {
            List<Retencion> retenciones = this.context.Retenciones.Where(x => x.IdLocutor == locutor || x.CiLocutor == locutor).ToList();
            return retenciones;
        }
    }
}
