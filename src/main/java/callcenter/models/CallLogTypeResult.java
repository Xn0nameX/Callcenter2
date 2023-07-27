package callcenter.models;


import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity



public class CallLogTypeResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int  callLoggTypeResultId ;

    //@Column(unique = true)
    private String nametyperesult;

}
