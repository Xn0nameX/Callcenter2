package callcenter.models;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity


public class Organizations {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int organization_id;

    private String name;
    private String phone;
    private String email;
    private String industry;


}
