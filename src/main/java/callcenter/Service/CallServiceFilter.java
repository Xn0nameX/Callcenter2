package callcenter.Service;


import callcenter.Repository.*;
import callcenter.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CallServiceFilter {

    private final CalllogRepository calllogRepository;
    private final ScenarioRepository scenarioRepository;
    private final EmpoyeesRepository empoyeesRepository;
    private final TagsRepository tagsRepository;
    private final CallResultsRepository callResultsRepository;

    @Autowired
    public CallServiceFilter(CalllogRepository calllogRepository, ScenarioRepository scenarioRepository, EmpoyeesRepository empoyeesRepository, TagsRepository tagsRepository, CallResultsRepository callResultsRepository) {
        this.calllogRepository = calllogRepository;
        this.scenarioRepository = scenarioRepository;
        this.empoyeesRepository = empoyeesRepository;
        this.tagsRepository = tagsRepository;
        this.callResultsRepository = callResultsRepository;
    }

    public List<CallLog> filterCall(
            String scenario,
            String callResult,
            String family,
            String tag
    ) {
        Scenario scenarioEntity = scenario != null ? scenarioRepository.findByName(scenario) : null;
        CallResults callResultEntity = callResult != null ? callResultsRepository.findByName(callResult) : null;
        Employees employeeEntity = family != null ? empoyeesRepository.findByFamily(family) : null;
        Tags tagEntity = tag != null ? tagsRepository.findByNameTag(tag) : null;

        List<CallLog> filteredCalls = calllogRepository.findByScenarioAndCallResultAndEmployeeAndTag(
                scenarioEntity,
                callResultEntity,
                employeeEntity,
                tagEntity
        );

        return filteredCalls;
    }

    public int countFilteredCalls(
            String scenario,
            String callResult,
            String family,
            String tag
    ) {
        Scenario scenarioEntity = scenario != null ? scenarioRepository.findByName(scenario) : null;
        CallResults callResultEntity = callResult != null ? callResultsRepository.findByName(callResult) : null;
        Employees employeeEntity = family != null ? empoyeesRepository.findByFamily(family) : null;
        Tags tagEntity = tag != null ? tagsRepository.findByNameTag(tag) : null;

        int count = calllogRepository.calculateFilteredCount(
                scenarioEntity,
                callResultEntity,
                employeeEntity,
                tagEntity
        );

        return count;
    }
}
