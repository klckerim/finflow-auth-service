using Microsoft.Extensions.Logging.Abstractions;
using NSubstitute;
using NSubstitute.ExceptionExtensions;

namespace FinFlow.Tests;

public class FallbackAiAssistantServiceTests
{
    private const string Message = "Geçen ay ne kadar harcadım?";

    private static readonly Guid UserId = Guid.NewGuid();
    private static readonly IReadOnlyList<ChatMessageDto> History =
    [
        new("user", "Merhaba"),
        new("assistant", "Merhaba, nasıl yardımcı olabilirim?")
    ];

    private readonly IAiProvider _primary = Substitute.For<IAiProvider>();
    private readonly IAiProvider _fallback = Substitute.For<IAiProvider>();
    private readonly FallbackAiAssistantService _service;

    public FallbackAiAssistantServiceTests()
    {
        _primary.Name.Returns("Primary");
        _fallback.Name.Returns("Fallback");
        _service = new FallbackAiAssistantService(_primary, _fallback, NullLogger<FallbackAiAssistantService>.Instance);
    }

    [Fact]
    public async Task AskAsync_ShouldReturnPrimaryAnswer_AndNotCallFallback_WhenPrimarySucceeds()
    {
        _primary.AskAsync(UserId, Message, History, Arg.Any<CancellationToken>()).Returns("primary answer");

        var answer = await _service.AskAsync(UserId, Message, History);

        Assert.Equal("primary answer", answer);
        await _fallback.DidNotReceiveWithAnyArgs().AskAsync(default, default!, default!, default);
    }

    [Fact]
    public async Task AskAsync_ShouldUseFallback_WithSameUserMessageAndHistory_WhenPrimaryIsUnavailable()
    {
        _primary.AskAsync(UserId, Message, History, Arg.Any<CancellationToken>())
            .ThrowsAsync(new AiProviderUnavailableException("Primary", "server_error"));
        _fallback.AskAsync(UserId, Message, History, Arg.Any<CancellationToken>()).Returns("fallback answer");

        var answer = await _service.AskAsync(UserId, Message, History);

        Assert.Equal("fallback answer", answer);
        // The userId must reach the fallback unchanged — it scopes every tool call to the caller's data.
        await _fallback.Received(1).AskAsync(UserId, Message, History, Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task AskAsync_ShouldUseFallback_WhenPrimaryThrowsUnexpectedException()
    {
        _primary.AskAsync(UserId, Message, History, Arg.Any<CancellationToken>())
            .ThrowsAsync(new InvalidOperationException("provider bug"));
        _fallback.AskAsync(UserId, Message, History, Arg.Any<CancellationToken>()).Returns("fallback answer");

        var answer = await _service.AskAsync(UserId, Message, History);

        Assert.Equal("fallback answer", answer);
    }

    [Fact]
    public async Task AskAsync_ShouldReturnApology_AndNotThrow_WhenBothProvidersFail()
    {
        _primary.AskAsync(UserId, Message, History, Arg.Any<CancellationToken>())
            .ThrowsAsync(new AiProviderUnavailableException("Primary", "timeout"));
        _fallback.AskAsync(UserId, Message, History, Arg.Any<CancellationToken>())
            .ThrowsAsync(new AiProviderUnavailableException("Fallback", "rate_limited"));

        var answer = await _service.AskAsync(UserId, Message, History);

        Assert.False(string.IsNullOrWhiteSpace(answer));
        Assert.Contains("couldn't reach the AI assistant", answer);
    }
}
