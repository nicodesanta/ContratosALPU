namespace Classes
{
    public class Contrato
    {
        public int Id { get; set; }
        public DateTime Fecha { get; set; }
        public Agencia Agencia { get; set; }
        public string Monto { get; set;}

        public bool Descuento { get; set; }

    }
}