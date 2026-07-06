using MediatR;

public class AskAssistantHandler : IRequestHandler<AskAssistantCommand, string>
{
    private readonly IAiAssistantService _assistantService;

    public AskAssistantHandler(IAiAssistantService assistantService)
    {
        _assistantService = assistantService;
    }

    public Task<string> Handle(AskAssistantCommand request, CancellationToken cancellationToken)
    {
        return _assistantService.AskAsync(request.UserId, request.Message, request.History, cancellationToken);
    }
}
