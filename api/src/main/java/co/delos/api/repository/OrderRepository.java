package co.delos.api.repository;

import co.delos.api.model.Order;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.enhanced.dynamodb.model.ScanEnhancedRequest;

import java.util.List;
import java.util.Optional;

@Repository
public class OrderRepository {

    private final DynamoDbTable<Order> table;

    public OrderRepository(
        DynamoDbEnhancedClient client,
        @Value("${delos.dynamodb.tables.orders}") String tableName
    ) {
        this.table = client.table(tableName, TableSchema.fromBean(Order.class));
    }

    public Order save(Order order) {
        table.putItem(order);
        return order;
    }

    public Optional<Order> findById(String id) {
        Order item = table.getItem(Key.builder().partitionValue(id).build());
        return Optional.ofNullable(item);
    }

    public List<Order> findAll() {
        return table.scan(ScanEnhancedRequest.builder().build())
                .items()
                .stream()
                .toList();
    }
}
