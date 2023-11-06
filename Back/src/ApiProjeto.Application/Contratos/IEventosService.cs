using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApiProjeto.Application.DTOs;

namespace ApiProjeto.Application.Contratos
{
    public interface IEventoService
    {
        Task<EventoDTO> AddEvento(EventoDTO model);
        Task<EventoDTO> UpdateEvento(int eventoId, EventoDTO model);
        Task<bool> DeleteEvento(int eventoId);

        Task<EventoDTO[]> GetAllEventosAsync(bool includePalestrantes = false);
        Task<EventoDTO[]> GetAllEventosByTemaAsync(string tema, bool includePalestrantes = false);
        Task<EventoDTO> GetEventoByIdAsync(int eventoId, bool includePalestrantes = false);
    }
}