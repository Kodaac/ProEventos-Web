using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApiProjeto.Domain;

namespace ApiProjeto.Persistence.Contratos
{
    public interface ILotePersist
    {
        //LOTES
        Task<Lote[]> GetLotesByEventoIdAsync(int eventoId);
        Task<Lote> GetLoteByIdsAsync(int eventoId, int id); //id do lote
    }
}