package co.delos.api.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CreateOrderRequest(
    @NotBlank String customerName,
    @NotBlank String phone,
    String email,
    @NotBlank String fulfilmentType,
    String deliveryAddress,
    @NotNull @Size(min = 1) List<@Valid ItemRequest> items,
    String orderNotes
) {
    public record ItemRequest(
        @NotBlank String menuItemId,
        @Min(1) @Max(50) int quantity
    ) {}
}
