package co.delos.api.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record CreateEnquiryRequest(
    @NotBlank String name,
    @NotBlank String phone,
    String email,
    @NotBlank String date,        // YYYY-MM-DD
    @Min(1) int guestCount,
    @NotBlank String eventType,
    String packageName,
    String details
) {}
