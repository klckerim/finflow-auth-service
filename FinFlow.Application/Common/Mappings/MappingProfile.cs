using AutoMapper;
using FinFlow.Domain.Entities;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Wallet, WalletDto>();
    }
}
