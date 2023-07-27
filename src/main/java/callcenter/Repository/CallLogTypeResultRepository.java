package callcenter.Repository;


import callcenter.models.CallLogTypeResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CallLogTypeResultRepository extends JpaRepository<CallLogTypeResult,Integer> {


    CallLogTypeResult findByNametyperesult(String nametyperesult);

}
