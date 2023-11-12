using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApiProjeto.Application.DTOs;

namespace ApiProjeto.Application.Contratos
{
    public interface ILoteService
    {
        Task<LoteDTO[]> SaveLotes(int eventoId, LoteDTO[] models);
        Task<bool> DeleteLote(int eventoId, int loteId);

        Task<LoteDTO[]> GetLotesByEventoIdAsync(int eventoId);
        Task<LoteDTO> GetLoteByIdsAsync(int eventoId, int loteId);
    }
}