using Application.DTOs;
using Entities.Entidades;
using Domain.Interfaces;

namespace Application.Services;

public class CompradorService : ICompradorService
{
    private readonly ICompradorRepository _repository;

    public CompradorService(ICompradorRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<CompradorDto>> GetAllAsync()
    {
        var compradores = await _repository.GetAllAsync();
        return compradores.Select(MapToDto);
    }

    public async Task<CompradorDto?> GetByIdAsync(Guid id)
    {
        var comprador = await _repository.GetByIdAsync(id);
        return comprador is null ? null : MapToDto(comprador);
    }

    public async Task<CompradorDto> CreateAsync(CreateCompradorDto dto)
    {
        var comprador = new Comprador(dto.Nome, dto.Email, dto.Telefone, dto.Endereco);
        await _repository.AddAsync(comprador);
        await _repository.SaveChangesAsync();
        return MapToDto(comprador);
    }

    public async Task<CompradorDto> UpdateAsync(Guid id, UpdateCompradorDto dto)
    {
        var comprador = await _repository.GetByIdAsync(id);
        if (comprador is null)
            throw new KeyNotFoundException($"Comprador com id '{id}' não encontrado.");

        comprador.Update(dto.Nome, dto.Email, dto.Telefone, dto.Endereco);
        await _repository.UpdateAsync(comprador);
        await _repository.SaveChangesAsync();
        return MapToDto(comprador);
    }

    public async Task DeleteAsync(Guid id)
    {
        var comprador = await _repository.GetByIdAsync(id);
        if (comprador is null)
            throw new KeyNotFoundException($"Comprador com id '{id}' não encontrado.");

        await _repository.DeleteAsync(id);
        await _repository.SaveChangesAsync();
    }

    private static CompradorDto MapToDto(Comprador comprador)
    {
        return new CompradorDto
        {
            Id = comprador.Id,
            Nome = comprador.Nome,
            Email = comprador.Email,
            Telefone = comprador.Telefone,
            Endereco = comprador.Endereco
        };
    }
}
