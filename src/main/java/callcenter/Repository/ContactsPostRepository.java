package callcenter.Repository;


import callcenter.models.ContactPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactsPostRepository extends JpaRepository<ContactPost, Integer>{


    ContactPost findByPostname(String postname);

}
