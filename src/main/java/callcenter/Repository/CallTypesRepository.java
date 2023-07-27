package callcenter.Repository;


import callcenter.models.CallLogTypeResult;
import callcenter.models.CallTypes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CallTypesRepository extends JpaRepository<CallTypes,Integer> {
    
    CallTypes findByName(String callTypeName);



}
