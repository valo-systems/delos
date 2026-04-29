package co.delos.api.service;

import co.delos.api.dto.request.CreateOrderRequest;
import co.delos.api.exception.NotFoundException;
import co.delos.api.exception.ValidationException;
import co.delos.api.menu.MenuRegistry;
import co.delos.api.model.Order;
import co.delos.api.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class OrderService {

    private static final Map<String, Set<String>> TRANSITIONS = Map.of(
        "received",       Set.of("accepted", "cancelled"),
        "accepted",       Set.of("preparing", "cancelled"),
        "preparing",      Set.of("ready", "out_for_delivery", "cancelled"),
        "ready",          Set.of("completed", "cancelled"),
        "out_for_delivery", Set.of("completed", "cancelled"),
        "completed",      Set.of(),
        "cancelled",      Set.of()
    );

    private final OrderRepository orderRepository;
    private final MenuRegistry menuRegistry;

    public OrderService(OrderRepository orderRepository, MenuRegistry menuRegistry) {
        this.orderRepository = orderRepository;
        this.menuRegistry = menuRegistry;
    }

    public Order createOrder(CreateOrderRequest req) {
        if ("delivery".equals(req.fulfilmentType()) &&
                (req.deliveryAddress() == null || req.deliveryAddress().isBlank())) {
            throw new ValidationException("deliveryAddress is required for delivery orders");
        }

        List<Order.CartItemRecord> cartItems = new ArrayList<>();
        long subtotal = 0;

        for (CreateOrderRequest.ItemRequest itemReq : req.items()) {
            var menuItem = menuRegistry.findById(itemReq.menuItemId())
                .orElseThrow(() -> new ValidationException("Unknown menu item: " + itemReq.menuItemId()));

            if (itemReq.quantity() < 1 || itemReq.quantity() > 50) {
                throw new ValidationException("Quantity must be between 1 and 50 for item: " + itemReq.menuItemId());
            }

            Order.CartItemRecord record = new Order.CartItemRecord();
            record.setMenuItemId(menuItem.id());
            record.setName(menuItem.name());
            record.setPrice(menuItem.priceCents());
            record.setQuantity(itemReq.quantity());
            cartItems.add(record);

            subtotal += menuItem.priceCents() * itemReq.quantity();
        }

        if (subtotal < 8000) {
            throw new ValidationException("Order subtotal must be at least R80.00");
        }

        long serviceFee = (subtotal * 5) / 100;
        long deliveryFee = 0;
        if ("delivery".equals(req.fulfilmentType())) {
            deliveryFee = subtotal >= 50000 ? 0 : 3500;
        }
        long total = subtotal + serviceFee + deliveryFee;

        String now = Instant.now().toString();
        Order order = new Order();
        order.setId(IdGenerator.generate("ORD"));
        order.setCustomerName(req.customerName());
        order.setPhone(req.phone());
        order.setEmail(req.email());
        order.setFulfilmentType(req.fulfilmentType());
        order.setDeliveryAddress(req.deliveryAddress());
        order.setItems(cartItems);
        order.setOrderNotes(req.orderNotes());
        order.setStatus("received");
        order.setSubtotal(subtotal);
        order.setServiceFee(serviceFee);
        order.setDeliveryFee(deliveryFee);
        order.setTotal(total);
        order.setCreatedAt(now);
        order.setUpdatedAt(now);

        return orderRepository.save(order);
    }

    public Order updateStatus(String id, String newStatus) {
        Order order = findById(id);
        Set<String> allowed = TRANSITIONS.getOrDefault(order.getStatus(), Set.of());
        if (!allowed.contains(newStatus)) {
            throw new ValidationException(
                "Cannot transition from '" + order.getStatus() + "' to '" + newStatus + "'");
        }
        order.setStatus(newStatus);
        order.setUpdatedAt(Instant.now().toString());
        return orderRepository.save(order);
    }

    public Order findById(String id) {
        return orderRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Order not found: " + id));
    }

    public List<Order> findAll() {
        return orderRepository.findAll().stream()
            .sorted(Comparator.comparing(Order::getCreatedAt).reversed())
            .toList();
    }

    public List<Order> findByDate(String date) {
        return orderRepository.findAll().stream()
            .filter(o -> o.getCreatedAt() != null && o.getCreatedAt().startsWith(date))
            .sorted(Comparator.comparing(Order::getCreatedAt).reversed())
            .toList();
    }
}
