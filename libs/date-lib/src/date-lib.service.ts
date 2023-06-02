import { Injectable } from "@nestjs/common";

@Injectable()
export class DateLibService {
    getDueDate(countDay: number): string {
        const now = Date.now()
        const dateNow = new Date(now)
        let year = dateNow.getFullYear()
        let month = dateNow.getMonth() + 1
        let day = dateNow.getDate() + countDay
        let hour = dateNow.getHours()
        let minute = dateNow.getMinutes()
        let second = dateNow.getSeconds()
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    }

    getDateNow(): string {
        const now = Date.now()
        const dateNow = new Date(now)
        let year = dateNow.getFullYear().toString()
        let month = (dateNow.getMonth() + 1).toString()
        let day = dateNow.getDate().toString()
        let hour = dateNow.getHours().toString()
        let minute = dateNow.getMinutes().toString()
        let second = dateNow.getSeconds().toString()
        hour = parseInt(hour) < 10 ? '0' + hour : hour
        minute = parseInt(minute) < 10 ? '0' + minute : minute
        second = parseInt(second) < 10 ? '0' + second : second
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    }

    convertDate(date): string {
        const dateConvert = new Date(date)
        let year = dateConvert.getFullYear().toString()
        let month = (dateConvert.getMonth() + 1).toString()
        let day = dateConvert.getDate().toString()
        day = parseInt(day) < 10 ? '0' + day : day
        month = parseInt(month) < 10 ? '0' + month : month
        return `${year}-${month}-${day}`
    }

    convertDateYMD(date): string {
        const dateConvert = new Date(date)
        let year = dateConvert.getFullYear().toString()
        let month = (dateConvert.getMonth() + 1).toString()
        let day = dateConvert.getDate().toString()
        let hour = dateConvert.getHours().toString()
        let minute = dateConvert.getMinutes().toString()
        let second = dateConvert.getSeconds().toString()
        day = parseInt(day) < 10 ? '0' + day : day
        month = parseInt(month) < 10 ? '0' + month : month
        hour = parseInt(hour) < 10 ? '0' + hour : hour
        minute = parseInt(minute) < 10 ? '0' + minute : minute
        second = parseInt(second) < 10 ? '0' + second : second
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    }
}