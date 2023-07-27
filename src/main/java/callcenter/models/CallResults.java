package callcenter.models;


import jakarta.persistence.*;
import lombok.*;


@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity

public class CallResults {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int call_result_id;

   // @Column(unique = true)
    private String name;


}
