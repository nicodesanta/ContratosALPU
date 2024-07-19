using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Classes
{
    public class Retencion
    {
        public Retencion() { }

        public Retencion(int idLocutor, int ciLocutor, decimal monto, DateTime fecha)
        {
            IdLocutor = idLocutor;
            CiLocutor = ciLocutor;
            Monto = monto;
            Fecha = fecha;
        }

        public int Id { get; set; }
        public int IdLocutor { get; set; }
        public int CiLocutor { get; set; }
        public decimal Monto { get; set; }
        public DateTime Fecha { get; set; }

    }
}
