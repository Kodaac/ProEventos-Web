using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ApiProjeto.Application.DTOs
{
    public class EventoDTO
    {
        public int Id { get; set; }
        public string Local { get; set; }
        public string DataEvento { get; set; }
        
        [Required(ErrorMessage = "O campo {0} é obrigatório.")]
        [MinLength(3, ErrorMessage = "{0} deve ter no mínimo 4 caracteres.")]
        [MaxLength(50, ErrorMessage = "{0} deve ter no máximo 50 caracteres.")]
        public string Tema { get; set; }

        [Display(Name = "Quantidade de pessoas")]
        [Range(1, 120000, ErrorMessage = "{0} não pode ser menor que 1 e maior que 120.000")]
        public int QtdPessoas { get; set; }

        [RegularExpression(@".*\.((jpe?g|png|gif|bmp))$", ErrorMessage = "Não é uma imagem válida(gif, jpeg, jpg, bmp ou png)")]
        public string ImagemUrl { get; set; }

        [Required(ErrorMessage = "{0} é obrigatório.")]
        [Phone(ErrorMessage = "{0} está com numero inválido.")]
        public string Telefone { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório." )]
        [Display(Name = "e-mail")]
        [EmailAddress(ErrorMessage = "O campo {0} precisa ser um e-mail válido.")]
        public string Email { get; set; }

        public IEnumerable<LoteDTO> Lote { get; set; }
        public IEnumerable<RedeSocialDTO> RedesSociais { get; set; }
        public IEnumerable<PalestranteDTO> PalestrantesEventos { get; set; }
    }
}