package callcenter.Repository;


import callcenter.models.CallResults;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CallResultsRepository extends JpaRepository<CallResults,Integer> {


    CallResults findByName(String callResultsName);

}
