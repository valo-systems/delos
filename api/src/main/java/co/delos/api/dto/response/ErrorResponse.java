package co.delos.api.dto.response;

public record ErrorResponse(String error, String field) {
    public ErrorResponse(String error) {
        this(error, null);
    }
}
