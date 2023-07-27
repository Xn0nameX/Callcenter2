package callcenter.models;


import jakarta.persistence.*;
import lombok.*;


@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity

public class CallLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int call_id;

    // дата
    private String call_date;

    // время
    private String call_time;


    // связь между сотрудником
    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employees employee;

    // связь между типом вызова
    @ManyToOne
    @JoinColumn(name = "call_type_id")
    private CallTypes callType;

    // интервал
    private String duration;

    // связь между клиентом
    @ManyToOne
    @JoinColumn(name = "client_id")
    private Clients client;

    //private String scenario; // добавить новую таблицу

    // связь между сценарием
    @ManyToOne
    @JoinColumn (name = "scenarioid")
    private Scenario scenario;


    // связь между результатом вызова
    @ManyToOne
    @JoinColumn(name = "call_result_id")
    private CallResults callResult;


    // комментарий
    private String comment;

    // связь между контактом
    @ManyToOne
    @JoinColumn(name = "contact_id")
    private Contacts contact;

    // связь между тегами
    @ManyToOne
    @JoinColumn(name = "tag_id")
    private Tags tag;

    // связь между типом результата вызова
    @ManyToOne
    @JoinColumn(name = "callLoggTypeResultId")
    private CallLogTypeResult callLogTypeResult;

    // индивид номер записи
    private Integer call_record_id;
}
