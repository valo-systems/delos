package co.delos.api.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;

@Data
@NoArgsConstructor
@DynamoDbBean
public class AdminUser {

    private String username;
    private String passwordHash;     // BCrypt hash
    private String createdAt;

    @DynamoDbPartitionKey
    public String getUsername() {
        return username;
    }
}
