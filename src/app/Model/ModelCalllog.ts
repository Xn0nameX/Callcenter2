import { Employees } from "./ModelEmployees";
import { CallTypes } from "./ModelCallTypes";
import { Scenario } from "./ModelScenario";
import { CallResults } from "./ModelCallResults";
import { Contacts } from "./ModelContacts";
import { Tags } from "./ModelTags";
import { Clients } from "./ModelClients";
import { CallLogTypeResult } from "./CallLogTypeResult";

export class CallLog {
  call_id: number;
  call_date: string;
  call_time: string;
  employee: Employees;
  callType: CallTypes;
  duration: string;
  client: Clients;
  scenario: Scenario;
  callResult: CallResults;
  comment: string;
  contact: Contacts;
  tag: Tags;
  callLogTypeResult: CallLogTypeResult;
  idzapisi: number;

  constructor(
    call_id: number,
    call_date: string,
    call_time: string,
    employee: Employees,
    callType: CallTypes,
    duration: string,
    client: Clients,
    scenario: Scenario,
    callResult: CallResults,
    comment: string,
    contact: Contacts,
    tag: Tags,
    callLogTypeResult: CallLogTypeResult,
    idzapisi: number
  ) {
    this.call_id = call_id;
    this.call_date = call_date;
    this.call_time = call_time;
    this.employee = employee;
    this.callType = callType;
    this.duration = duration;
    this.client = client;
    this.scenario = scenario;
    this.callResult = callResult;
    this.comment = comment;
    this.contact = contact;
    this.tag = tag;
    this.callLogTypeResult = callLogTypeResult;
    this.idzapisi = idzapisi;
  }
}