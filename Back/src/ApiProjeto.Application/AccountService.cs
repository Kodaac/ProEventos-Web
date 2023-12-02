using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApiProjeto.Application.Contratos;
using ApiProjeto.Application.DTOs;
using ApiProjeto.Domain.Identity;
using ApiProjeto.Persistence.Contratos;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ApiProjeto.Application
{
    public class AccountService : IAccountService
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IMapper _mapper;
        private readonly IUserPersist _userPersist;
        public AccountService(UserManager<User> userManager, SignInManager<User> signInManager, IMapper mapper, IUserPersist userPersist)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _mapper = mapper;
            _userPersist = userPersist;
        }
        public async Task<SignInResult> CheckUserPasswordAsync(UserUpdateDTO userUpdateDto, string password)
        {
            try
            {
                var user = await _userManager.Users.SingleOrDefaultAsync(user => user.UserName == userUpdateDto.Username.ToLower());

                return await _signInManager.CheckPasswordSignInAsync(user, password, false);
            }
            catch (Exception e)
            {
                
                throw new Exception($"Erro ao tentar verificar password.Erro: {e.Message}");
            }
        }

        public async Task<UserUpdateDTO> CreateAccountAsync(UserDTO userDto)
        {
            try
            {
                var user = _mapper.Map<User>(userDto);

                var result = await _userManager.CreateAsync(user, userDto.Password);

                if(result.Succeeded) 
                {
                    var userToReturn = _mapper.Map<UserUpdateDTO>(user);
                    return userToReturn;
                }

                return null;
            }
            catch (Exception e)
            {
                
                throw new Exception($"Erro ao tentar criar usuário.Erro: {e.Message}");
            }
        }

        public async Task<UserUpdateDTO> GetUserByUserNameAsync(string username)
        {
            try
            {
                var user = await _userPersist.GetUserByUserNameAsync(username);
                if(user == null) return null;

                var userUpdateDto = _mapper.Map<UserUpdateDTO>(user);
                return userUpdateDto;
            }
            catch (Exception e)
            {
                
                throw new Exception($"Erro ao tentar encontrar usuário por Username.Erro: {e.Message}");
            }
        }

        public async Task<UserUpdateDTO> UpdateAccount(UserUpdateDTO userUpdateDto)
        {
            try
            {
                var user = await _userPersist.GetUserByUserNameAsync(userUpdateDto.Username);
                if(user == null) return null;

                userUpdateDto.Id = user.Id;

                _mapper.Map(userUpdateDto, user);

                if(userUpdateDto.Password != null) 
                {
                    var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                    await _userManager.ResetPasswordAsync(user, token, userUpdateDto.Password);
                }

                _userPersist.Update<User>(user);

                if(await _userPersist.SaveChangesAsync())
                {
                    var userRetorno = await _userPersist.GetUserByUserNameAsync(user.UserName);

                    return _mapper.Map<UserUpdateDTO>(userRetorno);
                }

                return null;
            }
            catch (Exception e)
            {
                
                throw new Exception($"Erro ao tentar atualizar usuário.Erro: {e.Message}");
            }
        }

        public async Task<bool> UserExist(string username)
        {
            try
            {
                return await _userManager.Users.AnyAsync(user => user.UserName == username.ToLower());
            }
            catch (Exception e)
            {
                
                throw new Exception($"Erro ao tentar verificar se o usuário existe.Erro: {e.Message}");
            }
        }
    }
}