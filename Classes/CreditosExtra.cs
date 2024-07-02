using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Classes
{
    public class CreditosExtra
    {
        [Key]
        public int Id { get; set; }
        public string Tipo { get; set; }
        public decimal Monto { get; set; }

    }
}
