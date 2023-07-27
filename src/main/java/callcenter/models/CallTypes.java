package callcenter.models;


import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity

public class CallTypes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int call_type_id;

    //@Column(unique = true)
    private String name;

}
