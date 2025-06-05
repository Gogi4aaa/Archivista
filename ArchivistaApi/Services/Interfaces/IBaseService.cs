using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ArchivistaApi.Services.Interfaces
{
    /// <summary>
    /// Base interface for all services defining common CRUD operations
    /// </summary>
    /// <typeparam name="TEntity">The type of entity this service handles</typeparam>
    /// <typeparam name="TKey">The type of the entity's primary key</typeparam>
    public interface IBaseService<TEntity, TKey> where TEntity : class
    {
        Task<IEnumerable<TEntity>> GetAllAsync();
        Task<TEntity> GetByIdAsync(TKey id);
        Task<TEntity> CreateAsync(TEntity entity);
        Task<TEntity> UpdateAsync(TEntity entity);
        Task<bool> DeleteAsync(TKey id);
    }
} 