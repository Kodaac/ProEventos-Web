using System;
using System.Collections.Generic;
using System.Linq;
using ApiProjeto.Persistence;
using Microsoft.AspNetCore.Mvc;
using SQLitePCL;
using ApiProjeto.Persistence.Contexto;
using ApiProjeto.Application.Contratos;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using ApiProjeto.Application.DTOs;

namespace ApiProjeto.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventosController : ControllerBase
    {
        private readonly IEventoService _eventoService;
        public EventosController(IEventoService eventoService)
        {
            _eventoService = eventoService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
           try
           {
                var eventos = await _eventoService.GetAllEventosAsync(true);
                if(eventos == null) return NoContent();

                return Ok(eventos);
           }
           catch (Exception ex)
           {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar recuperar eventos. Erro: {ex.Message}");
           }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                    var evento = await _eventoService.GetEventoByIdAsync(id);
                    if(evento == null) return NoContent();

                    return Ok(evento);
            }
            catch (Exception ex)
            {
                    return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar recuperar eventos. Erro: {ex.Message}");
            }
        }

        [HttpGet("tema/{tema}")]
        public async Task<IActionResult> GetByTema(string tema)
        {
            try
            {
                var eventos = await _eventoService.GetAllEventosByTemaAsync(tema, true);
                if(eventos == null) return NoContent();

                return Ok(eventos);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar recuperar eventos. Erro: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(EventoDTO model)
        {
            try
            {
                var evento = await _eventoService.AddEvento(model);
                if(evento == null) return BadRequest("Erro ao tentar adicionar evento.");

                return Ok(evento);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar adicionar evento. Erro: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, EventoDTO model)
        {
            try
            {
                var evento = await _eventoService.UpdateEvento(id, model);
                if(evento == null) return BadRequest("Erro ao tentar atualizar evento.");

                return Ok(evento);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar atualizar evento. Erro: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                if(await _eventoService.DeleteEvento(id))
                {
                    return Ok("Evento deletado");
                } 
                else 
                {
                    return BadRequest("Evento não deletado");
                }

            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar deletar evento. Erro: {ex.Message}");
            }
        }
    }
}
