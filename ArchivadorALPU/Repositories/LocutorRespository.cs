using ArchivadorALPU.Model;
using ArchivadorALPU.Repositories.IRepositories;
using Classes;

namespace ArchivadorALPU.Repositories
{
    public class LocutorRespository:ILocutorRepository
    {
        private readonly Context context;

        public LocutorRespository(Context context)
        {
            this.context = context;
        }

        public IQueryable<Locutor> GetLocutores()
        {
           return context.Locutor;

        }
        public Locutor GetLocutorByCi(int ci)
        {
            Locutor locutor = context.Locutor.Where(x => x.Ci == ci).Single();
            return locutor;
        }
        public Locutor AddLocutor(Locutor locutor)
        {
            context.Locutor.Add(locutor);
            context.SaveChanges();
            return locutor;
        }

        private BuscadorDto MapResultadosBuscados(Locutor locutor)
        {
            BuscadorDto resultadoMapped = new BuscadorDto
            {
                Nombre = locutor.Nombre + " " + locutor.Apellido,
                Ci = locutor.Ci.ToString(),
                Tipo = "Locutor"

            };
            return resultadoMapped;
        }

        public List<BuscadorDto> GetAllForBuscador(BuscadorPaginado buscadorPaginado)
        {
            List<BuscadorDto> resultado = new List<BuscadorDto>();
            foreach (var item in context.Locutor.Where(x => x.Nombre.Contains(buscadorPaginado.value) || x.Apellido.Contains(buscadorPaginado.value)))
            {
                resultado.Add(MapResultadosBuscados(item));
            }
            return resultado;
        }

        public Locutor EditLocutor(Locutor locutor)
        {
            Locutor locutorAEditar = context.Locutor.Where(x => x.Id == locutor.Id).Single();
            locutorAEditar.Ci = locutor.Ci;
            locutorAEditar.Mail = locutor.Mail;
            locutorAEditar.Nombre = locutor.Nombre;
            context.SaveChanges();
            return locutor;
        }
    }
}
