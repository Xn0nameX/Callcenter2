package callcenter.Repository;


import callcenter.models.Scenario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ScenarioRepository extends  JpaRepository<Scenario, Integer> {

    Scenario findByName(String scenarioName);

    List<Scenario> findByNameIn(List<String> scenarioNames);

}
