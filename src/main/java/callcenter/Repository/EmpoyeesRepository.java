package callcenter.Repository;

import callcenter.models.Employees;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmpoyeesRepository extends JpaRepository<Employees, Integer> {
    Employees findByFamily(String family);
    List<Employees> findByFamilyIn(List<String> family);

}