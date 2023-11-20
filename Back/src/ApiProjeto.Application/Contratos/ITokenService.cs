using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApiProjeto.Application.DTOs;

namespace ApiProjeto.Application.Contratos
{
    public interface ITokenService
    {
        Task<string> CreateToken(UserUpdateDTO userUpdateDto);
    }
}