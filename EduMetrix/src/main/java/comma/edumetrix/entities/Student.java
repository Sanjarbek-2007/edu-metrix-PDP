package comma.edumetrix.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Student {
    @Id
    private Long id;
    private String studentId;
    private User user;


}
