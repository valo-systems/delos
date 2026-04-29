package co.delos.api.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;

import java.util.List;

@Data
@NoArgsConstructor
@DynamoDbBean
public class Order {

    private String id;
    private String customerName;
    private String phone;
    private String email;
    private String fulfilmentType;   // "collection" | "delivery"
    private String deliveryAddress;
    private List<CartItemRecord> items;
    private String orderNotes;
    private String status;
    private long subtotal;           // ZAR cents
    private long serviceFee;         // ZAR cents
    private long deliveryFee;        // ZAR cents
    private long total;              // ZAR cents
    private String createdAt;        // ISO-8601
    private String updatedAt;        // ISO-8601

    @DynamoDbPartitionKey
    public String getId() {
        return id;
    }

    @Data
    @NoArgsConstructor
    @DynamoDbBean
    public static class CartItemRecord {
        private String menuItemId;
        private String name;
        private long price;          // ZAR cents
        private int quantity;
    }
}
