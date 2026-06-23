using Application.DTOs;
using Entities.Entidades;
using Domain.Interfaces;

namespace Application.Services;

public class CarneService : ICarneService
{
    private readonly ICarneRepository _repository;

    public CarneService(ICarneRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<CarneDto>> GetAllAsync()
    {
        var carnes = await _repository.GetAllAsync();
        return carnes.Select(MapToDto);
    }

    public async Task<CarneDto?> GetByIdAsync(Guid id)
    {
        var carne = await _repository.GetByIdAsync(id);
        return carne is null ? null : MapToDto(carne);
    }

    public async Task<CarneDto> CreateAsync(CreateCarneDto dto)
    {
        var carne = new Carne(dto.Nome, dto.Tipo, dto.PrecoKg);
        await _repository.AddAsync(carne);
        await _repository.SaveChangesAsync();
        return MapToDto(carne);
    }

    public async Task<CarneDto> UpdateAsync(Guid id, UpdateCarneDto dto)
    {
        var carne = await _repository.GetByIdAsync(id);
        if (carne is null)
            throw new KeyNotFoundException($"Carne com id '{id}' não encontrada.");

        carne.Update(dto.Nome, dto.Tipo, dto.PrecoKg, carne.Ativo);
        await _repository.UpdateAsync(carne);
        await _repository.SaveChangesAsync();
        return MapToDto(carne);
    }

    public async Task DeleteAsync(Guid id)
    {
        var carne = await _repository.GetByIdAsync(id);
        if (carne is null)
            throw new KeyNotFoundException($"Carne com id '{id}' não encontrada.");

        if (await _repository.HasPedidosAsync(id))
            throw new InvalidOperationException("Carne possui pedidos vinculados");

        await _repository.DeleteAsync(id);
        await _repository.SaveChangesAsync();
    }

    private static CarneDto MapToDto(Carne carne)
    {
        return new CarneDto
        {
            Id = carne.Id,
            Nome = carne.Nome,
            Tipo = carne.Tipo,
            PrecoKg = carne.PrecoKg,
            Ativo = carne.Ativo
        };
    }
}
