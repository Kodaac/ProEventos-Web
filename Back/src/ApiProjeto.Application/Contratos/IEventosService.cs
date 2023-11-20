using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApiProjeto.Application.DTOs;

namespace ApiProjeto.Application.Contratos
{
    public interface IEventoService
    {
        Task<EventoDTO> AddEvento(int userId, EventoDTO model);
        Task<EventoDTO> UpdateEvento(int userId, int eventoId, EventoDTO model);
        Task<bool> DeleteEvento(int userId, int eventoId);

        Task<EventoDTO[]> GetAllEventosAsync(int userId, bool includePalestrantes = false);
        Task<EventoDTO[]> GetAllEventosByTemaAsync(int userId, string tema, bool includePalestrantes = false);
        Task<EventoDTO> GetEventoByIdAsync(int userId, int eventoId, bool includePalestrantes = false);
    }
}