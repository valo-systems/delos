package co.delos.api.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record CreateReservationRequest(
    @NotBlank String name,
    @NotBlank String phone,
    @NotBlank String date,       // YYYY-MM-DD
    @NotBlank String time,       // HH:MM
    @Min(1) @Max(50) int guestCount,
    String occasion,
    String notes
) {}
