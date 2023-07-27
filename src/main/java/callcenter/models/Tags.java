package callcenter.models;


import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity

public class Tags {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int tag_id;

  @Column(unique = true)
    private String nameTag;

}
