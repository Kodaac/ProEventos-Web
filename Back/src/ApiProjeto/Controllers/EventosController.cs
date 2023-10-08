using System;
using System.Collections.Generic;
using System.Linq;
using ApiProjeto.Data;
using ApiProjeto.Models;
using Microsoft.AspNetCore.Mvc;
using SQLitePCL;

namespace ApiProjeto.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventosController : ControllerBase
    {
        private readonly DataContext _context;
        public EventosController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<Evento> Get()
        {
           return _context.Eventos;
        }

        [HttpGet("{id}")]
        public Evento GetById(int id)
        {
           return _context.Eventos.Where(evento => evento.EventoId == id).FirstOrDefault();
        }
    }
}
