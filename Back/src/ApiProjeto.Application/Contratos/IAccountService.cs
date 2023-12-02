using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApiProjeto.Application.DTOs;
using Microsoft.AspNetCore.Identity;

namespace ApiProjeto.Application.Contratos
{
    public interface IAccountService
    {
        Task<bool> UserExist(string username);
        Task<UserUpdateDTO> GetUserByUserNameAsync(string username);
        Task<SignInResult> CheckUserPasswordAsync(UserUpdateDTO userUpdateDto, string password);
        Task<UserUpdateDTO> CreateAccountAsync(UserDTO user);
        Task<UserUpdateDTO> UpdateAccount(UserUpdateDTO userUpdateDto);
    }
}