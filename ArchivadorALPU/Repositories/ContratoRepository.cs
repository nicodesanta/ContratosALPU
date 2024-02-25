using ArchivadorALPU.Model;
using ArchivadorALPU.Repositories.IRepositories;
using Classes;

namespace ArchivadorALPU.Repositories
{


    public class ContratoRepository : IContratoRepository
    {
        private readonly Context context;
        public ContratoRepository(Context context)
        {
            this.context = context;
        }

        public Contrato AddContrato(Contrato contrato)
        {
            context.Contratos.Add(contrato);
            return contrato;
        }
    }
}