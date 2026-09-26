using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging.Abstractions;
using NSubstitute;

namespace FinFlow.Tests;

/// Endpoints that take a wallet/card/user id must only act on the caller's own resources.
/// Someone else's resource looks exactly like a missing one (404), and the command never runs.
public class ResourceOwnershipEndpointTests
{
    private static readonly Guid CallerId = Guid.NewGuid();
    private static readonly Guid OwnWalletId = Guid.NewGuid();
    private static readonly Guid ForeignWalletId = Guid.NewGuid();
    private static readonly Guid OwnCardId = Guid.NewGuid();
    private static readonly Guid ForeignCardId = Guid.NewGuid();

    private readonly IMediator _mediator = Substitute.For<IMediator>();
    private readonly IResourceOwnershipService _ownership = Substitute.For<IResourceOwnershipService>();

    public ResourceOwnershipEndpointTests()
    {
        _ownership.OwnsWalletAsync(CallerId, OwnWalletId, Arg.Any<CancellationToken>()).Returns(true);
        _ownership.OwnsPaymentMethodAsync(CallerId, OwnCardId, Arg.Any<CancellationToken>()).Returns(true);
    }

    // ---------------- Wallets

    [Fact]
    public async Task Wallets_GetById_ShouldReturn404_ForAnotherUsersWallet()
    {
        var result = await Wallets().GetById(ForeignWalletId, CancellationToken.None);

        Assert.IsType<NotFoundResult>(result);
        await _mediator.DidNotReceiveWithAnyArgs().Send(Arg.Any<GetWalletByIdQuery>(), default);
    }

    [Fact]
    public async Task Wallets_GetByUserId_ShouldReturn403_ForAnotherUser()
    {
        var result = await Wallets().GetByUserId(Guid.NewGuid());

        Assert.IsType<ForbidResult>(result);
    }

    [Fact]
    public async Task Wallets_Create_ShouldAlwaysCreateForCaller_IgnoringBodyUserId()
    {
        var result = await Wallets().Create(new CreateWalletCommand(UserId: Guid.NewGuid(), Name: "Savings"));

        Assert.IsType<CreatedAtActionResult>(result);
        await _mediator.Received(1).Send(Arg.Is<CreateWalletCommand>(c => c.UserId == CallerId && c.Name == "Savings"), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Wallets_Delete_ShouldReturn404_AndNotDelete_ForAnotherUsersWallet()
    {
        var result = await Wallets().Delete(ForeignWalletId);

        Assert.IsType<NotFoundResult>(result);
        await _mediator.DidNotReceive().Send(Arg.Any<DeleteWalletCommand>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Wallets_Update_ShouldReturn404_AndNotUpdate_ForAnotherUsersWallet()
    {
        var result = await Wallets().Update(ForeignWalletId, new UpdateWalletCommand { WalletId = ForeignWalletId, Name = "x" });

        Assert.IsType<NotFoundResult>(result);
        await _mediator.DidNotReceive().Send(Arg.Any<UpdateWalletCommand>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Wallets_Transfer_ShouldReturn404_AndMoveNoMoney_FromAnotherUsersWallet()
    {
        var dto = new TransferDto { FromWalletId = ForeignWalletId, ToWalletId = OwnWalletId, Amount = 100m };

        var result = await Wallets().Transfer(ForeignWalletId, dto, idempotencyKey: null);

        Assert.IsType<NotFoundResult>(result);
        await _mediator.DidNotReceive().Send(Arg.Any<TransferCommand>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Wallets_Transfer_ShouldAllowSendingToAnotherUsersWallet()
    {
        var dto = new TransferDto { FromWalletId = OwnWalletId, ToWalletId = ForeignWalletId, Amount = 100m };

        var result = await Wallets().Transfer(OwnWalletId, dto, idempotencyKey: "key-1");

        Assert.IsType<NoContentResult>(result);
        await _mediator.Received(1).Send(new TransferCommand(OwnWalletId, ForeignWalletId, 100m, "key-1"), Arg.Any<CancellationToken>());
    }

    [Fact]
    public void Wallets_ShouldNotExposeUnpaidDirectDeposit()
    {
        Assert.Null(typeof(WalletsController).GetMethod("Deposit"));
    }

    // ---------------- Transactions / Cards

    [Fact]
    public async Task Transactions_GetByWalletId_ShouldReturn404_ForAnotherUsersWallet()
    {
        var controller = new TransactionsController(_mediator, _ownership, NullLogger<TransactionsController>.Instance)
        {
            ControllerContext = TestUser.Context(CallerId)
        };

        var result = await controller.GetByWalletId(ForeignWalletId);

        Assert.IsType<NotFoundResult>(result);
        await _mediator.DidNotReceive().Send(Arg.Any<GetTransactionsByWalletIdQuery>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Transactions_GetByCardId_ShouldReturn404_ForAnotherUsersCard()
    {
        var controller = new TransactionsController(_mediator, _ownership, NullLogger<TransactionsController>.Instance)
        {
            ControllerContext = TestUser.Context(CallerId)
        };

        var result = await controller.GetByCardId(ForeignCardId);

        Assert.IsType<NotFoundResult>(result);
        await _mediator.DidNotReceive().Send(Arg.Any<GetTransactionsByCardIdQuery>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Transactions_GetByUserId_ShouldReturn403_ForAnotherUser()
    {
        var controller = new TransactionsController(_mediator, _ownership, NullLogger<TransactionsController>.Instance)
        {
            ControllerContext = TestUser.Context(CallerId)
        };

        var result = await controller.GetByUserId(Guid.NewGuid());

        Assert.IsType<ForbidResult>(result);
    }

    [Fact]
    public async Task Cards_GetById_ShouldReturn404_ForAnotherUsersCard()
    {
        var controller = new CardsController(_mediator, _ownership, NullLogger<CardsController>.Instance)
        {
            ControllerContext = TestUser.Context(CallerId)
        };

        var result = await controller.GetById(ForeignCardId, CancellationToken.None);

        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Cards_GetByUserId_ShouldReturn403_ForAnotherUser()
    {
        var controller = new CardsController(_mediator, _ownership, NullLogger<CardsController>.Instance)
        {
            ControllerContext = TestUser.Context(CallerId)
        };

        var result = await controller.GetByUserId(Guid.NewGuid());

        Assert.IsType<ForbidResult>(result);
    }

    // ---------------- Payments

    [Fact]
    public async Task PayBill_ShouldReturn404_AndChargeNothing_ForAnotherUsersWallet()
    {
        var request = new PayBillRequest("BILL-1", 50m, ForeignWalletId, null, "USD", PaymentType.Wallet);

        var result = await Payments().PayBill(request, idempotencyKey: null);

        Assert.IsType<NotFoundResult>(result);
        await _mediator.DidNotReceive().Send(Arg.Any<PayBillCommand>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task PayBill_ShouldReturn404_AndChargeNothing_ForAnotherUsersCard()
    {
        var request = new PayBillRequest("BILL-1", 50m, null, ForeignCardId, "USD", PaymentType.Card);

        var result = await Payments().PayBill(request, idempotencyKey: null);

        Assert.IsType<NotFoundResult>(result);
        await _mediator.DidNotReceive().Send(Arg.Any<PayBillCommand>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task PayBill_ShouldChargeAsTheTokenUser()
    {
        var request = new PayBillRequest("BILL-1", 50m, null, OwnCardId, "USD", PaymentType.Card);

        var result = await Payments(email: "caller@finflow.test").PayBill(request, idempotencyKey: null);

        Assert.IsType<OkObjectResult>(result);
        await _mediator.Received(1).Send(
            Arg.Is<PayBillCommand>(c => c.Email == "caller@finflow.test" && c.CardId == OwnCardId),
            Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task CreateCheckoutSession_ShouldReturn404_ForAnotherUsersWallet()
    {
        var result = await Payments().CreateCheckoutSession(
            new CheckoutRequest { WalletId = ForeignWalletId.ToString(), Amount = 20m }, idempotencyKey: null);

        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task CreateCheckoutSession_ShouldReturn400_WithoutValidWalletId()
    {
        var result = await Payments().CreateCheckoutSession(new CheckoutRequest { WalletId = null, Amount = 20m }, idempotencyKey: null);

        Assert.IsType<BadRequestObjectResult>(result);
    }

    private WalletsController Wallets() =>
        new(_mediator, _ownership, NullLogger<WalletsController>.Instance) { ControllerContext = TestUser.Context(CallerId) };

    private PaymentsController Payments(string email = "user@finflow.test") =>
        new(NullLogger<PaymentsController>.Instance, _mediator, _ownership, new ConfigurationBuilder().Build())
        {
            ControllerContext = TestUser.Context(CallerId, email)
        };
}
