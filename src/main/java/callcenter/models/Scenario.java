package callcenter.models;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Scenario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int scenarioid;

   // @Column(unique = true)
    private String name;


    @JsonBackReference
    @ManyToMany(mappedBy = "scenarios")
    private Set<Clients> clients;;

}
