package callcenter.models;


import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity

public class Contacts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int contact_id;

    private String name;
    private String phone;
    private String email;

    @ManyToOne
    @JoinColumn(name = "contact_post_id")
    private ContactPost contactPost;

    @ManyToOne
    @JoinColumn(name = "organization_id")
    private Organizations organization;

}
