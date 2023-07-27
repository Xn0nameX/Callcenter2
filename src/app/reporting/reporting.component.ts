import { Component } from '@angular/core';
import { ApiService} from "../Api/api.service";


@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.css']
})
export class ReportingComponent {
  clients: any[] = [];
  selectedFile: File | null = null;

  reportData: any[]=[]; // Исходные данные отчета
  filteredData: any[]=[]; // Отфильтрованные данные отчета
  
  selectedClientId: string | null = null;

  constructor(private apiService: ApiService) {
    this.getClients(); // Получение списка клиентов при загрузке страницы
    this.fetchReportData();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // загрузка отчета
  uploadReport() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this.apiService.uploadReport(formData).subscribe(
        (response) => {
          console.log('Отчет успешно загружен', response);
          // this.getReportSummary(); // Вызов метода для получения данных отчета
        },
        (error) => {
          console.log('Ошибка загрузки отчета', error);
        }
      );
    }
  }

  getReportSummary() {
    this.apiService.getReportSummary().subscribe(
      (response) => {
        console.log('Данные отчета', response);
        this.reportData = response; // Сохранение данных отчета в свойство reportData
      },
      (error) => {
        console.log('Ошибка получения данных отчета', error);
      }
    );
  }
  getClients() {
    this.apiService.getClients().subscribe(
      (data: any[]) => {
        this.clients = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  fetchReportData() {
    this.apiService.getReportSummary().subscribe(
      (data: any[]) => {
        this.reportData = data;
        this.filterByClient();
      },
      (error) => {
        console.error(error);
      }
    );
  }
  filterByClient() {
    let TagElement = (document.getElementById('clientSelect') as HTMLSelectElement);
    const selectedTagElement = TagElement ? TagElement.selectedOptions[0].textContent : '';
    console.log(selectedTagElement)
    if (selectedTagElement !== 'Все клиенты') {
      this.reportData = this.reportData.filter((item: any) => item.client?.name_and_family ===selectedTagElement);
      console.log(this.reportData)
    } else {
      this.fetchReportData(); // Если выбрана опция "Все клиенты", получить все данные отчета
    } 
  }
}