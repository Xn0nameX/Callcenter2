import { Component, OnInit } from '@angular/core';
import { Chart, LinearScale, CategoryScale, LineController, PointElement, LineElement, ArcElement, Legend, Tooltip,PieController } from 'chart.js';
import { RouterModule } from '@angular/router';
import { formatDate } from '@angular/common';
import { ApiService} from "./Api/api.service";
import {CallLog} from "./Model/ModelCalllog";
import { CallResults } from './Model/ModelCallResults';
import { FormsModule } from '@angular/forms';
import * as moment from 'moment';
import { Moment } from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  durationstart: string = '';
  durationend: string = '';

  tags: any[] = [];
  selectedTag: string = 'Всё';

  employees: any[] = [];
  selectedEmployeee: string = 'Все';

  scenarios: any[] = [];
  selectedScenario: string='Всё'

  callResults: any[] = [];
  selectedCallResults:string='Всё'
  title = 'my-chart-app';
  reportData: any;

  contactedCount: number | undefined;
  resultSuccess: number | undefined;
  resultSuccessPercent: number | undefined;
  contactedCountThe_Bell_Rang: number | undefined;
  resultThe_Bell_RangPercent: number | undefined;
  uniqueTags: string[] = [];
  uniquecalltypes: string[] = [];
  uniqueTag2=this.uniqueTags;
  uniqueresults: string[]=[];

    constructor(private apiService: ApiService) {}
  //вывод
  ngOnInit() {
      Chart.register(LinearScale, CategoryScale, LineController, PointElement, LineElement, ArcElement, Legend, Tooltip, PieController);
      this.apiService.getEmployees().subscribe(
        (response: any) => {
          this.employees = response;
        },
        (error: any) => {
          console.error(error);
        }
      );
      this.getEmployees();
      this.getScenarios();
      this.getCallResults();
      this.getTags();
      this.fetchReportData();
      console.log(this.tags)


  }

  getCallResults() {
    this.apiService.getCallResults().subscribe(
      (response: any) => {
        this.callResults = response; // Сохраняем данные результатов звонков в переменную callResults
      },
      (error: any) => {
        console.error(error);
      }
    );
  }
  getScenarios() {
    this.apiService.getScenario().subscribe(
      (response: any) => {
        this.scenarios = response; // Сохраняем данные сценариев в переменную scenarios
      },
      (error: any) => {
        console.error(error);
      }
    );
  }
  getTags() {
    this.apiService.getTags().subscribe(
      (response: any) => {
        this.tags = response;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }


  getEmployees() {
    this.apiService.getEmployees().subscribe(
      (response: any) => {
        this.employees = response;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }
  clearLists() {
    this.uniqueTags = [];
    this.uniqueresults = [];
    this.uniquecalltypes = [];
  }

  fetchReportData() {
    this.apiService.getReportSummary().subscribe(
      (data: any[]) => {
        this.reportData = data;
        this.calculateCounts();
      },
      (error) => {
        console.error('Error fetching report data:', error);
      }
    );
  }


  calculateCounts() {
  const tagResultsElement = document.getElementById('tagResults') as HTMLSelectElement;
  const tagSelectFirstElement = document.getElementById('tagSelectFirst') as HTMLSelectElement;
  const projectSelectedElement = document.getElementById('projectSelected') as HTMLSelectElement;
  const userSelectedElement = document.getElementById('userSelected') as HTMLSelectElement;

  const selectedResult = tagResultsElement ? tagResultsElement.selectedOptions[0].textContent : '';
  const selectedTag = tagSelectFirstElement ? tagSelectFirstElement.selectedOptions[0].textContent : '';
  const selectedProject = projectSelectedElement ? projectSelectedElement.selectedOptions[0].textContent : '';
  const selectedUser = userSelectedElement ? userSelectedElement.selectedOptions[0].textContent : '';

  const params = {
      callResult: selectedResult,
      tag: selectedTag,
      scenario: selectedProject,
      family: selectedUser
    };

    this.apiService.countFilteredCalls(params).subscribe(
      (count: number) => {
        this.resultSuccess = count;
      },
      (error) => {
        console.error(error);
      }
    );
    
    this.apiService.getFilteredCalls(params).subscribe(
      (filteredCalls: any[]) => {
        this.contactedCountThe_Bell_Rang = filteredCalls.length;
      },
      (error) => {
        console.error(error);
      }
    );
  }
  selectedEmployee: string | null = 'Все';
  selectedcalltype: string | null = null;
  

  createChart() {

  const for_num: number = +this.durationstart;
  const under_num: number = +this.durationend;
  const missedCallsData = this.getMissedCallsData();
  const outgoingCallsData = this.getOutgoingCallsData();
  const incomingCallsData = this.getIncomingCallsData();
  /*const CancerData=this.getCancerData();
  const noanswer=this.getNoanswerData();
  const NoAnswerAutoReplyData = this.getNoAnswerAutoReplyData();
  const AutoReplyDetectedData = this.getAutoReplyDetectedData();
  const RejectedData = this.getRejectedData();
  const NoData = this.getNoData();
  const LostData = this.getLostData();
  const NoAnswerHangupData = this.getNoAnswerHangupData();
  const BusyData = this.getBusyData();
  const LeadTransferredData = this.getLeadTransferredData();
  const NoAnswerSilenceData = this.getNoAnswerSilenceData();
  const UnknownErrorData = this.getUnknownErrorData();
  const NoAnswerRemoveFromWorkData = this.getNoAnswerRemoveFromWorkData();
  const SystemErrorData = this.getSystemErrorData();
  const NoResultData = this.getNoResultData();*/
  
  const sumUpload = missedCallsData.reduce((total, current) => total + current, 0);
  const sumGot = outgoingCallsData.reduce((total, current) => total + current, 0);
  const sumTransfered = incomingCallsData.reduce((total, current) => total + current, 0);

  // ось X
  const labels = this.getLabels();
  labels.sort((a: string, b: string) => {
    const dateA: Moment = moment(a, 'DD.MM.YYYY');
    const dateB: Moment = moment(b, 'DD.MM.YYYY');
    return dateA.diff(dateB);
  });

  // данные графика
  var dataFirst = {
    label: "Загружено",
    data: missedCallsData,
    borderColor: 'red',
    backgroundColor: 'transparent',
    lineTension: 0.3,
  };
  console.log(labels)

  var dataSecond = {
    label: "Дозвонились",
    data: outgoingCallsData,
    borderColor: 'blue',
    backgroundColor: 'transparent',
  };

  var dataThird = {
    label: "Передано",
    data: incomingCallsData,
    borderColor: 'green',
    backgroundColor: 'transparent',
  };

  var speedData = {
    labels: labels,
    datasets: [dataFirst, dataSecond, dataThird]
  };

  // проверка и уничтожение предыдущего графика
  const existingChart = Chart.getChart('MyChart');
  if (existingChart) {
    existingChart.destroy();
  }
  const existingPieChart = Chart.getChart('MyPie');
  if (existingPieChart) {
    existingPieChart.destroy();
  }
  
// настройки графика
var lineChart = new Chart("MyChart", {
  type: 'line',
  data: speedData,
  options: {
    plugins: {
      legend: {
        display: true
      }
    },
    scales: {
      x: {
        type: 'category', // используем тип "category" для оси X
      },
    },
  },
});

    /*const totalCancerData = CancerData.reduce((a, b) => a + b, 0);
    const totalnoanswerData = noanswer.reduce((a, b) => a + b, 0);
    const totalNoAnswerAutoReplyData = NoAnswerAutoReplyData.reduce((a, b) => a + b, 0);
    const totalAutoReplyDetectedData = AutoReplyDetectedData.reduce((a, b) => a + b, 0);
    const totalRejectedData = RejectedData.reduce((a, b) => a + b, 0);
    const totalNoData = NoData.reduce((a, b) => a + b, 0);
    const totalLostData = LostData.reduce((a, b) => a + b, 0);
    const totalNoAnswerHangupData = NoAnswerHangupData.reduce((a, b) => a + b, 0);
    const totalBusyData = BusyData.reduce((a, b) => a + b, 0);
    const totalLeadTransferredData = LeadTransferredData.reduce((a, b) => a + b, 0);
    const totalNoAnswerSilenceData = NoAnswerSilenceData.reduce((a, b) => a + b, 0);
    const totalUnknownErrorData = UnknownErrorData.reduce((a, b) => a + b, 0);
    const totalNoAnswerRemoveFromWorkData = NoAnswerRemoveFromWorkData.reduce((a, b) => a + b, 0);
    const totalSystemErrorData = SystemErrorData.reduce((a, b) => a + b, 0);
    const totalNoResultData = NoResultData.reduce((a, b) => a + b, 0);*/

    //настройки пирога
    var pieData = {
      labels: ['Загружено', 'Дозвонились', 'Передано'],
      datasets: [{
        data: [sumUpload,sumGot,sumTransfered],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }]
    };

    var pieOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true
        }
      }
    };
    var dataSum = pieData.datasets[0].data.reduce((a, b) => a + b, 0);

    //пирог
    var pieChart = new Chart('MyPie', {
      type: 'pie',
      data: pieData,
      options: pieOptions
    });
    var totalElement = document.getElementById('total');
    var totalElementUpload = document.getElementById('totalupload');
    var totalElementgot = document.getElementById('totalgot');
    var totalElementtransferred = document.getElementById('totaltransferred');
    
    if (totalElementUpload) {
      totalElementUpload.innerHTML = '' + sumUpload;
    }
    if (totalElementgot) {
      totalElementgot.innerHTML = '' + sumGot;
    }
    if (totalElementtransferred) {
      totalElementtransferred.innerHTML = '' + sumTransfered;
    }
  }
  convertToSeconds(duration: string): number {
    const [hoursStr, minutesStr, secondsStr] = duration.split(':');
    const hours: number = +hoursStr;
    const minutes: number = +minutesStr;
    const seconds: number = +secondsStr;

    return (hours * 3600) + (minutes * 60) + seconds;
  }
  getMissedCallsData(): number[] {

    let Projectt = (document.getElementById('prodjectGraphik') as HTMLSelectElement);
    const selectedProject = Projectt ? Projectt.selectedOptions[0].textContent : '';

    let Tag = (document.getElementById('tagSelectSecond') as HTMLSelectElement);
    const selectedTag = Tag ? Tag.selectedOptions[0].textContent : '';

    let Employee = (document.getElementById('userSelected2') as HTMLSelectElement);
    const selectedEmployee = Employee ? Employee.selectedOptions[0].textContent : '';

    let startDate = (document.getElementById('startDate') as HTMLInputElement).value;
    let endDate = (document.getElementById('endDate') as HTMLInputElement).value;
    const missedCallsData: number[] = [];
    //const for_num: number = +this.durationstart;
    //const under_num: number = +this.durationend;
  
    this.getLabels().forEach((typeresult: string) => {
      let count = 0;
  
      // Проверяем, есть ли выбранный тег и проект
      if (selectedTag === 'Всё' && selectedEmployee === 'Все' && selectedProject === 'Все') {
        count = this.reportData.filter((callLog: CallLog) => {
          if (callLog.call_date === typeresult) {
            // Проверяем длительность звонка и дату
            const callDateStr: string = callLog.call_date; // Получение значения из базы данных
            const callDateParts: string[] = callDateStr.split('.'); // Разделение строки на компоненты даты
            const day: number = parseInt(callDateParts[0], 10); // Преобразование дня в число
            const month: number = parseInt(callDateParts[1], 10) - 1; // Преобразование месяца в число (значения месяцев в JavaScript начинаются с 0)
            const year: number = parseInt(callDateParts[2], 10); // Преобразование года в число, предполагая, что YY представляет год 2000+

            const callDate: Date = new Date(year, month, day); // Создание объекта Date
            const selectedStartDate: Date = new Date(startDate);
            const selectedEndDate: Date = new Date(endDate);
            console.log(selectedStartDate)
            return  callDate >= selectedStartDate && callDate <= selectedEndDate;
            
          }
          return false;
        }).length;
      } else if (selectedTag === 'Всё' && selectedEmployee !== 'Все' && selectedProject === 'Все') {
        count = this.reportData.filter((callLog: CallLog) => {
          if (callLog.employee && callLog.employee.family === selectedEmployee && callLog.call_date === typeresult) {
            // Проверяем длительность звонка и дату
            const callDateStr: string = callLog.call_date; // Получение значения из базы данных
            const callDateParts: string[] = callDateStr.split('.'); // Разделение строки на компоненты даты
            const day: number = parseInt(callDateParts[0], 10); // Преобразование дня в число
            const month: number = parseInt(callDateParts[1], 10) - 1; // Преобразование месяца в число (значения месяцев в JavaScript начинаются с 0)
            const year: number = parseInt(callDateParts[2], 10); // Преобразование года в число, предполагая, что YY представляет год 2000+

            const callDate: Date = new Date(year, month, day); // Создание объекта Date
            const selectedStartDate: Date = new Date(startDate);
            const selectedEndDate: Date = new Date(endDate);
            return  callDate >= selectedStartDate && callDate <= selectedEndDate;
          }
          return false;
        }).length;
      } else if (selectedTag !== 'Всё' && selectedEmployee === 'Все' && selectedProject === 'Все') {
        count = this.reportData.filter((callLog: CallLog) => {
          if ( callLog.tag && callLog.tag.nameTag === selectedTag && callLog.call_date === typeresult) {
            // Проверяем длительность звонка и дату
            const callDateStr: string = callLog.call_date; // Получение значения из базы данных
            const callDateParts: string[] = callDateStr.split('.'); // Разделение строки на компоненты даты
            const day: number = parseInt(callDateParts[0], 10); // Преобразование дня в число
            const month: number = parseInt(callDateParts[1], 10) - 1; // Преобразование месяца в число (значения месяцев в JavaScript начинаются с 0)
            const year: number = parseInt(callDateParts[2], 10); // Преобразование года в число, предполагая, что YY представляет год 2000+

            const callDate: Date = new Date(year, month, day); // Создание объекта Date
            const selectedStartDate: Date = new Date(startDate);
            const selectedEndDate: Date = new Date(endDate);
            return  callDate >= selectedStartDate && callDate <= selectedEndDate;
          }
          return false;
        }).length;
      } else if (selectedTag === 'Всё' && selectedEmployee === 'Все' && selectedProject !== 'Все') {
        count = this.reportData.filter((callLog: CallLog) => {
          if (callLog.scenario && callLog.scenario.name === selectedProject && callLog.call_date === typeresult) {
            // Проверяем длительность звонка и дату
            const callDateStr: string = callLog.call_date; // Получение значения из базы данных
            const callDateParts: string[] = callDateStr.split('.'); // Разделение строки на компоненты даты
            const day: number = parseInt(callDateParts[0], 10); // Преобразование дня в число
            const month: number = parseInt(callDateParts[1], 10) - 1; // Преобразование месяца в число (значения месяцев в JavaScript начинаются с 0)
            const year: number = parseInt(callDateParts[2], 10); // Преобразование года в число, предполагая, что YY представляет год 2000+

            const callDate: Date = new Date(year, month, day); // Создание объекта Date
            const selectedStartDate: Date = new Date(startDate);
            const selectedEndDate: Date = new Date(endDate);
            return  callDate >= selectedStartDate && callDate <= selectedEndDate;
          }
          return false;
        }).length;
      } else if (selectedTag !== 'Всё' && selectedEmployee === 'Все' && selectedProject !== 'Все') {
        count = this.reportData.filter((callLog: CallLog) => {
          if (callLog.scenario && callLog.scenario.name === selectedProject && callLog.tag && callLog.tag.nameTag === selectedTag && callLog.call_date === typeresult) {
            // Проверяем длительность звонка и дату
            const callDateStr: string = callLog.call_date; // Получение значения из базы данных
            const callDateParts: string[] = callDateStr.split('.'); // Разделение строки на компоненты даты
            const day: number = parseInt(callDateParts[0], 10); // Преобразование дня в число
            const month: number = parseInt(callDateParts[1], 10) - 1; // Преобразование месяца в число (значения месяцев в JavaScript начинаются с 0)
            const year: number = parseInt(callDateParts[2], 10); // Преобразование года в число, предполагая, что YY представляет год 2000+

            const callDate: Date = new Date(year, month, day); // Создание объекта Date
            const selectedStartDate: Date = new Date(startDate);
            const selectedEndDate: Date = new Date(endDate);
            return callDate >= selectedStartDate && callDate <= selectedEndDate;
          }
          return false;
        }).length;
      } else if (selectedTag === 'Всё' && selectedEmployee !== 'Все' && selectedProject !== 'Все') {
        count = this.reportData.filter((callLog: CallLog) => {
          if (callLog.scenario && callLog.scenario.name === selectedProject && callLog.employee && callLog.employee.family === selectedEmployee && callLog.call_date === typeresult) {
            // Проверяем длительность звонка и дату
            const callDateStr: string = callLog.call_date; // Получение значения из базы данных
            const callDateParts: string[] = callDateStr.split('.'); // Разделение строки на компоненты даты
            const day: number = parseInt(callDateParts[0], 10); // Преобразование дня в число
            const month: number = parseInt(callDateParts[1], 10) - 1; // Преобразование месяца в число (значения месяцев в JavaScript начинаются с 0)
            const year: number = parseInt(callDateParts[2], 10); // Преобразование года в число, предполагая, что YY представляет год 2000+

            const callDate: Date = new Date(year, month, day); // Создание объекта Date
            const selectedStartDate: Date = new Date(startDate);
            const selectedEndDate: Date = new Date(endDate);
            return callDate >= selectedStartDate && callDate <= selectedEndDate;
          }
          return false;
        }).length;
      } else {
        count = this.reportData.filter((callLog: CallLog) => {
          if (callLog.scenario && callLog.scenario.name === selectedProject && callLog.tag && callLog.tag.nameTag === selectedTag && callLog.employee && callLog.employee.family === selectedEmployee && callLog.call_date === typeresult) {
            // Проверяем длительность звонка и дату
            const callDateStr: string = callLog.call_date; // Получение значения из базы данных
            const callDateParts: string[] = callDateStr.split('.'); // Разделение строки на компоненты даты
            const day: number = parseInt(callDateParts[0], 10); // Преобразование дня в число
            const month: number = parseInt(callDateParts[1], 10) - 1; // Преобразование месяца в число (значения месяцев в JavaScript начинаются с 0)
            const year: number = parseInt(callDateParts[2], 10); // Преобразование года в число, предполагая, что YY представляет год 2000+

            const callDate: Date = new Date(year, month, day); // Создание объекта Date
            const selectedStartDate: Date = new Date(startDate);
            const selectedEndDate: Date = new Date(endDate);
            return callDate >= selectedStartDate && callDate <= selectedEndDate;
          }
          return false;
        }).length;
      }
      missedCallsData.push(count);
    });
  
    return missedCallsData;
  }
  


  getOutgoingCallsData(): number[] {
    let Projectt = (document.getElementById('prodjectGraphik') as HTMLSelectElement);
    const selectedProject = Projectt ? Projectt.selectedOptions[0].textContent : '';
  
    let Tag = (document.getElementById('tagSelectSecond') as HTMLSelectElement);
    const selectedTag = Tag ? Tag.selectedOptions[0].textContent : '';
  
    let Employee = (document.getElementById('userSelected2') as HTMLSelectElement);
    const selectedEmployee = Employee ? Employee.selectedOptions[0].textContent : '';
  
    let startDate = (document.getElementById('startDate') as HTMLInputElement).value;
    let endDate = (document.getElementById('endDate') as HTMLInputElement).value;
    const missedCallsData: number[] = [];
   
  
    this.getLabels().forEach((typeresult: string) => {
      let count = 0;
  
      if (selectedTag === 'Всё' && selectedEmployee === 'Все' && selectedProject === 'Все') {
        count = this.reportData.filter((callLog: CallLog) => {
          if (callLog.call_date === typeresult && (callLog.callResult && callLog.callResult.name === 'Отказ' || callLog.callResult && callLog.callResult.name === 'ЛИД Передан')) {
            const callDateStr: string = callLog.call_date;
            const callDateParts: string[] = callDateStr.split('.');
            const day: number = parseInt(callDateParts[0], 10);
            const month: number = parseInt(callDateParts[1], 10) - 1;
            const year: number = parseInt(callDateParts[2], 10);
  
            const callDate: Date = new Date(year, month, day);
            const selectedStartDate: Date = new Date(startDate);
            const selectedEndDate: Date = new Date(endDate);
            return callDate >= selectedStartDate && callDate <= selectedEndDate;
          }
          return false;
        }).length;
      } else if (selectedTag === 'Всё' && selectedEmployee !== 'Все' && selectedProject === 'Все') {
        count = this.reportData.filter((callLog: CallLog) => {
          if (callLog.employee && callLog.employee.family === selectedEmployee && callLog.call_date === typeresult && (callLog.callResult && callLog.callResult.name === 'Отказ' || callLog.callResult && callLog.callResult.name === 'ЛИД Передан')) {
            const callDateStr: string = callLog.call_date;
            const callDateParts: string[] = callDateStr.split('.');
            const day: number = parseInt(callDateParts[0], 10);
            const month: number = parseInt(callDateParts[1], 10) - 1;
            const year: number = parseInt(callDateParts[2], 10);
  
            const callDate: Date = new Date(year, month, day);
            const selectedStartDate: Date = new Date(startDate);
            const selectedEndDate: Date = new Date(endDate);
            return callDate >= selectedStartDate && callDate <= selectedEndDate;
          }
          return false;
        }).length;
      } else if (selectedTag !== 'Всё' && selectedEmployee === 'Все' && selectedProject === 'Все') {
        count = this.reportData.filter((callLog: CallLog) => {
          if (callLog.tag && callLog.tag.nameTag === selectedTag && callLog.call_date === typeresult && (callLog.callResult && callLog.callResult.name === 'Отказ' || callLog.callResult && callLog.callResult.name === 'ЛИД Передан')) {
            const callDateStr: string = callLog.call_date;
            const callDateParts: string[] = callDateStr.split('.');
            const day: number = parseInt(callDateParts[0], 10);
            const month: number = parseInt(callDateParts[1], 10) - 1;
            const year: number = parseInt(callDateParts[2], 10);
  
            const callDate: Date = new Date(year, month, day);
            const selectedStartDate: Date = new Date(startDate);
            const selectedEndDate: Date = new Date(endDate);
            return callDate >= selectedStartDate && callDate <= selectedEndDate;
          }
          return false;
        }).length;
      } else if (selectedTag === 'Всё' && selectedEmployee === 'Все' && selectedProject !== 'Все') {
        count = this.reportData.filter((callLog: CallLog) => {
          if (callLog.scenario && callLog.scenario.name === selectedProject && callLog.call_date === typeresult && (callLog.callResult && callLog.callResult.name === 'Отказ' || callLog.callResult && callLog.callResult.name === 'ЛИД Передан')) {
            const callDateStr: string = callLog.call_date;
            const callDateParts: string[] = callDateStr.split('.');
            const day: number = parseInt(callDateParts[0], 10);
            const month: number = parseInt(callDateParts[1], 10) - 1;
            const year: number = parseInt(callDateParts[2], 10);
  
            const callDate: Date = new Date(year, month, day);
            const selectedStartDate: Date = new Date(startDate);
            const selectedEndDate: Date = new Date(endDate);
            return callDate >= selectedStartDate && callDate <= selectedEndDate;
          }
          return false;
        }).length;
      } else if (selectedTag !== 'Всё' && selectedEmployee === 'Все' && selectedProject !== 'Все') {
        count = this.reportData.filter((callLog: CallLog) => {
          if (callLog.scenario && callLog.scenario.name === selectedProject && callLog.tag && callLog.tag.nameTag === selectedTag && callLog.call_date === typeresult && (callLog.callResult && callLog.callResult.name === 'Отказ' || callLog.callResult && callLog.callResult.name === 'ЛИД Передан')) {
            const callDateStr: string = callLog.call_date;
            const callDateParts: string[] = callDateStr.split('.');
            const day: number = parseInt(callDateParts[0], 10);
            const month: number = parseInt(callDateParts[1], 10) - 1;
            const year: number = parseInt(callDateParts[2], 10);
  
            const callDate: Date = new Date(year, month, day);
            const selectedStartDate: Date = new Date(startDate);
            const selectedEndDate: Date = new Date(endDate);
            return callDate >= selectedStartDate && callDate <= selectedEndDate;
          }
          return false;
        }).length;
      } else if (selectedTag === 'Всё' && selectedEmployee !== 'Все' && selectedProject !== 'Все') {
        count = this.reportData.filter((callLog: CallLog) => {
          if (callLog.scenario && callLog.scenario.name === selectedProject && callLog.employee && callLog.employee.family === selectedEmployee && callLog.call_date === typeresult && (callLog.callResult && callLog.callResult.name === 'Отказ' || callLog.callResult && callLog.callResult.name === 'ЛИД Передан')) {
            const callDateStr: string = callLog.call_date;
            const callDateParts: string[] = callDateStr.split('.');
            const day: number = parseInt(callDateParts[0], 10);
            const month: number = parseInt(callDateParts[1], 10) - 1;
            const year: number = parseInt(callDateParts[2], 10);
  
            const callDate: Date = new Date(year, month, day);
            const selectedStartDate: Date = new Date(startDate);
            const selectedEndDate: Date = new Date(endDate);
            return callDate >= selectedStartDate && callDate <= selectedEndDate;
          }
          return false;
        }).length;
      } else {
        count = this.reportData.filter((callLog: CallLog) => {
          if (callLog.scenario && callLog.scenario.name === selectedProject && callLog.tag && callLog.tag.nameTag === selectedTag && callLog.employee && callLog.employee.family === selectedEmployee && callLog.call_date === typeresult && (callLog.callResult && callLog.callResult.name === 'Отказ' || callLog.callResult && callLog.callResult.name === 'ЛИД Передан')) {
            const callDateStr: string = callLog.call_date;
            const callDateParts: string[] = callDateStr.split('.');
            const day: number = parseInt(callDateParts[0], 10);
            const month: number = parseInt(callDateParts[1], 10) - 1;
            const year: number = parseInt(callDateParts[2], 10);
  
            const callDate: Date = new Date(year, month, day);
            const selectedStartDate: Date = new Date(startDate);
            const selectedEndDate: Date = new Date(endDate);
            return callDate >= selectedStartDate && callDate <= selectedEndDate;
          }
          return false;
        }).length;
      }
  
      missedCallsData.push(count);
    });
  
    return missedCallsData;
  }


  //количество входящих
  getIncomingCallsData(): number[] {
    let Projectt = (document.getElementById('prodjectGraphik') as HTMLSelectElement);
    const selectedProject = Projectt ? Projectt.selectedOptions[0].textContent : '';
  
    let Tag = (document.getElementById('tagSelectSecond') as HTMLSelectElement);
    const selectedTag = Tag ? Tag.selectedOptions[0].textContent : '';
  
    let Employee = (document.getElementById('userSelected2') as HTMLSelectElement);
    const selectedEmployee = Employee ? Employee.selectedOptions[0].textContent : '';
  
    let startDate = (document.getElementById('startDate') as HTMLInputElement).value;
    let endDate = (document.getElementById('endDate') as HTMLInputElement).value;
    const missedCallsData: number[] = [];
   
  
    this.getLabels().forEach((typeresult: string) => {
      let count = 0;
  
      if (selectedTag === 'Всё' && selectedEmployee === 'Все' && selectedProject === 'Все') {
        count = this.reportData.filter((callLog: CallLog) => {
          if (callLog.call_date === typeresult && (callLog.callResult && callLog.callResult.name === 'ЛИД Передан')) {
            console.log(callLog.callResult.name)
            const callDateStr: string = callLog.call_date;
            const callDateParts: string[] = callDateStr.split('.');
            const day: number = parseInt(callDateParts[0], 10);
            const month: number = parseInt(callDateParts[1], 10) - 1;
            const year: number = parseInt(callDateParts[2], 10);
  
            const callDate: Date = new Date(year, month, day);
            const selectedStartDate: Date = new Date(startDate);
            const selectedEndDate: Date = new Date(endDate);
            return callDate >= selectedStartDate && callDate <= selectedEndDate;
          }
          return false;
        }).length;
      } else if (selectedTag === 'Всё' && selectedEmployee !== 'Все' && selectedProject === 'Все') {
        count = this.reportData.filter((callLog: CallLog) => {
          if (callLog.employee && callLog.employee.family === selectedEmployee && callLog.call_date === typeresult && ( callLog.callResult && callLog.callResult.name === 'ЛИД Передан')) {
            const callDateStr: string = callLog.call_date;
            const callDateParts: string[] = callDateStr.split('.');
            const day: number = parseInt(callDateParts[0], 10);
            const month: number = parseInt(callDateParts[1], 10) - 1;
            const year: number = parseInt(callDateParts[2], 10);
  
            const callDate: Date = new Date(year, month, day);
            const selectedStartDate: Date = new Date(startDate);
            const selectedEndDate: Date = new Date(endDate);
            return callDate >= selectedStartDate && callDate <= selectedEndDate;
          }
          return false;
        }).length;
      } else if (selectedTag !== 'Всё' && selectedEmployee === 'Все' && selectedProject === 'Все') {
        count = this.reportData.filter((callLog: CallLog) => {
          if (callLog.tag && callLog.tag.nameTag === selectedTag && callLog.call_date === typeresult && ( callLog.callResult && callLog.callResult.name === 'ЛИД Передан')) {
            const callDateStr: string = callLog.call_date;
            const callDateParts: string[] = callDateStr.split('.');
            const day: number = parseInt(callDateParts[0], 10);
            const month: number = parseInt(callDateParts[1], 10) - 1;
            const year: number = parseInt(callDateParts[2], 10);
  
            const callDate: Date = new Date(year, month, day);
            const selectedStartDate: Date = new Date(startDate);
            const selectedEndDate: Date = new Date(endDate);
            return callDate >= selectedStartDate && callDate <= selectedEndDate;
          }
          return false;
        }).length;
      } else if (selectedTag === 'Всё' && selectedEmployee === 'Все' && selectedProject !== 'Все') {
        count = this.reportData.filter((callLog: CallLog) => {
          if (callLog.scenario && callLog.scenario.name === selectedProject && callLog.call_date === typeresult && ( callLog.callResult && callLog.callResult.name === 'ЛИД Передан')) {
            const callDateStr: string = callLog.call_date;
            const callDateParts: string[] = callDateStr.split('.');
            const day: number = parseInt(callDateParts[0], 10);
            const month: number = parseInt(callDateParts[1], 10) - 1;
            const year: number = parseInt(callDateParts[2], 10);
  
            const callDate: Date = new Date(year, month, day);
            const selectedStartDate: Date = new Date(startDate);
            const selectedEndDate: Date = new Date(endDate);
            return callDate >= selectedStartDate && callDate <= selectedEndDate;
          }
          return false;
        }).length;
      } else if (selectedTag !== 'Всё' && selectedEmployee === 'Все' && selectedProject !== 'Все') {
        count = this.reportData.filter((callLog: CallLog) => {
          if (callLog.scenario && callLog.scenario.name === selectedProject && callLog.tag && callLog.tag.nameTag === selectedTag && callLog.call_date === typeresult && ( callLog.callResult && callLog.callResult.name === 'ЛИД Передан')) {
            const callDateStr: string = callLog.call_date;
            const callDateParts: string[] = callDateStr.split('.');
            const day: number = parseInt(callDateParts[0], 10);
            const month: number = parseInt(callDateParts[1], 10) - 1;
            const year: number = parseInt(callDateParts[2], 10);
  
            const callDate: Date = new Date(year, month, day);
            const selectedStartDate: Date = new Date(startDate);
            const selectedEndDate: Date = new Date(endDate);
            return callDate >= selectedStartDate && callDate <= selectedEndDate;
          }
          return false;
        }).length;
      } else if (selectedTag === 'Всё' && selectedEmployee !== 'Все' && selectedProject !== 'Все') {
        count = this.reportData.filter((callLog: CallLog) => {
          if (callLog.scenario && callLog.scenario.name === selectedProject && callLog.employee && callLog.employee.family === selectedEmployee && callLog.call_date === typeresult && ( callLog.callResult && callLog.callResult.name === 'ЛИД Передан')) {
            const callDateStr: string = callLog.call_date;
            const callDateParts: string[] = callDateStr.split('.');
            const day: number = parseInt(callDateParts[0], 10);
            const month: number = parseInt(callDateParts[1], 10) - 1;
            const year: number = parseInt(callDateParts[2], 10);
  
            const callDate: Date = new Date(year, month, day);
            const selectedStartDate: Date = new Date(startDate);
            const selectedEndDate: Date = new Date(endDate);
            return callDate >= selectedStartDate && callDate <= selectedEndDate;
          }
          return false;
        }).length;
      } else {
        count = this.reportData.filter((callLog: CallLog) => {
          if (callLog.scenario && callLog.scenario.name === selectedProject && callLog.tag && callLog.tag.nameTag === selectedTag && callLog.employee && callLog.employee.family === selectedEmployee && callLog.call_date === typeresult && ( callLog.callResult && callLog.callResult.name === 'ЛИД Передан')) {
            const callDateStr: string = callLog.call_date;
            const callDateParts: string[] = callDateStr.split('.');
            const day: number = parseInt(callDateParts[0], 10);
            const month: number = parseInt(callDateParts[1], 10) - 1;
            const year: number = parseInt(callDateParts[2], 10);
  
            const callDate: Date = new Date(year, month, day);
            const selectedStartDate: Date = new Date(startDate);
            const selectedEndDate: Date = new Date(endDate);
            return callDate >= selectedStartDate && callDate <= selectedEndDate;
          }
          return false;
        }).length;
      }
  
      missedCallsData.push(count);
    });
  
    return missedCallsData;
  }
  /*getnotgraphik(): number[] {
    let selectedResult = (document.getElementById('tagResults') as HTMLSelectElement).value;
    let selectedTag = (document.getElementById('tagSelectFirst') as HTMLSelectElement).value;
    const noAnswerAutoReplyData: number[] = [];

    this.getLabels().forEach((typeresult: string) => {
      let count = 0;

      // Проверяем, есть ли выбранный результат и тег
      if (selectedResult === 'Всё' && selectedTag === 'Всё') {
        count = this.reportData.filter((callLog: CallLog) => {
          return callLog.callResult && callLog.callResult.name === 'Нет ответа (системный)';
        }).length;
      } else if (selectedResult === 'Всё') {
        count = this.reportData.filter((callLog: CallLog) => {
          return callLog.callResult && callLog.callResult.name === 'Нет ответа (системный)' && callLog.tag && callLog.tag.nameTag === selectedTag;
        }).length;
      } else if (selectedTag === 'Всё') {
        count = this.reportData.filter((callLog: CallLog) => {
          return callLog.callResult && callLog.callResult.name === selectedResult;
        }).length;
      } else {
        count = this.reportData.filter((callLog: CallLog) => {
          return callLog.callResult && callLog.callResult.name === selectedResult && callLog.tag && callLog.tag.nameTag === selectedTag;
        }).length;
      }
      noAnswerAutoReplyData.push(count);
    });

    return noAnswerAutoReplyData;
  }*/

  //даты
  getLabels(): string[] {
    const uniqueDates = Array.from(new Set(this.reportData.map((callLog: CallLog) => callLog.call_date)));

    return uniqueDates.map((date: unknown) => String(date));
  }

  /*getCallResultData(resultName: string): number[] {
    let selectedTag = this.selectedTag;
    const resultData: number[] = [];
    let selectedEmployee = this.selectedEmployee;
  
    this.getLabels().forEach((typeresult: string) => {
      let count = 0;
  
      // Проверяем, есть ли выбранный тег
      if (selectedTag === 'Всё' && selectedEmployee === 'Все') {
        count = this.reportData.filter((callLog: CallLog) => {
          return callLog.callResult && callLog.callResult.name === resultName;
        }).length;
      } else if (selectedTag === 'Всё' && selectedEmployee !== 'Все') {
        count = this.reportData.filter((callLog: CallLog) => {
          return callLog.callResult && callLog.callResult.name === resultName && callLog.employee && callLog.employee.family === selectedEmployee;
        }).length;
      } else if (selectedTag !== 'Всё' && selectedEmployee === 'Все') {
        count = this.reportData.filter((callLog: CallLog) => {
          return callLog.callResult && callLog.callResult.name === resultName && callLog.tag && callLog.tag.nameTag === selectedTag;
        }).length;
      } else {
        count = this.reportData.filter((callLog: CallLog) => {
          return callLog.callResult && callLog.callResult.name === resultName && callLog.tag && callLog.tag.nameTag === selectedTag && callLog.employee && callLog.employee.family === selectedEmployee;
        }).length;
      }
      resultData.push(count);
    });
  
    return resultData;
  }

  //Количество отказов
  getCancerData(): number[] {
    return this.getCallResultData('Отказ');
  }
  //Нет ответа (системный)
  getNoanswerData(): number[] {
    return this.getCallResultData('Нет ответа (системный)');
  }
  //callLog.callResult && callLog.callResult.name === 'НД автоответчик' 
  getNoAnswerAutoReplyData(): number[] {
    return this.getCallResultData('НД автоответчик');
  }
  //Обнаружен автоответчик (системный)
  getAutoReplyDetectedData(): number[] {
    return this.getCallResultData('Обнаружен автоответчик (системный)');
  }
  //Отклонен (системный)
  getRejectedData(): number[] {
    return this.getCallResultData('Отклонен (системный)');
  }
  //НД
  getNoData(): number[] {
    return this.getCallResultData('НД');
  }
  //Потерян (системный)

  getLostData(): number[] {
    return this.getCallResultData('Потерян (системный)');
  }
  //НД бросил трубку

  getNoAnswerHangupData(): number[] {
    return this.getCallResultData('НД бросил трубку');
  }
  //Занято (системный)

  getBusyData(): number[] {
    return this.getCallResultData('Занято (системный)');
  }
  //ЛИД Передан
  getLeadTransferredData(): number[] {
    return this.getCallResultData('ЛИД Передан');
  }
  //НД тишина
  getNoAnswerSilenceData(): number[] {
    return this.getCallResultData('НД тишина');
  }
  //Неопознанная ошибка (системный)

  getUnknownErrorData(): number[] {
    return this.getCallResultData('Неопознанная ошибка (системный)');
  }
  //НД убрать из работы
  getNoAnswerRemoveFromWorkData(): number[] {
    return this.getCallResultData('НД убрать из работы');
  }
  //Системная ошибка (системный)
  getSystemErrorData(): number[] {
    return this.getCallResultData('Системная ошибка (системный)');
  }
  //Без результата
  getNoResultData(): number[] {
    return this.getCallResultData('Без результата');
  }*/
}







