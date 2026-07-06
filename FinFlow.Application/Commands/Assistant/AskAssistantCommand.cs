using MediatR;

public record AskAssistantCommand(Guid UserId, string Message, IReadOnlyList<ChatMessageDto> History) : IRequest<string>;
