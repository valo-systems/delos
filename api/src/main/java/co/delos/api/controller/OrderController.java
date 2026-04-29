package co.delos.api.controller;

import co.delos.api.dto.request.CreateOrderRequest;
import co.delos.api.dto.request.UpdateOrderStatusRequest;
import co.delos.api.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/orders")
public class OrderController {
    private final OrderService orderService;
    public OrderController(OrderService orderService) { this.orderService = orderService; }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody CreateOrderRequest req) {
        var order = orderService.createOrder(req);
        return ResponseEntity.status(201).body(Map.of("order", order));
    }

    @GetMapping
    public ResponseEntity<?> list(@RequestParam(required = false) String status,
                                   @RequestParam(required = false) String date) {
        var orders = (date != null) ? orderService.findByDate(date) : orderService.findAll();
        if (status != null) orders = orders.stream().filter(o -> o.getStatus().equals(status)).toList();
        return ResponseEntity.ok(Map.of("orders", orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable String id) {
        return ResponseEntity.ok(Map.of("order", orderService.findById(id)));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable String id,
                                           @Valid @RequestBody UpdateOrderStatusRequest req) {
        return ResponseEntity.ok(Map.of("order", orderService.updateStatus(id, req.status())));
    }
}
