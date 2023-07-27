package callcenter.Repository;


import callcenter.models.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

    @Repository
    public interface CalllogRepository extends JpaRepository<CallLog,Integer> {

        int countByCallLogTypeResult(CallLogTypeResult callLogTypeResult);
        int countByCallResult(CallResults callResult);
        int countByCallResultName(String callResultName);
        int countByCallType(CallTypes callType);


        //@Query("SELECT cl FROM CallLog cl WHERE cl.callResult = :callResult")
        //List<CallLog> findByScenarioAndCallResultAndEmployeeInAndTag( @Param("callResult") CallResults callResult);

        @Query("SELECT cl FROM CallLog cl WHERE (:scenario is null or cl.scenario = :scenario) " +
                "AND (:callResult is null or cl.callResult = :callResult) " +
                "AND (:employee is null or cl.employee = :employee) " +
                "AND (:tag is null or cl.tag = :tag)")
        List<CallLog> findByScenarioAndCallResultAndEmployeeAndTag(
                @Param("scenario") Scenario scenario,
                @Param("callResult") CallResults callResult,
                @Param("employee") Employees employees,
                @Param("tag") Tags tag);



        @Query("SELECT COUNT(cl) FROM CallLog cl WHERE (:scenario is null or cl.scenario = :scenario) " +
                "AND (:callResult is null or cl.callResult = :callResult) " +
                "AND (:employee is null or cl.employee = :employee) " +
                "AND (:tag is null or cl.tag = :tag)")
        int calculateFilteredCount(
                @Param("scenario") Scenario scenario,
                @Param("callResult") CallResults callResult,
                @Param("employee") Employees employees,
                @Param("tag") Tags tag
        );
    }
