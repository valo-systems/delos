package co.delos.api.service;

import co.delos.api.dto.request.CreateReservationRequest;
import co.delos.api.dto.request.UpdateReservationRequest;
import co.delos.api.exception.NotFoundException;
import co.delos.api.exception.ValidationException;
import co.delos.api.model.Reservation;
import co.delos.api.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Set;

@Service
public class ReservationService {

    private static final Set<String> VALID_STATUSES = Set.of("pending", "accepted", "declined", "contacted");

    private final ReservationRepository reservationRepository;

    public ReservationService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    public Reservation createReservation(CreateReservationRequest req) {
        if (req.date().compareTo(LocalDate.now().toString()) < 0) {
            throw new ValidationException("Reservation date cannot be in the past");
        }

        if (req.guestCount() < 1 || req.guestCount() > 50) {
            throw new ValidationException("Guest count must be between 1 and 50");
        }

        if (!req.time().matches("\\d{2}:\\d{2}")) {
            throw new ValidationException("Time must be in HH:MM format");
        }

        Reservation reservation = new Reservation();
        reservation.setId(IdGenerator.generate("RES"));
        reservation.setName(req.name());
        reservation.setPhone(req.phone());
        reservation.setDate(req.date());
        reservation.setTime(req.time());
        reservation.setGuestCount(req.guestCount());
        reservation.setOccasion(req.occasion());
        reservation.setNotes(req.notes());
        reservation.setStatus("pending");
        reservation.setCreatedAt(Instant.now().toString());

        return reservationRepository.save(reservation);
    }

    public Reservation updateReservation(String id, UpdateReservationRequest req) {
        Reservation reservation = findById(id);

        if (req.status() != null) {
            if (!VALID_STATUSES.contains(req.status())) {
                throw new ValidationException("Invalid status: " + req.status());
            }
            reservation.setStatus(req.status());
        }

        if (req.adminNotes() != null) {
            reservation.setAdminNotes(req.adminNotes());
        }

        return reservationRepository.save(reservation);
    }

    public Reservation findById(String id) {
        return reservationRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Reservation not found: " + id));
    }

    public List<Reservation> findAll() {
        return reservationRepository.findAll().stream()
            .sorted(Comparator.comparing(Reservation::getDate)
                .thenComparing(Reservation::getTime))
            .toList();
    }

    public List<Reservation> findByDate(String date) {
        return reservationRepository.findAll().stream()
            .filter(r -> date.equals(r.getDate()))
            .sorted(Comparator.comparing(Reservation::getTime))
            .toList();
    }
}
