import { Injectable } from '@nestjs/common';

@Injectable()
export class DateLibService {
  getDueDate(countDay: number): string {
    const now = Date.now();
    const dateNow = new Date(now);
    const year = dateNow.getFullYear();
    const month = dateNow.getMonth() + 1;
    const day = dateNow.getDate() + countDay;
    const hour = dateNow.getHours();
    const minute = dateNow.getMinutes();
    const second = dateNow.getSeconds();
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  getDateNow(): string {
    const now = Date.now();
    const dateNow = new Date(now);
    const year = dateNow.getFullYear().toString();
    const month = (dateNow.getMonth() + 1).toString();
    const day = dateNow.getDate().toString();
    let hour = dateNow.getHours().toString();
    let minute = dateNow.getMinutes().toString();
    let second = dateNow.getSeconds().toString();
    hour = parseInt(hour) < 10 ? '0' + hour : hour;
    minute = parseInt(minute) < 10 ? '0' + minute : minute;
    second = parseInt(second) < 10 ? '0' + second : second;
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  convertDate(date): string {
    const dateConvert = new Date(date);
    const year = dateConvert.getFullYear().toString();
    let month = (dateConvert.getMonth() + 1).toString();
    let day = dateConvert.getDate().toString();
    day = parseInt(day) < 10 ? '0' + day : day;
    month = parseInt(month) < 10 ? '0' + month : month;
    return `${year}-${month}-${day}`;
  }

  convertDateYMD(date): string {
    const dateConvert = new Date(date);
    const year = dateConvert.getFullYear().toString();
    let month = (dateConvert.getMonth() + 1).toString();
    let day = dateConvert.getDate().toString();
    let hour = dateConvert.getHours().toString();
    let minute = dateConvert.getMinutes().toString();
    let second = dateConvert.getSeconds().toString();
    day = parseInt(day) < 10 ? '0' + day : day;
    month = parseInt(month) < 10 ? '0' + month : month;
    hour = parseInt(hour) < 10 ? '0' + hour : hour;
    minute = parseInt(minute) < 10 ? '0' + minute : minute;
    second = parseInt(second) < 10 ? '0' + second : second;
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
}
