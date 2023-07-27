package callcenter.Service;


import callcenter.Repository.*;
import callcenter.models.*;
import callcenter.models.CallLogTypeResult;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.*;


@Service
public class ReportService {

    private final CalllogRepository callLogRepository;
    private final EmpoyeesRepository empoyeesRepository;
    private final CallTypesRepository callTypeRepository;
    private final ClientsRepository clientRepository;
    private final CallResultsRepository callResultRepository;
    private final ContactsRepository contactRepository;
    private final TagsRepository tagRepository;
    private final OrganizationRepository organizationRepository;
    private final ScenarioRepository scenarioRepository;
    private final CallLogTypeResultRepository callLogTypeResultRepository;
    private final ContactsPostRepository contactsPostRepository;

    private final CacheManager cacheManager;

    @Autowired
    public ReportService(CalllogRepository callLogRepository, EmpoyeesRepository empoyeesRepository, CallTypesRepository callTypeRepository, ClientsRepository clientRepository, CallResultsRepository callResultRepository, ContactsRepository contactRepository, TagsRepository tagRepository, OrganizationRepository organizationRepository, ScenarioRepository scenarioRepository, CallLogTypeResultRepository callLogTypeResultRepository, ContactsPostRepository contactsPostRepository, CacheManager cacheManager) {
        this.callLogRepository = callLogRepository;
        this.empoyeesRepository = empoyeesRepository;
        this.callTypeRepository = callTypeRepository;
        this.clientRepository = clientRepository;
        this.callResultRepository = callResultRepository;
        this.contactRepository = contactRepository;
        this.tagRepository = tagRepository;
        this.organizationRepository = organizationRepository;
        this.scenarioRepository = scenarioRepository;
        this.callLogTypeResultRepository = callLogTypeResultRepository;

        this.contactsPostRepository = contactsPostRepository;
        this.cacheManager = cacheManager;
    }

    public void processReport(File reportFile) {
        try {
            FileInputStream fis = new FileInputStream(reportFile);

            // Создание экземпляр книги
            XSSFWorkbook workbook = new XSSFWorkbook(fis);

            // Получение первый лист в книге
            XSSFSheet sheet = workbook.getSheetAt(0);


            // Реализация проверки первой строки , что там действительно содержатся нужные нам записи

            Row initialLine = sheet.getRow(0);
            String expectedLine = "Дата\tВремя" +
                    "\tСотрудник\tТип вызова" +
                    "\tДлит-ть (мм:сс)\tКлиент, которому звонили" +
                    "\tТелефон, на который звонили\tСценарий" +
                    "\tРезультат\tТип результата\tКомментарий" +
                    "\tКонтакт\tТелефон контакта №1\tE-mail контакта №1" +
                    "\tДолжность\tОрганизация\tТелефон организации №1" +
                    "\tE-mail организации №1\tСфера деятельности\tТеги\tID записи";


            String actualLine = getRowAsString(initialLine);

            if (!expectedLine.equals(actualLine)) {
                throw new IllegalArgumentException("Неверный формат файла");
            }

            // Перебор строки, начиная со второй строки (индекс 1), чтобы пропустить заголовки
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);

                // Извлечение данных из каждой ячейки и омделей

                //  CallLog
                CallLog callLog = new CallLog();

                Cell callComment = row.getCell(10);

                if (callComment != null){
                    if (callComment.getCellType() == CellType.STRING) {
                        callLog.setComment(callComment.getStringCellValue());
                    } else {
                        callLog.setComment(null);
                    }
                } else {
                    callLog.setComment(null);
                }

                callLog.setCall_date(row.getCell(0).getStringCellValue());
                callLog.setCall_time(row.getCell(1).getStringCellValue());
                callLog.setDuration(row.getCell(4).getStringCellValue());

                Cell callId = row.getCell(20);
                if (callId != null) {
                    if (callId.getCellType() == CellType.NUMERIC) {
                        callLog.setCall_record_id((int) callId.getNumericCellValue());
                    } else {
                        callLog.setCall_record_id(null);
                    }
                } else {
                    callLog.setCall_record_id(null);
                }

                callLogRepository.save(callLog);


                // CallResults

                String callResultsName = "";
                Cell result = row.getCell(8);
                if (result != null) {
                    String callValueResult = result.getStringCellValue();
                    if(callValueResult != null) {
                        callResultsName = callValueResult.trim();
                    }
                }

                CallResults callResults = callResultRepository.findByName(callResultsName);

                if(!callResultsName.isEmpty()){
                    if(callResults == null){
                        callResults = new CallResults();
                        callResults.setName(callResultsName);
                    }
                    callResultRepository.save(callResults);
                }

                // CallLogTypeResult

                String nametyperesult = "";
                Cell LogResultName = row.getCell(9);
                if (LogResultName != null) {
                    String cellLogResut = LogResultName.getStringCellValue();
                    if (cellLogResut != null) {
                        nametyperesult = cellLogResut.trim();
                    }
                }

                CallLogTypeResult callLogTypeResult = callLogTypeResultRepository.findByNametyperesult(nametyperesult);

                if (!nametyperesult.isEmpty()) {
                    if (callLogTypeResult == null) {
                        callLogTypeResult = new CallLogTypeResult();
                        callLogTypeResult.setNametyperesult(nametyperesult);
                    }
                    callLogTypeResultRepository.save(callLogTypeResult);
                }


                // CallTypes

                // изменил исключаем повторяющиеся значения
                String callTypeName = row.getCell(3).getStringCellValue().trim();
                CallTypes callTypes = callTypeRepository.findByName(callTypeName);

                if (callTypes == null) {
                    callTypes = new CallTypes();
                    callTypes.setName(callTypeName);
                    callTypeRepository.save(callTypes);
                }

                callTypeRepository.save(callTypes);

                // Tags

                //String tagsName = row.getCell(19).getStringCellValue();

                // изменил добавил проверки
                String tagsName = "";
                Cell tag = row.getCell(19);
                if (tag != null) {
                    String cellValue = tag.getStringCellValue();
                    if (cellValue != null) {
                        tagsName = cellValue.trim();
                    }
                }

                Tags tags = tagRepository.findByNameTag(tagsName);

                if (!tagsName.isEmpty()) {
                    if (tags == null) {
                        tags = new Tags();
                        tags.setNameTag(tagsName);
                    }
                    tagRepository.save(tags);
                }


                // Contacts

                Contacts contacts = new Contacts();

                Cell callContact = row.getCell(11);
                Cell callPhone = row.getCell(12);
                Cell callEmail= row.getCell(13);

                if (callContact != null){
                    if (callContact.getCellType() == CellType.STRING) {
                        contacts.setName(callContact.getStringCellValue());
                    } else {
                        contacts.setName(null);
                    }
                } else {
                    contacts.setName(null);
                }


                if (callPhone != null){
                    if (callPhone.getCellType() == CellType.STRING) {
                        contacts.setPhone(callPhone.getStringCellValue());
                    } else {
                        contacts.setPhone(null);
                    }
                } else {
                    contacts.setPhone(null);
                }


                if (callEmail != null){
                    if (callEmail.getCellType() == CellType.STRING) {
                        contacts.setEmail(callEmail.getStringCellValue());
                    } else {
                        contacts.setEmail(null);
                    }
                } else {
                    contacts.setEmail(null);
                }

                contactRepository.save(contacts);


                // Employees

                String family = row.getCell(2).getStringCellValue().trim();
                Employees employees = empoyeesRepository.findByFamily(family);

                if (employees == null) {
                    employees = new Employees();
                    employees.setFamily(family);
                    empoyeesRepository.save(employees);
                }

                // Organizations

                Organizations organizations = new Organizations();

                Cell callNameOrgan = row.getCell(15);
                if (callNameOrgan != null) {
                    if (callNameOrgan.getCellType() == CellType.STRING) {
                        organizations.setName(callNameOrgan.getStringCellValue());
                    } else if (callNameOrgan.getCellType() == CellType.NUMERIC) {
                        organizations.setName(String.valueOf(callNameOrgan.getNumericCellValue()));
                    } else {
                        organizations.setName(null);
                    }
                } else {
                    organizations.setName(null);
                }

                Cell callEmailOrgan = row.getCell(17);

                if (callEmailOrgan != null){
                    if (callEmailOrgan.getCellType() == CellType.STRING) {
                        organizations.setEmail(callEmailOrgan.getStringCellValue());
                    } else {
                        organizations.setEmail(null);
                    }
                } else {
                    organizations.setEmail(null);
                }

                Cell callIndusryOrgan = row.getCell(18);

                if (callIndusryOrgan != null){
                    if (callIndusryOrgan.getCellType() == CellType.STRING) {
                        organizations.setIndustry(callIndusryOrgan.getStringCellValue());
                    } else {
                        organizations.setIndustry(null);
                    }
                } else {
                    organizations.setIndustry(null);
                }

                Cell callPhoneOrgan = row.getCell(18);

                if (callPhoneOrgan != null){
                    if (callPhoneOrgan.getCellType() == CellType.STRING) {
                        organizations.setPhone(callPhoneOrgan.getStringCellValue());
                    } else {
                        organizations.setPhone(null);
                    }
                } else {
                    organizations.setPhone(null);
                }

                organizationRepository.save(organizations);

                // ContactPost

                String postname = "";
                Cell post = row.getCell(14);
                if(post != null){
                    String cellPostValue = post.getStringCellValue();
                    if(cellPostValue != null){
                        postname = cellPostValue.trim();
                    }
                }

                ContactPost contactPost = contactsPostRepository.findByPostname(postname);

                if(!postname.isEmpty()){
                    if(contactPost == null){
                        contactPost = new ContactPost();
                        contactPost.setPostname(postname);
                    }
                    contactsPostRepository.save(contactPost);
                }

                // Scenario
                String scenarioName = row.getCell(7).getStringCellValue().trim();
                Scenario scenario = scenarioRepository.findByName(scenarioName);

                if (scenario == null) {
                    scenario = new Scenario();
                    scenario.setName(scenarioName);
                    scenarioRepository.save(scenario);
                }


                // Clients

                Clients clients = new Clients();
                clients.setName_and_family(row.getCell(5).getStringCellValue());
                clients.setPhone(row.getCell(6).getStringCellValue());

                clientRepository.save(clients);

                List<String> scenarioNames = Arrays.asList(scenarioName);
                List<Scenario> scenarios = scenarioRepository.findByNameIn(scenarioNames);
                Set<Scenario> scenarioSet = new HashSet<>(scenarios);
                clients.setScenarios(scenarioSet);



                callLog.setCallType(callTypes);
                callLog.setCallResult(callResults);
                callLog.setClient(clients);
                callLog.setContact(contacts);
                callLog.setTag(tags);
                callLog.setEmployee(employees);
                callLog.setScenario(scenario);
                callLog.setCallLogTypeResult(callLogTypeResult);
                contacts.setOrganization(organizations);
                contacts.setContactPost(contactPost);

            }


            // Закрытие книги и поток ввода
            workbook.close();
            fis.close();

        } catch (IOException e) {
            e.printStackTrace();

        }

    }

    private String getRowAsString(Row row) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < row.getLastCellNum(); i++) {
            Cell cell = row.getCell(i);
            String value = (cell != null) ? cell.getStringCellValue() : "";
            sb.append(value);
            if (i < row.getLastCellNum() - 1) {
                sb.append("\t");
            }
        }
        return sb.toString();
    }

    @CacheEvict("reportData" )
    public void clearReportDataCache() {
        cacheManager.getCache("reportData").clear();
    }

    @Cacheable("reportData")
    public List<CallLog> getReportData(){
        System.out.println("Getting report data");
        return callLogRepository.findAll();
    }

    // клиентов
    // справочники
    // статистика контактов

  //  @Cacheable("clientsData")
    public List<Clients> getClietntsData(){return clientRepository.findAll();}

  //  @Cacheable("callLogTypeResult")
    public List<CallLogTypeResult> getCallLogTypeResult(){
        return callLogTypeResultRepository.findAll();
    }

   // @Cacheable("callResults")
    public List<CallResults> getCallResults(){
        return callResultRepository.findAll();
    }

   // @Cacheable("callTypes")
    public List<CallTypes> getCallTypes(){
        return  callTypeRepository.findAll();
    }

  //  @Cacheable("employees")
    public List<Employees> getEmployees(){
        return empoyeesRepository.findAll();
    }

   // @Cacheable("scenario")
    public List<Scenario> getScenario(){
        return scenarioRepository.findAll();
    }

    // @Cacheable("tags")
    public List<Tags> getTags(){
        return tagRepository.findAll();
    }


    // количество клиентов
    public int countTotalClients() {
        return clientRepository.countAll();
    }

    // количество = по проекту
    public int countProject() {
        CallTypes callType = callTypeRepository.findByName("По проекту");
        return callLogRepository.countByCallType(callType);
    }


    // количество успешных звонков
    public int countSuccessTypeResult(){
        CallLogTypeResult successTypeResult = callLogTypeResultRepository.findByNametyperesult("Успешные");

        if (successTypeResult != null) {
            return callLogRepository.countByCallLogTypeResult(successTypeResult);
        }

        return 0;
    }

    // лид передан
    public int countLead() {
        CallResults callResult = callResultRepository.findByName("ЛИД Передан");
        return callLogRepository.countByCallResult(callResult);
    }

    // дозвонились (не системные)
    public Map<String, Integer> countGotThrough() {
        Map<String, Integer> countMap = new HashMap<>();
        countMap.put("ЛИД Передан", callLogRepository.countByCallResultName("ЛИД Передан"));
        countMap.put("Отказ", callLogRepository.countByCallResultName("Отказ"));
        countMap.put("Перезвон", callLogRepository.countByCallResultName("Перезвон"));

        int totalCount = countMap.values().stream().mapToInt(Integer::intValue).sum();
        countMap.put("Общее количество", totalCount);

        return countMap;
    }



}










