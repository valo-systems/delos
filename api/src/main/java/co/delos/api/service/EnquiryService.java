package co.delos.api.service;

import co.delos.api.dto.request.CreateEnquiryRequest;
import co.delos.api.dto.request.UpdateEnquiryRequest;
import co.delos.api.exception.NotFoundException;
import co.delos.api.exception.ValidationException;
import co.delos.api.model.Enquiry;
import co.delos.api.repository.EnquiryRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Set;

@Service
public class EnquiryService {

    private static final Set<String> VALID_STATUSES = Set.of("new", "contacted", "quoted", "booked", "declined");

    private final EnquiryRepository enquiryRepository;

    public EnquiryService(EnquiryRepository enquiryRepository) {
        this.enquiryRepository = enquiryRepository;
    }

    public Enquiry createEnquiry(CreateEnquiryRequest req) {
        if (req.name() == null || req.name().isBlank()) {
            throw new ValidationException("name is required");
        }
        if (req.phone() == null || req.phone().isBlank()) {
            throw new ValidationException("phone is required");
        }
        if (req.date() == null || req.date().isBlank()) {
            throw new ValidationException("date is required");
        }
        if (req.eventType() == null || req.eventType().isBlank()) {
            throw new ValidationException("eventType is required");
        }
        if (req.guestCount() < 1) {
            throw new ValidationException("guestCount must be at least 1");
        }

        Enquiry enquiry = new Enquiry();
        enquiry.setId(IdGenerator.generate("ENQ"));
        enquiry.setName(req.name());
        enquiry.setPhone(req.phone());
        enquiry.setEmail(req.email());
        enquiry.setDate(req.date());
        enquiry.setGuestCount(req.guestCount());
        enquiry.setEventType(req.eventType());
        enquiry.setPackageName(req.packageName());
        enquiry.setDetails(req.details());
        enquiry.setStatus("new");
        enquiry.setCreatedAt(Instant.now().toString());

        return enquiryRepository.save(enquiry);
    }

    public Enquiry updateEnquiry(String id, UpdateEnquiryRequest req) {
        Enquiry enquiry = findById(id);

        if (req.status() != null) {
            if (!VALID_STATUSES.contains(req.status())) {
                throw new ValidationException("Invalid status: " + req.status());
            }
            enquiry.setStatus(req.status());
        }

        if (req.adminNotes() != null) {
            enquiry.setAdminNotes(req.adminNotes());
        }

        return enquiryRepository.save(enquiry);
    }

    public Enquiry findById(String id) {
        return enquiryRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Enquiry not found: " + id));
    }

    public List<Enquiry> findAll() {
        return enquiryRepository.findAll().stream()
            .sorted(Comparator.comparing(Enquiry::getCreatedAt).reversed())
            .toList();
    }

    public List<Enquiry> findByStatus(String status) {
        return enquiryRepository.findAll().stream()
            .filter(e -> status.equals(e.getStatus()))
            .sorted(Comparator.comparing(Enquiry::getCreatedAt).reversed())
            .toList();
    }
}
