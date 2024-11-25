using Tiner.DTOs;
using Tiner.Entities;
using AutoMapper;
using Tiner.Extensions;

namespace Tiner.Helpers;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<AppUser, TinerDto>().ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.Dob.CalculateAge()))
            .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain)!.Url));
        CreateMap<Photo, PhotoDto>();
    }
}