package callcenter.Repository;


import callcenter.models.Tags;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TagsRepository extends JpaRepository<Tags,Integer> {

    Tags findByNameTag(String nameTag);
    List<Tags> findByNameTagIn(List<String> tags);
}


