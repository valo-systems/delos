package co.delos.api.controller;

import co.delos.api.dto.request.CreateReservationRequest;
import co.delos.api.dto.request.UpdateReservationRequest;
import co.delos.api.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/reservations")
public class ReservationController {
    private final ReservationService reservationService;
    public ReservationController(ReservationService reservationService) { this.reservationService = reservationService; }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody CreateReservationRequest req) {
        var reservation = reservationService.createReservation(req);
        return ResponseEntity.status(201).body(Map.of("reservation", reservation));
    }

    @GetMapping
    public ResponseEntity<?> list(@RequestParam(required = false) String date) {
        var list = (date != null) ? reservationService.findByDate(date) : reservationService.findAll();
        return ResponseEntity.ok(Map.of("reservations", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable String id) {
        return ResponseEntity.ok(Map.of("reservation", reservationService.findById(id)));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id,
                                     @RequestBody UpdateReservationRequest req) {
        return ResponseEntity.ok(Map.of("reservation", reservationService.updateReservation(id, req)));
    }
}
