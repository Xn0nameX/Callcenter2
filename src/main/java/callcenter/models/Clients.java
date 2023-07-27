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

public class Clients {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int client_id;

    private String name_and_family;
    private String phone;


    // устанавливаем связь многие ко многим между сценарием и клиентом
    @JsonBackReference
    @ManyToMany
    @JoinTable(
            name = "client_scenario",
            joinColumns = @JoinColumn(name = "client_id"),
            inverseJoinColumns = @JoinColumn(name = "scenarioid")
    )
    private Set<Scenario> scenarios;

}
