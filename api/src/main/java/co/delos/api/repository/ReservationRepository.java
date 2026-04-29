package co.delos.api.repository;

import co.delos.api.model.Reservation;
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
public class ReservationRepository {

    private final DynamoDbTable<Reservation> table;

    public ReservationRepository(
        DynamoDbEnhancedClient client,
        @Value("${delos.dynamodb.tables.reservations}") String tableName
    ) {
        this.table = client.table(tableName, TableSchema.fromBean(Reservation.class));
    }

    public Reservation save(Reservation reservation) {
        table.putItem(reservation);
        return reservation;
    }

    public Optional<Reservation> findById(String id) {
        Reservation item = table.getItem(Key.builder().partitionValue(id).build());
        return Optional.ofNullable(item);
    }

    public List<Reservation> findAll() {
        return table.scan(ScanEnhancedRequest.builder().build())
                .items()
                .stream()
                .toList();
    }
}
