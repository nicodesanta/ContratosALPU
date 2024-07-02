using ArchivadorALPU.Model;
using ArchivadorALPU.Repositories.IRepositories;
using Classes;

namespace ArchivadorALPU.Repositories
{
    public class AgenciaRepository:IAgenciaRepository
    {
        private readonly Context context;

        public AgenciaRepository(Context context)
        {
            this.context = context;
        }

        public IEnumerable<Agencia> GetAgencias()
        {
            return context.Agencia.ToList();

        }

        public Agencia GetAgenciaById(int id)
        {
            Agencia agencia = context.Agencia.Where(x => x.AgenciaId == id).Single();
            return agencia;
        }

        public Agencia GetAgenciaByRut(string rut)
        {
            Agencia agencia = context.Agencia.Where(x => x.Rut == rut).Single();
            return agencia;
        }
        public Agencia AddAgencia(Agencia agencia)
        {
            context.Agencia.Add(agencia);
            context.SaveChanges();
            return agencia;
        }

        private BuscadorDto MapResultadosBuscados(Agencia agencia)
        {
            BuscadorDto resultadoMapped = new BuscadorDto
            {
                Nombre = agencia.Nombre,
                Rut = agencia.Rut,
                Tipo= "agencia"
            };
            return resultadoMapped;
        }

        public Agencia EditAgencia(Agencia agencia)
        {
            Agencia agenciaAEditar = context.Agencia.Where(x => x.AgenciaId == agencia.AgenciaId).Single();
            agenciaAEditar.Rut = agencia.Rut;
            context.SaveChanges();
            return agencia;
        }
        public List<BuscadorDto> GetAllForBuscador(BuscadorPaginado buscadorPaginado)
        {
            List<BuscadorDto> resultado = new List<BuscadorDto>();
            foreach (var item in context.Agencia.Where(x => x.Nombre.Contains(buscadorPaginado.value)))
            {
                resultado.Add(MapResultadosBuscados(item)); 
            } 
            return resultado;
        }
    }
}
