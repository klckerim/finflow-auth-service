using System.Reflection;
using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging.Abstractions;
using NSubstitute;

namespace FinFlow.Tests;

public class TransactionsControllerCategorizeTests
{
    private readonly IMediator _mediator = Substitute.For<IMediator>();

    [Fact]
    public void Categorize_ShouldRequireAuthentication()
    {
        var action = typeof(TransactionsController).GetMethod(nameof(TransactionsController.Categorize))!;

        Assert.NotNull(action.GetCustomAttribute<AuthorizeAttribute>());
    }

    [Fact]
    public async Task Categorize_ShouldForbid_AndNotCallAi_WhenRouteUserIsNotCaller()
    {
        var controller = CreateController(callerId: Guid.NewGuid());

        var result = await controller.Categorize(Guid.NewGuid(), CancellationToken.None);

        Assert.IsType<ForbidResult>(result);
        await _mediator.DidNotReceive().Send(Arg.Any<BulkCategorizeTransactionsCommand>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Categorize_ShouldReturnUnauthorized_WhenTokenHasNoUserId()
    {
        var controller = CreateController(callerId: null);

        var result = await controller.Categorize(Guid.NewGuid(), CancellationToken.None);

        Assert.IsType<UnauthorizedObjectResult>(result);
        await _mediator.DidNotReceive().Send(Arg.Any<BulkCategorizeTransactionsCommand>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Categorize_ShouldCategorizeCallersOwnTransactions()
    {
        var callerId = Guid.NewGuid();
        _mediator.Send(new BulkCategorizeTransactionsCommand(callerId), Arg.Any<CancellationToken>()).Returns(3);
        var controller = CreateController(callerId);

        var result = await controller.Categorize(callerId, CancellationToken.None);

        Assert.IsType<OkObjectResult>(result);
        await _mediator.Received(1).Send(new BulkCategorizeTransactionsCommand(callerId), Arg.Any<CancellationToken>());
    }

    private TransactionsController CreateController(Guid? callerId)
    {
        var claims = callerId is null
            ? Array.Empty<Claim>()
            : new[] { new Claim(ClaimTypes.NameIdentifier, callerId.Value.ToString()) };

        return new TransactionsController(_mediator, NullLogger<TransactionsController>.Instance)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal(new ClaimsIdentity(claims, "Test")) }
            }
        };
    }
}
