package co.delos.api.controller;

import co.delos.api.dto.request.CreateEnquiryRequest;
import co.delos.api.dto.request.UpdateEnquiryRequest;
import co.delos.api.service.EnquiryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/enquiries")
public class EnquiryController {
    private final EnquiryService enquiryService;
    public EnquiryController(EnquiryService enquiryService) { this.enquiryService = enquiryService; }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody CreateEnquiryRequest req) {
        var enquiry = enquiryService.createEnquiry(req);
        return ResponseEntity.status(201).body(Map.of("enquiry", enquiry));
    }

    @GetMapping
    public ResponseEntity<?> list(@RequestParam(required = false) String status) {
        var list = (status != null) ? enquiryService.findByStatus(status) : enquiryService.findAll();
        return ResponseEntity.ok(Map.of("enquiries", list));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id,
                                     @RequestBody UpdateEnquiryRequest req) {
        return ResponseEntity.ok(Map.of("enquiry", enquiryService.updateEnquiry(id, req)));
    }
}
