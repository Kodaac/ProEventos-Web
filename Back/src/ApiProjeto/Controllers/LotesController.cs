﻿using System;
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
    public class LotesController : ControllerBase
    {
        private readonly ILoteService _loteService;
    
        public LotesController(ILoteService loteService)
        {
            _loteService = loteService;
        }

        [HttpGet("{eventoId}")]
        public async Task<IActionResult> Get(int eventoId)
        {
           try
           {
                var lotes = await _loteService.GetLotesByEventoIdAsync(eventoId);
                if(lotes == null) return NoContent();

                return Ok(lotes);
           }
           catch (Exception ex)
           {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar recuperar lotes. Erro: {ex.Message}");
           }
        }

        [HttpPut("{eventoId}")]
        public async Task<IActionResult> SaveLotes(int eventoId, LoteDTO[] models)
        {
            try
            {
                var lotes = await _loteService.SaveLotes(eventoId, models);
                if(lotes == null) return NoContent();
                
                return Ok(lotes);  
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar salvar lotes. Erro: {ex.Message}");
            }
        }

        [HttpDelete("{eventoId}/{loteId}")]
        public async Task<IActionResult> Delete(int eventoId, int loteId)
        {
            try
            {
                var lote = await _loteService.GetLoteByIdsAsync(eventoId, loteId);
                if(lote == null) return NoContent();

                return await _loteService.DeleteLote(lote.EventoId, lote.Id) ? Ok(new {message = "Lote deletado"}) : throw new Exception("Ocorreu um problema não específico ao tentar deletar lote.");
                
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar deletar lotes. Erro: {ex.Message}");
            }
        }
    }
}
