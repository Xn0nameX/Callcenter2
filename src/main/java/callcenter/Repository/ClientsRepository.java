package callcenter.Repository;


import callcenter.models.Clients;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface ClientsRepository extends JpaRepository<Clients , Integer> {

    @Query("SELECT COUNT(c) FROM Clients c")
    int countAll();


}

