package co.delos.api.repository;

import co.delos.api.model.Enquiry;
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
public class EnquiryRepository {

    private final DynamoDbTable<Enquiry> table;

    public EnquiryRepository(
        DynamoDbEnhancedClient client,
        @Value("${delos.dynamodb.tables.enquiries}") String tableName
    ) {
        this.table = client.table(tableName, TableSchema.fromBean(Enquiry.class));
    }

    public Enquiry save(Enquiry enquiry) {
        table.putItem(enquiry);
        return enquiry;
    }

    public Optional<Enquiry> findById(String id) {
        Enquiry item = table.getItem(Key.builder().partitionValue(id).build());
        return Optional.ofNullable(item);
    }

    public List<Enquiry> findAll() {
        return table.scan(ScanEnhancedRequest.builder().build())
                .items()
                .stream()
                .toList();
    }
}
