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


public class ContactPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int contact_post_id;

    private String postname;

}
