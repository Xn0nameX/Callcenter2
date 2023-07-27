package callcenter.controllers;

import callcenter.Service.CallServiceFilter;
import callcenter.Service.ReportService;
import callcenter.models.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
    @RequestMapping("/reports")
    public class ReportController {

        private final ReportService reportService;

        @Autowired
    public ReportController(ReportService reportService){
        this.reportService = reportService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadReport(@RequestParam("file") MultipartFile file) {
        try {
            File reportFile = new File(file.getOriginalFilename());
            file.transferTo(reportFile);

            reportService.processReport(reportFile);

            reportFile.delete();

            return ResponseEntity.ok("{\"message\": \"Отчет успешно загружен и обработан\"}");
        } catch (IOException e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Произошла ошибка при загрузке и обработке отчета.\"}");
        }
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getReportSummary() {
        try {
            // Выполнение запроса к базе данных для получения данных отчета
            List<CallLog> reportData = reportService.getReportData();

            // Создание объекта JSON
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonData = objectMapper.writeValueAsString(reportData);

            reportService.clearReportDataCache(); // очищяем кэш

            // Возвращаем успешный ответ с данными отчета в виде json- файла
            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body(jsonData);

        } catch (Exception e) {
            e.printStackTrace();
            // Возвращаем ответ с ошибкой
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Произошла ошибка при получении данных отчета.\"}");
        }
    }

    @GetMapping("/clients")
    public ResponseEntity<?> getClients() {
        try {
            // Выполнение запроса к базе данных для получения данных отчета
            List<Clients> clientsData = reportService.getClietntsData();

            // Создание объекта JSON
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonData = objectMapper.writeValueAsString(clientsData);

            // Возвращаем успешный ответ с данными отчета в виде json- файла
            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body(jsonData);

        } catch (Exception e) {
            e.printStackTrace();
            // Возвращаем ответ с ошибкой
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Произошла ошибка при получении данных отчета.\"}");
        }
    }

    @GetMapping("/callLogTypeResult")
    public ResponseEntity<?> getCallLogTypeResult() {
        try {
            // Выполнение запроса к базе данных для получения данных отчета
            List<CallLogTypeResult> callLogTypeResultResultsData = reportService.getCallLogTypeResult();

            // Создание объекта JSON
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonData = objectMapper.writeValueAsString(callLogTypeResultResultsData);

            // Возвращаем успешный ответ с данными отчета в виде json- файла
            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body(jsonData);

        } catch (Exception e) {
            e.printStackTrace();
            // Возвращаем ответ с ошибкой
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Произошла ошибка при получении данных отчета.\"}");
        }
    }

    @GetMapping("/callResults")
    public ResponseEntity<?> getCallResult() {
        try {
            // Выполнение запроса к базе данных для получения данных отчета
            List<CallResults> callResultsData = reportService.getCallResults();

            // Создание объекта JSON
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonData = objectMapper.writeValueAsString(callResultsData);

            // Возвращаем успешный ответ с данными отчета в виде json- файла
            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body(jsonData);

        } catch (Exception e) {
            e.printStackTrace();
            // Возвращаем ответ с ошибкой
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Произошла ошибка при получении данных отчета.\"}");
        }
    }

    @GetMapping("/callTypes")
    public ResponseEntity<?> getCallTypes() {
        try {
            // Выполнение запроса к базе данных для получения данных отчета
            List<CallTypes> callTypessData = reportService.getCallTypes();

            // Создание объекта JSON
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonData = objectMapper.writeValueAsString(callTypessData);

            // Возвращаем успешный ответ с данными отчета в виде json- файла
            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body(jsonData);

        } catch (Exception e) {
            e.printStackTrace();
            // Возвращаем ответ с ошибкой
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Произошла ошибка при получении данных отчета.\"}");
        }
    }

    @GetMapping("/employees")
    public ResponseEntity<?> getEmployees() {
        try {
            // Выполнение запроса к базе данных для получения данных отчета
            List<Employees> employees = reportService.getEmployees();

            // Создание объекта JSON
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonData = objectMapper.writeValueAsString(employees);

            // Возвращаем успешный ответ с данными отчета в виде json- файла
            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body(jsonData);

        } catch (Exception e) {
            e.printStackTrace();
            // Возвращаем ответ с ошибкой
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Произошла ошибка при получении данных отчета.\"}");
        }
    }

    @GetMapping("/scenario")
    public ResponseEntity<?> getScenario() {
        try {
            // Выполнение запроса к базе данных для получения данных отчета
            List<Scenario> scenarios = reportService.getScenario();

            // Создание объекта JSON
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonData = objectMapper.writeValueAsString(scenarios);

            // Возвращаем успешный ответ с данными отчета в виде json- файла
            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body(jsonData);

        } catch (Exception e) {
            e.printStackTrace();
            // Возвращаем ответ с ошибкой
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Произошла ошибка при получении данных отчета.\"}");
        }
    }

    @GetMapping("/tags")
    public ResponseEntity<?> getTags() {
        try {
            // Выполнение запроса к базе данных для получения данных отчета
            List<Tags> tags = reportService.getTags();

            // Создание объекта JSON
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonData = objectMapper.writeValueAsString(tags);

            // Возвращаем успешный ответ с данными отчета в виде json- файла
            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body(jsonData);

        } catch (Exception e) {
            e.printStackTrace();
            // Возвращаем ответ с ошибкой
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Произошла ошибка при получении данных отчета.\"}");
        }
    }

    @GetMapping("/totalContactsCount") // количество всех клиентов
    public ResponseEntity<Integer> getTotalContactsCount() {
        try {
            int totalContactsCount = reportService.countTotalClients();

            // Возвращаем успешный ответ
            return ResponseEntity.ok(totalContactsCount);

        } catch (Exception e) {
            e.printStackTrace();
            // Возвращаем ответ с ошибкой
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @GetMapping("/successTypeResult") // успешные вызовы
    public ResponseEntity<Integer> getSuccessfulCallsCount() {
        try {
            int successCallResult = reportService.countSuccessTypeResult();

            // Возвращаем успешный ответ
            return ResponseEntity.ok(successCallResult);

        } catch (Exception e) {
            e.printStackTrace();
            // Возвращаем ответ с ошибкой
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @GetMapping("/leadPassedCount") // передано лиду
    public ResponseEntity<Integer> getLeadPassedCount() {
        try {
            int leadPassedCount = reportService.countLead();
            // Возвращаем успешный ответ
            return ResponseEntity.ok(leadPassedCount);

        } catch (Exception e) {
            e.printStackTrace();
            // Возвращаем ответ с ошибкой
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @GetMapping("/getCountByCallResults")  // общее количество прозвоненых клинтов (не системные)
    public ResponseEntity<Integer> getCountByCallResults() {
        Map<String, Integer> countMap = reportService.countGotThrough();
        int totalCount = countMap.get("Общее количество");
        return ResponseEntity.ok(totalCount);
    }

    @GetMapping("/countProject") // по проекту
    public int getCountProject() {
        return reportService.countProject();
    }


}
