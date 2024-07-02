using Classes;

namespace ArchivadorALPU.Repositories.IRepositories
{
    public interface IContratoRepository
    {
        Contrato AddContrato(Contrato contrato);
        void AddContratoStrings(ContratoDto contrato);
        public List<ContratoDto> GetContratos();
        public ContratoDto GetContratoById(int id);
        public List<ContratoDto> GetContratosIds(List<int> ids);
        public List<ContratoDto> GetContratosFacturadosEnElMes(int mes);
        public List<ContratoDto> GetContratosByLocutor(Locutor locutor);
        public List<ContratoDto> GetContratosByAgencia(Agencia agencia);
        public List<LineaEstadoCuenta> GetEstadoDeCuenta(Locutor locutor,List<FechaDePago>pagos);
        public Contrato SetContratoCobrado(int id,DateTime fecha);
        public Contrato SetContratoFacturado(int id, DateTime fecha, int numFactura,bool ivaPropio);
    }
}
