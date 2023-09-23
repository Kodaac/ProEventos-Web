using System;
using System.Collections.Generic;
using System.Linq;
using ApiProjeto.Models;
using Microsoft.AspNetCore.Mvc;

namespace ApiProjeto.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventoController : ControllerBase
    {
        public IEnumerable<Evento> _evento = new Evento[] {
            new Evento{
                EventoId = 1,
                Tema = "Angular e DotNet",
                Local = "São Paulo",
                Lote = "1",
                QtdPessoas = 250,
                DataEvento = DateTime.Now.AddDays(2).ToString(),
                ImagemUrl = "foto.png"
            },
            new Evento{
                EventoId = 2,
                Tema = "Angular e suas novidades",
                Local = "São José do Rio Preto",
                Lote = "2",
                QtdPessoas = 350,
                DataEvento = DateTime.Now.AddDays(3).ToString(),
                ImagemUrl = "foto1.png"
            }
        };

        public EventoController()
        {
           
        }

        [HttpGet]
        public IEnumerable<Evento> Get()
        {
           return _evento;
        }

        [HttpGet("{id}")]
        public IEnumerable<Evento> GetById(int id)
        {
           return _evento.Where(evento => evento.EventoId == id);
        }
    }
}
