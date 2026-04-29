package co.delos.api.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;

@Data
@NoArgsConstructor
@DynamoDbBean
public class Reservation {

    private String id;
    private String name;
    private String phone;
    private String date;             // YYYY-MM-DD
    private String time;             // HH:MM
    private int guestCount;
    private String occasion;
    private String notes;
    private String status;           // pending | accepted | declined | contacted
    private String adminNotes;
    private String createdAt;        // ISO-8601

    @DynamoDbPartitionKey
    public String getId() {
        return id;
    }
}
