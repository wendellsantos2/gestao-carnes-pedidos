using Application.DTOs;

namespace Application.Services;

public interface ICarneService
{
    Task<IEnumerable<CarneDto>> GetAllAsync();
    Task<CarneDto?> GetByIdAsync(Guid id);
    Task<CarneDto> CreateAsync(CreateCarneDto dto);
    Task<CarneDto> UpdateAsync(Guid id, UpdateCarneDto dto);
    Task DeleteAsync(Guid id);
}
