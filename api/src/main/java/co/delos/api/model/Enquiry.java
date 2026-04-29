package co.delos.api.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;

@Data
@NoArgsConstructor
@DynamoDbBean
public class Enquiry {

    private String id;
    private String name;
    private String phone;
    private String email;
    private String date;             // YYYY-MM-DD (requested event date)
    private int guestCount;
    private String eventType;        // "birthday" | "corporate" | "wedding" | "other"
    private String packageName;      // optional - name of the package being enquired about
    private String details;
    private String status;           // new | contacted | quoted | booked | declined
    private String adminNotes;
    private String createdAt;        // ISO-8601

    @DynamoDbPartitionKey
    public String getId() {
        return id;
    }
}
