using Application.DTOs;

namespace Application.Services;

public interface ICompradorService
{
    Task<IEnumerable<CompradorDto>> GetAllAsync();
    Task<CompradorDto?> GetByIdAsync(Guid id);
    Task<CompradorDto> CreateAsync(CreateCompradorDto dto);
    Task<CompradorDto> UpdateAsync(Guid id, UpdateCompradorDto dto);
    Task DeleteAsync(Guid id);
}
