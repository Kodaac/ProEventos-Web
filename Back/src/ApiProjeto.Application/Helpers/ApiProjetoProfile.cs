using ApiProjeto.Domain;
using ApiProjeto.Application.DTOs;
using AutoMapper;
using ApiProjeto.Domain.Identity;

namespace ApiProjeto.Helpers
{
    public class ApiProjetoProfile : Profile
    {
        public ApiProjetoProfile()
        {
            CreateMap<Evento, EventoDTO>().ReverseMap();
            CreateMap<Lote, LoteDTO>().ReverseMap();
            CreateMap<RedeSocial, RedeSocialDTO>().ReverseMap();
            CreateMap<Palestrante, PalestranteDTO>().ReverseMap();

            CreateMap<User, UserDTO>().ReverseMap();
            CreateMap<User, UserLoginDTO>().ReverseMap();
            CreateMap<User, UserUpdateDTO>().ReverseMap();

        }
    }
}