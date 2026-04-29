package co.delos.api.repository;

import co.delos.api.model.AdminUser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

import java.util.Optional;

@Repository
public class AdminUserRepository {

    private final DynamoDbTable<AdminUser> table;

    public AdminUserRepository(
        DynamoDbEnhancedClient client,
        @Value("${delos.dynamodb.tables.users}") String tableName
    ) {
        this.table = client.table(tableName, TableSchema.fromBean(AdminUser.class));
    }

    public AdminUser save(AdminUser user) {
        table.putItem(user);
        return user;
    }

    public Optional<AdminUser> findByUsername(String username) {
        AdminUser item = table.getItem(Key.builder().partitionValue(username).build());
        return Optional.ofNullable(item);
    }
}
